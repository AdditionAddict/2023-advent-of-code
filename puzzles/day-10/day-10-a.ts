import { readData } from '../../shared.ts';
import chalk from 'chalk';

type Coordinates = { x: number; y: number };

type Pipe = {
  coordinates: Coordinates;
  connectedTo: Coordinates[];
};

export async function day10a(dataPath?: string) {
  const data = await readData(dataPath);

  const pipeMap = new Map<`${number}_${number}`, Pipe>();
  let start: Coordinates;

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      const pipe = data[i][j] as 'L' | 'J' | '7' | 'F' | '-' | '|' | '.' | 'S';

      switch (pipe) {
        case 'L':
          pipeMap.set(`${i}_${j}`, {
            coordinates: { x: i, y: j },
            connectedTo: [
              { x: i - 1, y: j }, // north
              { x: i, y: j + 1 }, // east
            ],
          });
          break;
        case 'J':
          pipeMap.set(`${i}_${j}`, {
            coordinates: { x: i, y: j },
            connectedTo: [
              { x: i - 1, y: j }, // north
              { x: i, y: j - 1 }, // west
            ],
          });
          break;
        case '7':
          pipeMap.set(`${i}_${j}`, {
            coordinates: { x: i, y: j },
            connectedTo: [
              { x: i + 1, y: j }, // south
              { x: i, y: j - 1 }, // west
            ],
          });
          break;
        case 'F':
          pipeMap.set(`${i}_${j}`, {
            coordinates: { x: i, y: j },
            connectedTo: [
              { x: i + 1, y: j }, // south
              { x: i, y: j + 1 }, // east
            ],
          });
          break;
        case '-':
          pipeMap.set(`${i}_${j}`, {
            coordinates: { x: i, y: j },
            connectedTo: [
              { x: i, y: j - 1 }, // west
              { x: i, y: j + 1 }, // east
            ],
          });
          break;
        case '|':
          pipeMap.set(`${i}_${j}`, {
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
            data[i - 1][j] === '|' ||
            data[i - 1][j] === 'F' ||
            data[i - 1][j] === '7';
          const isConnectedEast =
            data[i][j + 1] === '-' ||
            data[i][j + 1] === 'J' ||
            data[i][j + 1] === '7';
          const isConnectedSouth =
            data[i + 1][j] === '|' ||
            data[i + 1][j] === 'L' ||
            data[i + 1][j] === 'J';
          const isConnectedWest =
            data[i][j - 1] === '-' ||
            data[i][j - 1] === 'L' ||
            data[i][j - 1] === 'F';

          pipeMap.set(`${i}_${j}`, {
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

  let totalStepCount = 1;
  let lastCoordinates = start;
  let currentPipe = pipeMap.get(`${start.x}_${start.y}`).connectedTo[0];

  while (currentPipe.x !== start.x || currentPipe.y !== start.y) {
    const pipe = pipeMap.get(`${currentPipe.x}_${currentPipe.y}`);

    const pipeOne = pipe.connectedTo[0];
    const pipeTwo = pipe.connectedTo[1];

    if (pipeOne.x === lastCoordinates.x && pipeOne.y === lastCoordinates.y) {
      currentPipe = pipeTwo;
    } else {
      currentPipe = pipeOne;
    }

    lastCoordinates = pipe.coordinates;
    totalStepCount++;
  }

  return Math.floor(totalStepCount / 2);
}

const answer = await day10a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
