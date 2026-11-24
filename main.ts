// One-Line Office Joke: 24-Hour Sprint — entry writer.
//
// Holds the single joke line, checks it against the competition gate
// (UTF-8 text, 1 to 200 characters, exactly one line) and writes it to
// entry.txt inside the chosen output directory.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry itself: one line, punchline saved for the final words.
const JOKE =
  "I blocked two hours of 'focus time' on my calendar, and it immediately got booked over by a meeting titled 'Respecting Focus Time'.";

const GATE_MIN = 1;
const GATE_MAX = 200;

function checkLine(line: string): void {
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("the entry must fit on a single line");
  }
  const length = [...line].length;
  if (length < GATE_MIN || length > GATE_MAX) {
    throw new Error(
      `entry is ${length} characters; the gate allows ${GATE_MIN}-${GATE_MAX}`,
    );
  }
  if (line.trim().length === 0) {
    throw new Error("the entry cannot be only whitespace");
  }
}

function resolveOutDir(): string {
  const fromEnv = process.env.OUTPUT_DIR;
  return fromEnv && fromEnv.trim().length > 0 ? fromEnv : "/output";
}

function main(): void {
  checkLine(JOKE);

  const outDir = resolveOutDir();
  // Create the directory if needed, but never remove it: on the grading
  // runner it can be a mounted volume, and deleting a mount point fails.
  mkdirSync(outDir, { recursive: true });

  const target = join(outDir, "entry.txt");
  writeFileSync(target, JOKE, { encoding: "utf8" });

  // Read the file back and verify it holds the entry exactly: a short
  // or altered write would otherwise ship silently and fail the gate.
  const written = readFileSync(target, { encoding: "utf8" });
  if (written !== JOKE) {
    throw new Error(
      `entry.txt verification failed: expected ${[...JOKE].length} characters, ` +
        `read back ${[...written].length}`,
    );
  }

  console.log(`wrote ${[...JOKE].length} characters to ${target}`);
}

main();
