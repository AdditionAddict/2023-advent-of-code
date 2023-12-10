import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day9b(dataPath?: string) {
  const data = await readData(dataPath);

  let totalInterpolated = 0;

  for (let i = 0; i < data.length; i++) {
    let sequence = [...data[i].matchAll(/\b(\d+)\b/g)].map((m) =>
      m.index > 0 && m.input[m.index - 1] === '-' ? -1.0 * +m[1] : +m[1]
    );

    const firstValues = generateDifferencesUntilAllZero(sequence);

    totalInterpolated += firstValues.reduceRight((a, b) => b - a, 0);
  }

  return totalInterpolated;
}

function generateDifferences(nums: number[]) {
  let differences = [];

  for (let i = 1; i < nums.length; i++) {
    differences.push(nums[i] - nums[i - 1]);
  }

  return differences;
}

function generateDifferencesUntilAllZero(nums: number[]) {
  let firstValues = [nums[0]];
  let differences = generateDifferences(nums);

  while (differences.some((d) => d !== 0)) {
    firstValues.push(differences[0]);
    differences = generateDifferences(differences);
  }

  return firstValues;
}

const answer = await day9b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
