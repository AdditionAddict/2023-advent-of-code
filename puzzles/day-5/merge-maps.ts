import { toDisjoint } from './merge-ranges.ts';

export type ConverterMap = {
  sourceStart: number;
  destinationStart: number;
  length: number;
};

function mapPoint(
  point: number,
  maps: ConverterMap[],
  mapTo: 'source' | 'destination'
) {
  for (let m of maps) {
    switch (mapTo) {
      case 'destination':
        if (point >= m.sourceStart && point < m.sourceStart + m.length) {
          return {
            value: point + (m.destinationStart - m.sourceStart),
            sourceExists: true,
          };
        }
        break;
      case 'source':
        if (
          point >= m.destinationStart &&
          point < m.destinationStart + m.length
        ) {
          const value = point + (m.sourceStart - m.destinationStart);
          return {
            value,
            sourceExists: maps.some(
              (m) => m.sourceStart <= value && value < m.sourceStart + m.length
            ),
          };
        }
        break;
    }
  }

  return {
    value: point,
    sourceExists: false,
  };
}

export function mergeMaps(
  aMaps: ConverterMap[],
  bMaps: ConverterMap[],
  onlyIfSourceExists = false
): ConverterMap[] {
  const aDestinationRanges: [number, number][] = aMaps.map((map) => [
    map.destinationStart,
    map.destinationStart + map.length - 1,
  ]);
  const bSourceRanges: [number, number][] = bMaps.map((map) => [
    map.sourceStart,
    map.sourceStart + map.length - 1,
  ]);

  const mergedRanges = toDisjoint(aDestinationRanges, bSourceRanges);

  const newMaps = mergedRanges
    .filter((range) => {
      const [r0, r1] = range;
      const { sourceExists } = mapPoint(r0, aMaps, 'source');
      return !onlyIfSourceExists || sourceExists;
    })
    .map((range) => {
      const [r0, r1] = range;
      const { value: sourceStart } = mapPoint(r0, aMaps, 'source');
      const { value: destinationStart } = mapPoint(r0, bMaps, 'destination');

      return {
        destinationStart,
        sourceStart,
        length: r1 - r0 + 1,
      };
    });

  // sort by destinationStart
  newMaps.sort((a, b) => a.destinationStart - b.destinationStart);

  return newMaps;
}
