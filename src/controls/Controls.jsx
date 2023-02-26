import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import './Controls.scss';

const settingsString = (
  {
    height,
    width,
    randomSE,
    seed,
  },
) => (
  <p>
    {height}
    x
    {width}
    <br />
    Random Start/Finish:
    {' '}
    {`${randomSE}`}
    <br />
    Seed:
    {' '}
    {seed}
  </p>
);

const SMALL = '10,10';
const MEDIUM = '10,15';
const LARGE = '15,15';
const sizes = {
  small: SMALL,
  medium: MEDIUM,
  large: LARGE,
};
const determineSize = (height, width) => (width === 10
  ? height === 10
    ? 'small'
    : 'medium'
  : 'large');

const Controls = ({
  elementRef,
  newMaze,
  restartMaze,
  width,
  height,
  seed,
  userSeed,
  setUserSeed,
  initialRandomSE,
}) => {
  const [randomSE, setRandomSE] = useState(initialRandomSE);
  // width/height swapped on purpose
  const [size, setSize] = useState(sizes[determineSize(width, height)]);
  const [currentSettings, setCurrentSettings] = useState(
    settingsString({
      width,
      height,
      randomSE: initialRandomSE,
      seed,
    }),
  );
  return (
    <fieldset
      id="controls"
      ref={elementRef}
    >
      <legend>Controls:</legend>
      <div
        className="controls-col"
      >
        <div
          className="controls-row"
        >
          <div
            className="controls-col"
          >
            <div
              className="text-container"
            >
              <input
                id="seed-text-input"
                type="text"
                onChange={(e) => setUserSeed(e.target.value)}
                value={userSeed}
                placeholder="enter seed"
              />
            </div>
            <div
              className="checkbox-container"
            >
              <label htmlFor="random-start-end-checkbox">
                <input
                  id="random-start-end-checkbox"
                  type="checkbox"
                  checked={randomSE}
                  onClick={() => setRandomSE(!randomSE)}
                  onChange={() => setRandomSE(!randomSE)}
                />
                Random Start/Finish
              </label>
            </div>
            <div>
              <label htmlFor="size-select">
                Size:
                <select
                  name="size"
                  id="size-select"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                >
                  {
                    Object.keys(sizes).map((s) => (
                      <option
                        key={sizes[s]}
                        value={sizes[s]}
                      >
                        {s}
                        {' '}
                        -
                        {sizes[s].split(',').join('x')}
                      </option>
                    ))
                  }
                </select>
              </label>
            </div>
          </div>
          <div
            className="controls-col"
          >
            <div
              className="instructions"
            >
              navigate with arrow keys or swipe
              <br />
              URL is shareable 📩
            </div>
            <div
              className="controls-row buttons-container"
            >
              <button
                type="button"
                onClick={() => {
                  const [
                    h,
                    w,
                  ] = size.split(',').map((s) => +s);
                  const seedToUse = userSeed && userSeed !== ''
                    ? userSeed.trim()
                    : uuid();
                  const settings = settingsString({
                    height: h,
                    width: w,
                    randomSE,
                    seed: seedToUse,
                  });
                  setCurrentSettings(settings);
                  newMaze(w, h, randomSE, seedToUse);
                }}
              >
                New
              </button>
              <button
                type="button"
                onClick={restartMaze}
              >
                Restart
              </button>
            </div>
          </div>
        </div>
        <div
          className="controls-row"
        >
          <div
            className="current-settings"
          >
            {currentSettings}
          </div>
        </div>
      </div>
    </fieldset>
  );
};

export default Controls;
