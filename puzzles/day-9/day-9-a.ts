import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day9a(dataPath?: string) {
  const data = await readData(dataPath);

  let totalInterpolated = 0;

  for (let i = 0; i < data.length; i++) {
    let sequence = [...data[i].matchAll(/\b(\d+)\b/g)].map((m) =>
      m.index > 0 && m.input[m.index - 1] === '-' ? -1.0 * +m[1] : +m[1]
    );

    const lastValues = generateDifferencesUntilAllZero(sequence);

    totalInterpolated += lastValues.reduce((a, b) => a + b, 0);
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
  let lastValues = [nums[nums.length - 1]];
  let differences = generateDifferences(nums);

  while (differences.some((d) => d !== 0)) {
    lastValues.push(differences[differences.length - 1]);
    differences = generateDifferences(differences);
  }

  return lastValues;
}

const answer = await day9a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
