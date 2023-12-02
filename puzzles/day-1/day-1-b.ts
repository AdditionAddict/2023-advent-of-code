import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day1b(dataPath?: string) {
  const data = await readData(dataPath);

  let answer = 0;

  const regex1 =
    /(one|two|three|four|five|six|seven|eight|nine|\d){1}.*(one|two|three|four|five|six|seven|eight|nine|\d){1}/;
  const regex2 = /(one|two|three|four|five|six|seven|eight|nine|\d){1}/;

  for (let i = 0; i < data.length; i++) {
    const matches = data[i].match(regex1) ?? data[i].match(regex2);
    const dig1 = wordToNumber(matches[1]);
    const dig2 = wordToNumber(matches[2] ?? matches[1]);

    answer += +`${dig1}${dig2}`;
  }

  return answer;
}

function wordToNumber(input: string) {
  switch (input) {
    case 'one':
      return '1';
    case 'two':
      return '2';
    case 'three':
      return '3';
    case 'four':
      return '4';
    case 'five':
      return '5';
    case 'six':
      return '6';
    case 'seven':
      return '7';
    case 'eight':
      return '8';
    case 'nine':
      return '9';
    default:
      return input;
  }
}

const answer = await day1b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
