import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day3a(dataPath?: string) {
  const data = await readData(dataPath);

  // each number location starts at some (a, b)
  const partNumberStart = new Map<string, number>();
  const partNumberStarts = new Set<string>();
  // map other parts of the number to the start
  // (a,b) -> (a,b), (a, b+1) -> (a,b) etc.
  const partLookup = new Map<string, string>();

  for (let [i, line] of data.entries()) {
    // get part numbers and locations
    for (let match of line.matchAll(/\b(\d+)\b/g)) {
      const j = match.index;
      const part = match[1];

      // save starting location
      partNumberStart.set(`${i}_${j}`, +part);

      // save lookups to start
      for (let k = 0; k < part.length; k++) {
        partLookup.set(`${i}_${j + k}`, `${i}_${j}`);
      }
    }
  }

  for (let [i, line] of data.entries()) {
    //  symbol locations
    for (let match of line.matchAll(/([^\d.])/g)) {
      const j = match.index;

      [
        `${i - 1}_${j - 1}`,
        `${i - 1}_${j}`,
        `${i - 1}_${j + 1}`,
        `${i}_${j - 1}`,
        `${i}_${j + 1}`,
        `${i + 1}_${j - 1}`,
        `${i + 1}_${j}`,
        `${i + 1}_${j + 1}`,
      ].map((l) => {
        if (partLookup.has(l)) partNumberStarts.add(partLookup.get(l));
      });
    }
  }

  const partNumbers = [...partNumberStarts.keys()].map((l) =>
    partNumberStart.get(l)
  );

  return partNumbers.reduce((acc, curr) => acc + curr, 0);
}

const answer = await day3a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
