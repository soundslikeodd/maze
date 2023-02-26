import { createRoot } from 'react-dom/client';
import { v4 as uuid } from 'uuid';
import {
  defaultMazeHeight,
  defaultMazeWidth,
  generateMaze,
} from './generation/generator';
import {
  queryStringAsObj,
  updateParams,
} from './urlUtils';
import MazeContainer from './MazeContainer';

/**
 * initialConfig shape
 * {
 *  s: seed,
 *  w: width,
 *  h: height,
 *  r: random start and finish points
 * }
 */
const initialConfig = queryStringAsObj();
const initialSeed = initialConfig?.s || uuid();
const validatedWidth = [10, 15].includes(
  +(initialConfig?.w || 10),
) ? +initialConfig.w : defaultMazeWidth;
const validatedHeight = [10, 15].includes(
  +(initialConfig?.h || 10),
) ? +initialConfig.h : defaultMazeHeight;
const initalRandomSF = initialConfig?.r === 'true';
const initialMaze = generateMaze(
  initialSeed,
  validatedHeight, // explicitly set to height - maze is roteated
  validatedWidth, // explicitly set to weight - maze is roteated
  initalRandomSF,
);
updateParams(
  {
    s: initialSeed,
    r: initalRandomSF,
    w: validatedWidth,
    h: validatedHeight,
  },
);

const root = createRoot(document.getElementById('maze-app'));
root.render(
  <MazeContainer
    initialMaze={initialMaze}
    initialSeed={initialSeed}
    initalRandomSF={initalRandomSF}
  />,
);
