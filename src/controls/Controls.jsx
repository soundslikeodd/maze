import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import './Controls.scss';

const settingsString = (
    {
        size,
        randomSE,
        seed,
    }
) => (
    <p>
        {size.split(',').join('x')}
        <br />
        Random Start/Finish: {`${randomSE}`}
        <br />
        Seed: {seed}
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

const Controls = ({
    newMaze,
    restartMaze,
    seed,
    userSeed,
    setUserSeed,
    initialRandomSE
}) => {
    const [randomSE, setRandomSE] = useState(false);
    const [size, setSize] = useState(SMALL);
    const [currentSettings, setCurrentSettings] = useState(
        settingsString({
            size,
            randomSE: initialRandomSE,
            seed,
        })
    );
    return (
        <fieldset
            id="controls"
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
                            <label htmlFor="seed-text-input">Seed:</label>
                            <input
                                id="seed-text-input"
                                type="text"
                                onChange={e => setUserSeed(e.target.value)}
                                value={userSeed}
                            />
                        </div>
                        <div
                            className="checkbox-container"
                        >
                            <input 
                                id="random-start-end-checkbox"
                                type="checkbox"
                                checked={randomSE}
                                onClick={() => setRandomSE(!randomSE)}
                                onChange={() => setRandomSE(!randomSE)}
                            />
                            <label htmlFor="random-start-end-checkbox">
                                Random Start/Finish
                            </label>
                        </div>
                        <div>
                            <label htmlFor="size-select">Size:</label>
                            <select 
                                name="size"
                                id="size-select"
                                value={size}
                                onChange={e => setSize(e.target.value)}
                            >
                                {
                                    Object.keys(sizes).map(s => (
                                        <option
                                            key={sizes[s]}
                                            value={sizes[s]}
                                        >
                                            {s} - {sizes[s].split(',').join('x')}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <div
                        className="controls-col"
                    >   
                        <div
                            className="instructions"
                        >
                            navigate with arrow keys or swipe
                        </div>
                        <div
                            className="controls-row buttons-container"
                        >
                            <button
                                onClick={() => {
                                    const [
                                        height,
                                        width,
                                    ] = size.split(',').map(s => Number(s));
                                    const seedToUse = userSeed && userSeed !== ''
                                        ? userSeed
                                        : uuid();
                                    setCurrentSettings(
                                        settingsString({
                                            size,
                                            randomSE,
                                            seed: seedToUse
                                        })
                                    );
                                    newMaze(width, height, randomSE, seedToUse);
                                }}
                            >
                                New
                            </button>
                            <button
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
