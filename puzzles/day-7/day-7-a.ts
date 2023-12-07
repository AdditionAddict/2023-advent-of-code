import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day7a(dataPath?: string) {
  const data = await readData(dataPath);

  let totalWinnings = 0;

  const allHands = data.map((line) => {
    const hand = line.split(' ')[0];
    const bid = +line.split(' ')[1];

    return [hand, bid] as [string, number];
  });

  allHands.sort((a, b) => handRank(a[0]) - handRank(b[0]));

  allHands.forEach((hand, idx) => {
    totalWinnings += hand[1] * (idx + 1);
  });

  return totalWinnings;
}

function handRank(hand: string): number {
  const cards = hand.split('');
  const cardCountMap = new Map<string, number>();
  cards.forEach((card) => {
    if (cardCountMap.has(card)) {
      const count = cardCountMap.get(card);
      cardCountMap.set(card, count + 1);
    } else {
      cardCountMap.set(card, 1);
    }
  });
  const cardCounts = [...cardCountMap.entries()];
  cardCounts.sort((a, b) => b[1] - a[1]);

  let rank = 0;
  switch (true) {
    // five of a kind
    case cardCounts[0][1] === 5:
      // console.log('five of a kind', hand);
      rank += 50;
      break;
    // four of a kind
    case cardCounts[0][1] === 4:
      // console.log('four of a kind', hand);
      rank += 40;
      break;
    // full house
    case cardCounts.length === 2 && cardCounts[0][1] === 3:
      // console.log('full house', hand);
      rank += 35;
      break;
    // three of a kind
    case cardCounts.length === 3 && cardCounts[0][1] === 3:
      // console.log('three of a kind', hand);
      rank += 30;
      break;
    // two pair
    case cardCounts.length === 3 && cardCounts[0][1] === 2:
      // console.log('two pair', hand);
      rank += 20;
      break;
    // one pair
    case cardCounts.length === 4:
      // console.log('one pair', hand);
      rank += 10;
      break;
    default:
      break;
  }
  /**
   *
   * Total added rank by high card breaks < 2 since we divide by 1_000_000_000
   *
   * Each range start increase exponentially so that later cards don't add up
   * to more than earlier contribution.
   *
   * 1st card [100_000_000, 1_300_000_000]  /1_000_000_000
   * 2nd card [1_000_000, 13_000_000]       /1_000_000_000
   * 3rd card [10_000, 130_000]             /1_000_000_000
   * 4th card [100, 1300]                   /1_000_000_000
   * 5th card [1, 13]                       /1_000_000_000
   */
  hand.split('').forEach((card, positionIdx) => {
    rank +=
      (1 / 1_000_000_000) *
      Math.pow(100, 4 - positionIdx) *
      ('23456789TJQKA'.split('').findIndex((c) => card === c) + 1);
  });

  return rank;
}

const answer = await day7a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
