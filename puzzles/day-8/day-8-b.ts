import { readData } from '../../shared.ts';
import chalk from 'chalk';

type TrackEnding = {
  position: string;
  complete: boolean;
  stepCount?: number;
};

export async function day8b(dataPath?: string) {
  const data = await readData(dataPath);

  const nodeMap = new Map<string, { left: string; right: string }>();

  let tracking: TrackEnding[] = [];

  for (let i = 2; i < data.length; i++) {
    const [position, left, right] = [
      ...data[i].matchAll(/\b([0-9A-Z]{3})\b/g),
    ].map((m) => m[1]);

    nodeMap.set(position, { left, right });

    if (position.endsWith('A')) {
      tracking.push({
        position: position,
        complete: false,
      });
    }
  }

  let instructions = data[0];
  let globalStepCount = 0;

  while (!tracking.every((t) => t.complete)) {
    let instruction = instructions[globalStepCount % instructions.length] as
      | 'L'
      | 'R';

    tracking = tracking.map((t) => {
      if (t.complete) return t;

      let pos = t.position;

      switch (instruction) {
        case 'L':
          pos = nodeMap.get(pos).left;
          break;
        case 'R':
          pos = nodeMap.get(pos).right;
          break;
      }

      if (pos.endsWith('Z')) {
        return {
          position: pos,
          complete: true,
          stepCount: globalStepCount + 1,
        };
      }

      return {
        position: pos,
        complete: false,
      };
    });

    globalStepCount++;
  }

  return lowestCommonMultiple(tracking.map((t) => t.stepCount));
}

function lowestCommonMultiple(nums: number[]) {
  return nums.reduce((a, b) => {
    return (a * b) / greatestCommonDivisor(a, b);
  });
}

function greatestCommonDivisor(a: number, b: number): number {
  if (b === 0) return a;
  return greatestCommonDivisor(b, a % b);
}

const answer = await day8b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
