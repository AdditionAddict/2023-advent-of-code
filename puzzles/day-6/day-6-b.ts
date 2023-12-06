import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day6b(dataPath?: string) {
  const data = await readData(dataPath);

  let count = 0;

  const time = +data[0]
    .split(':')[1]
    .split(' ')
    .filter((s) => s.length > 0)
    .join('');
  const distance = +data[1]
    .split(':')[1]
    .split(' ')
    .filter((s) => s.length > 0)
    .join('');

  for (let h = 0; h <= time; h++) {
    const distanceCalc = h * (time - h);
    if (distanceCalc > distance) count++;
  }

  return count;
}

const answer = await day6b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
