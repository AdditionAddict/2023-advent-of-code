import { P, e, s } from 'vitest/dist/reporters-LLiOBu3g.js';
import { readData } from '../../shared.ts';
import chalk from 'chalk';

type Coordinates = { x: number; y: number };

type PipeType = 'L' | 'J' | '7' | 'F' | '-' | '|' | '.' | 'S';
type Pipe = {
  pipeType: PipeType;
  coordinates: Coordinates;
  connectedTo: Coordinates[];
};

export async function day10b(dataPath?: string) {
  const data = await readData(dataPath);

  const pipeMap = new Map<`${number}_${number}`, Pipe>();
  const loopMap = new Map<`${number}_${number}`, Pipe>();
  let start: Coordinates;

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      const pipe = data[i][j] as PipeType;

      switch (pipe) {
        case 'L':
          pipeMap.set(`${i}_${j}`, {
            pipeType: pipe,
            coordinates: { x: i, y: j },
            connectedTo: [
              { x: i - 1, y: j }, // north
              { x: i, y: j + 1 }, // east
            ],
          });
          break;
        case 'J':
          pipeMap.set(`${i}_${j}`, {
            pipeType: pipe,
            coordinates: { x: i, y: j },
            connectedTo: [
              { x: i - 1, y: j }, // north
              { x: i, y: j - 1 }, // west
            ],
          });
          break;
        case '7':
          pipeMap.set(`${i}_${j}`, {
            pipeType: pipe,
            coordinates: { x: i, y: j },
            connectedTo: [
              { x: i + 1, y: j }, // south
              { x: i, y: j - 1 }, // west
            ],
          });
          break;
        case 'F':
          pipeMap.set(`${i}_${j}`, {
            pipeType: pipe,
            coordinates: { x: i, y: j },
            connectedTo: [
              { x: i + 1, y: j }, // south
              { x: i, y: j + 1 }, // east
            ],
          });
          break;
        case '-':
          pipeMap.set(`${i}_${j}`, {
            pipeType: pipe,
            coordinates: { x: i, y: j },
            connectedTo: [
              { x: i, y: j - 1 }, // west
              { x: i, y: j + 1 }, // east
            ],
          });
          break;
        case '|':
          pipeMap.set(`${i}_${j}`, {
            pipeType: pipe,
            coordinates: { x: i, y: j },
            connectedTo: [
              { x: i - 1, y: j }, // north
              { x: i + 1, y: j }, // south
            ],
          });
          break;
        case '.':
          break;
        case 'S':
          const isConnectedNorth =
            i > 0 &&
            (data[i - 1][j] === '|' ||
              data[i - 1][j] === 'F' ||
              data[i - 1][j] === '7');
          const isConnectedEast =
            j < data[i].length - 1 &&
            (data[i][j + 1] === '-' ||
              data[i][j + 1] === 'J' ||
              data[i][j + 1] === '7');
          const isConnectedSouth =
            i < data.length - 1 &&
            (data[i + 1][j] === '|' ||
              data[i + 1][j] === 'L' ||
              data[i + 1][j] === 'J');
          const isConnectedWest =
            j > 0 &&
            (data[i][j - 1] === '-' ||
              data[i][j - 1] === 'L' ||
              data[i][j - 1] === 'F');

          let pipeType: PipeType;
          switch (true) {
            case isConnectedNorth && isConnectedEast:
              pipeType = 'L';
              break;
            case isConnectedEast && isConnectedSouth:
              pipeType = 'J';
              break;
            case isConnectedSouth && isConnectedWest:
              pipeType = '7';
              break;
            case isConnectedWest && isConnectedNorth:
              pipeType = 'F';
              break;
            case isConnectedNorth && isConnectedSouth:
              pipeType = '|';
              break;
            case isConnectedEast && isConnectedWest:
              pipeType = '-';
              break;
          }

          pipeMap.set(`${i}_${j}`, {
            pipeType,
            coordinates: { x: i, y: j },
            connectedTo: [
              isConnectedNorth ? { x: i - 1, y: j } : null, // north
              isConnectedEast ? { x: i, y: j + 1 } : null, // east
              isConnectedSouth ? { x: i + 1, y: j } : null, // south
              isConnectedWest ? { x: i, y: j - 1 } : null, // west
            ].filter((c) => c !== null),
          });

          start = { x: i, y: j };
          break;
      }
    }
  }

  let lastCoordinates = start;
  let currentPipe = pipeMap.get(`${start.x}_${start.y}`).connectedTo[0];

  loopMap.set(`${start.x}_${start.y}`, pipeMap.get(`${start.x}_${start.y}`));

  while (currentPipe.x !== start.x || currentPipe.y !== start.y) {
    loopMap.set(
      `${currentPipe.x}_${currentPipe.y}`,
      pipeMap.get(`${currentPipe.x}_${currentPipe.y}`)
    );

    const pipe = pipeMap.get(`${currentPipe.x}_${currentPipe.y}`);

    const pipeOne = pipe.connectedTo[0];
    const pipeTwo = pipe.connectedTo[1];

    if (pipeOne.x === lastCoordinates.x && pipeOne.y === lastCoordinates.y) {
      currentPipe = pipeTwo;
    } else {
      currentPipe = pipeOne;
    }

    lastCoordinates = pipe.coordinates;
  }

  let totalInsideLoop = 0;

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      if (loopMap.has(`${i}_${j}`)) {
        continue;
      } else {
        let crossingHorizontal = 0;
        let criteriaForCrossing: 'F' | 'J' | 'L' | '7' | null = null;

        for (let k = j + 1; k < data[i].length; k++) {
          if (loopMap.has(`${i}_${k}`)) {
            if (data[i][k] === '|') {
              crossingHorizontal++;
            } else if (criteriaForCrossing !== null) {
              if (data[i][k] === criteriaForCrossing) {
                crossingHorizontal++;
                criteriaForCrossing = null;
              } else if (data[i][k] === '-') {
                // do nothing
              } else {
                criteriaForCrossing = null;
              }
            } else if (data[i][k] === 'F') {
              // F - ... - J
              criteriaForCrossing = 'J';
            } else if (data[i][k] === 'L') {
              // L - ... - 7
              criteriaForCrossing = '7';
            }
          } else {
            criteriaForCrossing = null;
          }
        }

        totalInsideLoop += crossingHorizontal % 2;
      }
    }
  }

  return totalInsideLoop;
}

const answer = await day10b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
