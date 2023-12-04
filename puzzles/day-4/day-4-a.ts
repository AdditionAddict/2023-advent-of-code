import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day4a(dataPath?: string) {
  const data = await readData(dataPath);

  let totalScore = 0;

  for (let line of data) {
    const game = line.split(': ')[1].split(' | ');
    const wCard = game[0].split(' ').filter((s) => s !== '');
    const aCard = game[1].split(' ').filter((s) => s !== '');

    const winningNums = new Set(wCard);

    const matchingCount = aCard.filter((a) => winningNums.has(a)).length;
    const score = matchingCount > 0 ? Math.pow(2, matchingCount - 1) : 0;

    totalScore += score;
  }

  return totalScore;
}

const answer = await day4a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
