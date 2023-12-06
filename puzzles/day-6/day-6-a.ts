import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day6a(dataPath?: string) {
  const data = await readData(dataPath);

  const times = data[0]
    .split(':')[1]
    .split(' ')
    .filter((s) => s.length > 0)
    .map((n) => +n);
  const distances = data[1]
    .split(':')[1]
    .split(' ')
    .filter((s) => s.length > 0)
    .map((n) => +n);

  let product = 1;

  for (let i = 0; i < times.length; i++) {
    let count = 0;

    const time = times[i];
    const distance = distances[i];

    for (let h = 0; h <= time; h++) {
      const distanceCalc = h * (time - h);
      if (distanceCalc > distance) count++;
    }

    product *= count;
  }

  return product;
}

const answer = await day6a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
