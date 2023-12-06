import { describe, expect, test } from 'vitest';
import { pairwiseToDisjoint, toDisjoint } from './merge-ranges.ts';

describe('mergeRangesToNonOverlapping', () => {
  test('a0 < a1 < b0 < b1', () => {
    expect(pairwiseToDisjoint([1, 2], [3, 4])).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });
  // a0 < a1 < b0 = b1
  test('a0 < a1 < b0 = b1', () => {
    expect(pairwiseToDisjoint([1, 2], [2, 2])).toEqual([
      [1, 1],
      [2, 2],
    ]);
  });
  // a0 < a1 = b0 < b1
  test('a0 < a1 = b0 < b1', () => {
    expect(pairwiseToDisjoint([1, 2], [2, 3])).toEqual([
      [1, 2],
      [3, 3],
    ]);
  });
  // a0 < a1 = b0 = b1
  test('a0 < a1 = b0 = b1', () => {
    expect(pairwiseToDisjoint([1, 2], [2, 2])).toEqual([
      [1, 1],
      [2, 2],
    ]);
  });
  // a0 = a1 < b0 < b1
  test('a0 = a1 < b0 < b1', () => {
    expect(pairwiseToDisjoint([1, 1], [2, 3])).toEqual([
      [1, 1],
      [2, 3],
    ]);
  });
  // a0 = a1 < b0 = b1
  test('a0 = a1 < b0 = b1', () => {
    expect(pairwiseToDisjoint([1, 1], [2, 2])).toEqual([
      [1, 1],
      [2, 2],
    ]);
  });
  // a0 = a1 = b0 < b1
  test('a0 = a1 = b0 < b1', () => {
    expect(pairwiseToDisjoint([1, 1], [1, 3])).toEqual([
      [1, 1],
      [2, 3],
    ]);
  });
  // a0 = a1 = b0 = b1
  test('a0 = a1 = b0 = b1', () => {
    expect(pairwiseToDisjoint([1, 1], [1, 1])).toEqual([[1, 1]]);
  });

  // a0 < b0 < a1 < b1
  test('a0 < b0 < a1 < b1', () => {
    expect(pairwiseToDisjoint([1, 3], [2, 4])).toEqual([
      [1, 1],
      [2, 3],
      [4, 4],
    ]);
  });
  // a0 < b0 < a1 = b1
  test('a0 < b0 < a1 = b1', () => {
    expect(pairwiseToDisjoint([1, 3], [2, 3])).toEqual([
      [1, 1],
      [2, 3],
    ]);
  });
  // a0 = b0 < a1 < b1
  test('a0 = b0 < a1 < b1', () => {
    expect(pairwiseToDisjoint([1, 1], [2, 4])).toEqual([
      [1, 1],
      [2, 4],
    ]);
  });
  // a0 = b0 < a1 = b1
  test('a0 = b0 < a1 = b1', () => {
    expect(pairwiseToDisjoint([1, 1], [2, 2])).toEqual([
      [1, 1],
      [2, 2],
    ]);
  });

  test('it should keep total ordering', () => {
    expect(pairwiseToDisjoint([88, 99], [88, 94])).toEqual([
      [88, 94],
      [95, 99],
    ]);
  });
});

describe('nonOverlappingRanges', () => {
  test('it should merge overlapping ranges to non-overlapping', () => {
    const a: [number, number][] = [
      [0, 0],
      [1, 69],
    ];
    const b: [number, number][] = [
      [60, 97],
      [56, 59],
    ];

    const expected: [number, number][] = [
      [0, 0],
      [1, 55],
      [56, 59],
      [60, 69],
      [70, 97],
    ];

    expect(toDisjoint(a, b)).toEqual(expected);
  });

  test('it should merge overlapping ranges to non-overlapping', () => {
    const a: [number, number][] = [
      [18, 87],
      [88, 94],
    ];
    const b: [number, number][] = [
      [64, 76],
      [45, 63],
      [77, 99],
    ];

    const expected: [number, number][] = [
      [18, 44],
      [45, 63],
      [64, 76],
      [77, 87],
      [88, 94],
      [95, 99],
    ];

    expect(toDisjoint(a, b)).toEqual(expected);
  });

  test('it should merge overlapping ranges to non-overlapping', () => {
    const a: [number, number][] = [
      [0, 14],
      [15, 51],
      [52, 53],
    ];
    const b: [number, number][] = [
      [49, 56],
      [42, 48],
      [0, 41],
      [57, 60],
    ];

    const expected: [number, number][] = [
      [0, 14],
      [15, 41],
      [42, 48],
      [49, 51],
      [52, 53],
      [54, 56],
      [57, 60],
    ];

    const result = toDisjoint(a, b);
    expect(result).toEqual(expected);
  });

  test('it should merge overlapping ranges to non-overlapping', () => {
    const a: [number, number][] = [
      [50, 51],
      [52, 99],
    ];
    const b: [number, number][] = [
      [0, 36],
      [37, 38],
      [39, 53],
    ];
    const expected: [number, number][] = [
      [0, 36],
      [37, 38],
      [39, 49],
      [50, 51],
      [52, 53],
      [54, 99],
    ];
    expect(toDisjoint(a, b)).toEqual(expected);
  });
});
