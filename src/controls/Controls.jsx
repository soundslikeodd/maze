import { useState } from 'react';
import './Controls.scss';

const settingsString = (
    {
        size,
        randomSE,
    }
) => `${size.split(',').join(' by ')} Random Start/Finish: ${randomSE}`;

const SMALL = '10,10';
const MEDIUM = '10,15';
const LARGE = '15,15';
const sizes = [
    SMALL,
    MEDIUM,
    LARGE,
];

const Controls = ({
    newMaze
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
                className="radio-container"
            >
                <input 
                    type="radio"
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
                        sizes.map(s => (
                            <option
                                key={s}
                                value={s}
                            >
                                {s}
                            </option>
                        ))
                    }
                </select>
            </div>
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
                New Maze
            </button>
            <div
                className="current-settings"
            >
                {currentSettings}
            </div>
        </fieldset>
    );
};

export default Controls;
