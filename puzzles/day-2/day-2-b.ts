import { readData } from '../../shared.ts';
import chalk from 'chalk';

const regexRed = /\b(\d+) red\b/g;
const regexGreen = /\b(\d+) green\b/g;
const regexBlue = /\b(\d+) blue\b/g;

export async function day2b(dataPath?: string) {
  const data = await readData(dataPath);

  let sumPower = 0;

  for (let game of data) {
    const gameId = +game.match(/Game (\d+).*/)[1];

    const redPicked = [...game.matchAll(regexRed)].map((m) => +m[1]);
    const greenPicked = [...game.matchAll(regexGreen)].map((m) => +m[1]);
    const bluePicked = [...game.matchAll(regexBlue)].map((m) => +m[1]);

    const maxRedPicked = Math.max(...redPicked);
    const maxGreenPicked = Math.max(...greenPicked);
    const maxBluePicked = Math.max(...bluePicked);

    sumPower += maxRedPicked * maxGreenPicked * maxBluePicked;
  }

  return sumPower;
}

const answer = await day2b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
