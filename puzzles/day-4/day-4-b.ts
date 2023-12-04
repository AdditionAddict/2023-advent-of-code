import { readData } from '../../shared.ts';
import chalk from 'chalk';

const scores = new Map<number, number>();

export async function day4b(dataPath?: string) {
  const data = await readData(dataPath);

  for (let [idx, line] of data.entries()) {
    const game = line.split(': ')[1].split(' | ');
    const wCard = game[0].split(' ').filter((s) => s !== '');
    const aCard = game[1].split(' ').filter((s) => s !== '');

    const winningNums = new Set(wCard);

    const matchingCount = aCard.filter((a) => winningNums.has(a)).length;
    scores.set(idx + 1, matchingCount);
  }

  let cumSum = 0;
  for (let i = 1; i <= data.length; i++) {
    cumSum += numberOfCards(i);
  }

  return cumSum;
}

const memoNumberOfCards = new Map<number, number>();

function numberOfCards(n: number) {
  let sum = 1;
  for (let i = 1; i < n; i++) {
    sum += memoNumberOfCards.has(n - i)
      ? includeCards(n, n - i) * memoNumberOfCards.get(n - i)
      : includeCards(n, n - i) * numberOfCards(n - i);
  }

  memoNumberOfCards.set(n, sum);
  return sum;
}

function includeCards(n: number, i: number) {
  return scores.get(i) > n - i - 1 ? 1 : 0;
}

const answer = await day4b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
