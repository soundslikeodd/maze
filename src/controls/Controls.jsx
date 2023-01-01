import { useState } from 'react';
import './Controls.scss';

const settingsString = (
    {
        size,
        randomSE,
    }
) => `${size.split(',').join('x')} Random Start/Finish: ${randomSE}`;

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
}) => {
    const [randomSE, setRandomSE] = useState(false);
    const [size, setSize] = useState(SMALL);
    const [currentSettings, setCurrentSettings] = useState(
        settingsString({
            size,
            randomSE,
        })
    );
    return (
        <fieldset
            id="controls"
        >
            <legend>Controls:</legend>
            <div
                className="controls-row"
            >
                <div
                    className="controls-col"
                >
                    <div
                        className="checkbox-container"
                    >
                        <input 
                            type="checkbox"
                            checked={randomSE}
                            onClick={() => setRandomSE(!randomSE)}
                            onChange={() => setRandomSE(!randomSE)}
                        />
                        <label>
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
                    <div
                        className="current-settings"
                    >
                        {currentSettings}
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
                                setCurrentSettings(
                                    settingsString({
                                        size,
                                        randomSE,
                                    })
                                );
                                newMaze(width, height, randomSE);
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
        </fieldset>
    );
};

export default Controls;
