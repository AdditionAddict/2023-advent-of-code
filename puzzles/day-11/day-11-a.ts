import { e } from 'vitest/dist/reporters-LLiOBu3g.js';
import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day11a(dataPath?: string) {
  const data = await readData(dataPath);

  let expandX: number[] = [];
  let expandY: number[] = [];

  const galaxies = new Set<`${number}_${number}`>();

  for (let i = 0; i < data.length; i++) {
    const spacePoints = data[i].split('');
    if (spacePoints.every((x) => x === '.')) {
      expandX.push(i);
    }

    for (let j = 0; j < spacePoints.length; j++) {
      if (spacePoints[j] === '#') {
        galaxies.add(`${i}_${j}`);
      }
    }
  }

  for (let j = 0; j < data[0].length; j++) {
    if (data.every((x) => x[j] === '.')) {
      expandY.push(j);
    }
  }

  const locations = [...galaxies.values()].map((x) => ({
    x: Number(x.split('_')[0]),
    y: Number(x.split('_')[1]),
  }));

  let totalDistanceBetweenGalaxies = 0;

  for (let i = 0; i < locations.length; i++) {
    for (let j = 0; j <= i; j++) {
      totalDistanceBetweenGalaxies +=
        Math.abs(locations[i].x - locations[j].x) +
        Math.abs(locations[i].y - locations[j].y) +
        expandX.filter(
          (x) =>
            x > Math.min(locations[i].x, locations[j].x) &&
            x < Math.max(locations[i].x, locations[j].x)
        ).length +
        expandY.filter(
          (y) =>
            y > Math.min(locations[i].y, locations[j].y) &&
            y < Math.max(locations[i].y, locations[j].y)
        ).length;
    }
  }

  return totalDistanceBetweenGalaxies;
}

const answer = await day11a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
