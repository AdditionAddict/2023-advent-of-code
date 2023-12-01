import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day1a(dataPath?: string) {
  const data = await readData(dataPath);

  let answer = 0;

  const regex1 = /\D?(\d{1}).*(\d{1})\D?/;
  const regex2 = /\D?(\d{1})\D?/;

  for (let i = 0; i < data.length; i++) {
    const matches = data[i].match(regex1) ?? data[i].match(regex2);
    const dig1 = matches[1];
    const dig2 = matches[2] ?? matches[1];

    console.log(`${dig1}${dig2}`);
    answer += +`${dig1}${dig2}`;
  }

  return answer;
}

const answer = await day1a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
