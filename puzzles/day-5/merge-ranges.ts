// import { assert } from 'vitest';

/**
 *
 * Return a covering set of disjoint ranges that covers (a union b) with total order preserved.
 *
 * Each set produced has the property that either:
 *  - it is a subset of a
 *  - or it is disjoint from a
 * Similarly with b.
 *
 * @param a a number range [start, end]
 * @param b a number range [start, end]
 * @returns a list of disjoint ranges
 */
export function pairwiseToDisjoint(
  a: [number, number],
  b: [number, number]
): [number, number][] {
  const a0 = a[0];
  const a1 = a[1];
  const b0 = b[0];
  const b1 = b[1];
  // assert(a0 <= a1);
  // assert(b0 <= b1);

  if (a0 > b0 || (a0 === b0 && a1 > b1)) {
    return pairwiseToDisjoint(b, a);
  }

  // Cases:
  // a0 < a1 < b0 < b1
  // a0 < a1 < b0 = b1
  // a0 < a1 = b0 < b1
  // a0 < a1 = b0 = b1
  // a0 = a1 < b0 < b1
  // a0 = a1 < b0 = b1
  // a0 = a1 = b0 < b1
  // a0 = a1 = b0 = b1

  // a0 < b0 < a1 < b1
  // a0 < b0 < a1 = b1
  // a0 < b0 = a1 < b1 ❌ duplicate
  // a0 < b0 = a1 = b1 ❌ duplicate
  // a0 = b0 < a1 < b1
  // a0 = b0 < a1 = b1
  // a0 = b0 = a1 < b1 ❌ duplicate
  // a0 = b0 = a1 = b1 ❌ duplicate

  // a0 < b0 < b1 < a1
  // a0 < b0 < b1 = a1 ❌ duplicate
  // a0 < b0 = b1 < a1
  // a0 < b0 = b1 = a1 ❌ duplicate
  // a0 = b0 < b1 < a1
  // a0 = b0 < b1 = a1 ❌ duplicate
  // a0 = b0 = b1 < a1
  // a0 = b0 = b1 = a1 ❌ duplicate

  switch (true) {
    // a0 < a1 < b0 < b1
    case a0 < a1 && a1 < b0 && b0 < b1:
      return [
        [a0, a1],
        [b0, b1],
      ];
    // a0 < a1 < b0 = b1
    case a0 < a1 && a1 < b0 && b0 === b1:
      return [
        [a0, a1],
        [b0, b0],
      ];
    // a0 < a1 = b0 < b1
    case a0 < a1 && a1 === b0 && b0 < b1:
      return [
        [a0, a1],
        [b0 + 1, b1],
      ];
    // a0 < a1 = b0 = b1
    case a0 < a1 && a1 === b0 && b0 === b1:
      return [
        [a0, a1 - 1],
        [b0, b0],
      ];
    // a0 = a1 < b0 < b1
    case a0 === a1 && a1 < b0 && b0 < b1:
      return [
        [a0, a0],
        [b0, b1],
      ];
    // a0 = a1 < b0 = b1
    case a0 === a1 && a1 < b0 && b0 === b1:
      return [
        [a0, a0],
        [b0, b0],
      ];
    // a0 = a1 = b0 < b1
    case a0 === a1 && a1 === b0 && b0 < b1:
      return [
        [a0, a0],
        [b0 + 1, b1],
      ];
    // a0 = a1 = b0 = b1
    case a0 === a1 && a1 === b0 && b0 === b1:
      return [[a0, a0]];

    // a0 < b0 < a1 < b1
    case a0 < b0 && b0 < a1 && a1 < b1:
      return [
        [a0, b0 - 1],
        [b0, a1],
        [a1 + 1, b1],
      ];
    // a0 < b0 < a1 = b1
    case a0 < b0 && b0 < a1 && a1 === b1:
      return [
        [a0, b0 - 1],
        [b0, b1],
      ];
    // a0 = b0 < a1 < b1
    case a0 === b0 && b0 < a1 && a1 < b1:
      return [
        [a0, a1],
        [a1 + 1, b1],
      ];
    // a0 = b0 < a1 = b1
    case a0 === b0 && b0 < a1 && a1 === b1:
      return [[a0, a1]];

    // a0 < b0 < b1 < a1
    case a0 < b0 && b0 < b1 && b1 < a1:
      return [
        [a0, b0 - 1],
        [b0, b1],
        [b1 + 1, a1],
      ];
    // a0 < b0 = b1 < a1
    case a0 < b0 && b0 === b1 && b1 < a1:
      return [
        [a0, b0],
        [b0 + 1, a1],
      ];
    // a0 = b0 < b1 < a1
    case a0 === b0 && b0 < b1 && b1 < a1:
      return [
        [b0, b1],
        [b1 + 1, a1],
      ];
    // a0 = b0 = b1 < a1
    case a0 === b0 && b0 === b1 && b1 < a1:
      return [
        [a0, b1],
        [b1 + 1, a1],
      ];
  }

  throw new Error('unreachable');
}

function toDisjointHelper(
  stack: [number, number][],
  disjointRanges: [number, number][]
) {
  if (stack.length === 0) return disjointRanges;

  const range = stack[0];
  stack = stack.slice(1);

  if (disjointRanges.length === 0) {
    return toDisjointHelper(stack, [range]);
  }

  const overlap = (a: [number, number]) => a[0] <= range[1] && range[0] <= a[1];
  const overlappingRanges = disjointRanges.filter(overlap);
  const nonOverlappingRanges = disjointRanges.filter((a) => !overlap(a));

  if (overlappingRanges.length === 0) {
    return toDisjointHelper(stack, [...disjointRanges, range]);
  }

  const rangeToMerge = overlappingRanges.pop();
  const mergedRanges = pairwiseToDisjoint(range, rangeToMerge);

  return toDisjointHelper(
    [...mergedRanges, ...overlappingRanges, ...stack],
    [...nonOverlappingRanges]
  );
}

export function toDisjoint(a: [number, number][], b: [number, number][]) {
  const stack = [...a, ...b];
  // sort by start, if equal, sort by end
  stack.sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]));

  return toDisjointHelper(stack, []);
}
