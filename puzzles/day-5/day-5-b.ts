import { readData } from '../../shared.ts';
import chalk from 'chalk';
import { mergeMaps } from './merge-maps.ts';

type ConverterMap = {
  sourceStart: number;
  destinationStart: number;
  length: number;
};

export async function day5b(dataPath?: string) {
  const data = await readData(dataPath);

  // get maps
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
  //

  // seed to soil ranges
  let seedToSoilMaps: ConverterMap[] = [];
  const seedRangeInput = [...data[0].matchAll(/\b(\d+)\b/g)].map((m) => +m[1]);

  for (let i = 0; i < seedRangeInput.length; i += 2) {
    const destinationStart = seedRangeInput[i];
    const sourceStart = seedRangeInput[i];
    const length = seedRangeInput[i + 1];

    seedToSoilMaps.push({
      destinationStart,
      sourceStart,
      length,
    });
  }

  // merge other maps
  const soilToLocationMaps = mapChunks.reduce(
    (acc, curr) => mergeMaps(acc, curr),
    []
  );

  // merge maps keeping only if source exists
  const finalMap = mergeMaps(seedToSoilMaps, soilToLocationMaps, true);

  return finalMap[0].destinationStart;
}

const answer = await day5b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
