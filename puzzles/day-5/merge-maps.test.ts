import { describe, expect, test } from 'vitest';
import { ConverterMap, mergeMaps } from './merge-maps.ts';

describe('mergeMaps', () => {
  test('default', () => {
    const aMaps: ConverterMap[] = [
      // [69, 69] -> [0, 0]
      {
        sourceStart: 69,
        destinationStart: 0,
        length: 1,
      },
      // [0, 68] -> [1, 69]
      {
        sourceStart: 0,
        destinationStart: 1,
        length: 69,
      },
    ];

    const bMaps: ConverterMap[] = [
      // [56, 92] -> [60, 96]
      {
        sourceStart: 56,
        destinationStart: 60,
        length: 37,
      },
      // [93, 96] -> [56, 59]
      {
        sourceStart: 93,
        destinationStart: 56,
        length: 4,
      },
    ];

    // [ [ 69, 69 ], [ 0, 54 ], [ 55, 68 ], [ 70, 92 ], [ 93, 96 ] ]
    // [ [ 0, 0 ],   [ 1, 55 ], [ 56, 69 ], [ 70, 92 ], [ 93, 96 ] ]
    // [ [ 0, 0 ],   [ 1, 55 ], [ 60, 73 ], [ 74, 96 ], [ 56, 59 ] ]

    const expected: ConverterMap[] = [
      {
        sourceStart: 0,
        destinationStart: 1,
        length: 55,
      },
      {
        sourceStart: 55,
        destinationStart: 60,
        length: 14,
      },
      {
        sourceStart: 69,
        destinationStart: 0,
        length: 1,
      },
      {
        sourceStart: 70,
        destinationStart: 74,
        length: 23,
      },
      {
        sourceStart: 93,
        destinationStart: 56,
        length: 4,
      },
    ];

    expect(mergeMaps(aMaps, bMaps)).toEqual(expected);
  });
});
