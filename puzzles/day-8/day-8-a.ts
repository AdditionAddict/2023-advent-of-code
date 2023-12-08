import { readData } from '../../shared.ts';
import chalk from 'chalk';

type Network = {
  label: string;
  left: Network | null;
  right: Network | null;
};

export async function day8a(dataPath?: string) {
  const data = await readData(dataPath);

  const nodeMap = new Map<string, { left: string; right: string }>();

  for (let i = 2; i < data.length; i++) {
    const [position, left, right] = [
      ...data[i].matchAll(/\b([A-Z]{3})\b/g),
    ].map((m) => m[1]);

    nodeMap.set(position, { left, right });
  }

  let instructions = data[0];
  let position = 'AAA';
  let stepCount = 0;

  while (position !== 'ZZZ') {
    let instruction = instructions[stepCount % instructions.length] as
      | 'L'
      | 'R';

    switch (instruction) {
      case 'L':
        position = nodeMap.get(position).left;
        break;
      case 'R':
        position = nodeMap.get(position).right;
    }

    stepCount++;
  }

  return stepCount;
}

const answer = await day8a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
