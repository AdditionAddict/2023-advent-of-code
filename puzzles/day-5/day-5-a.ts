import { readData } from '../../shared.ts';
import chalk from 'chalk';

type ConverterMap = {
  sourceStart: number;
  destinationStart: number;
  length: number;
};

export async function day5a(dataPath?: string) {
  const data = await readData(dataPath);

  const seedLocation = new Map<number, number>();

  let mapChunks: ConverterMap[][] = [];
  let mapIdx = -1;
  for (let i = 1; i < data.length; i++) {
    const line = data[i];
    if (line === '') continue;
    if (line.includes('map')) {
      mapIdx++;
      continue;
    }

    let mapVals = [...line.matchAll(/\b(\d+)\b/g)].map((m) => +m[1]);

    const destinationStart = mapVals[0];
    const sourceStart = mapVals[1];
    const length = mapVals[2];

    if (mapChunks[mapIdx] === undefined) {
      mapChunks.push([]);
    }
    mapChunks[mapIdx].push({
      destinationStart,
      sourceStart,
      length,
    });
  }

  // get seed numbers
  for (let match of data[0].matchAll(/\b(\d+)\b/g)) {
    const seed = +match[1];

    let curr = seed;

    mapChunks.forEach((chunk) => {
      curr = mapToDestination(curr, chunk);
    });

    seedLocation.set(seed, curr);
  }

  let seedLocations = [...seedLocation.entries()];
  seedLocations.sort((a, b) => a[1] - b[1]);

  return seedLocations[0][1];
}

function mapToDestination(source: number, maps: ConverterMap[]) {
  let answer = source;

  for (let i = 0; i < maps.length; i++) {
    const map = maps[i];
    if (source >= map.sourceStart && source <= map.sourceStart + map.length) {
      answer = source + map.destinationStart - map.sourceStart;
      break;
    }
  }

  return answer;
}

const answer = await day5a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
