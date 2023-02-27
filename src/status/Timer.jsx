import {
  useState,
  useEffect,
} from 'react';

const Timer = ({ started, reset }) => {
  const [timerState, setTimerState] = useState(
    {
      deadline: null,
      time: null,
      timerInterval: null,
    },
  );
  useEffect(() => {
    const returnInterval = started && !timerState.timerInterval
      ? (() => {
        // setup interval
        const interval = setInterval(
          () => {
            setTimerState((prevState) => ( // each iteration is an update to previous state
              {
                deadline: prevState.deadline,
                time: Date.now() - Date.parse(prevState.deadline),
                timerInterval: prevState.timerInterval,
              }
            ));
          },
          500,
        );
        // setup initial timer state
        setTimerState(
          {
            deadline: new Date().toString(),
            time: null,
            timerInterval: interval,
          },
        );
        return interval;
      })()
      : !started && timerState.timerInterval
        ? (() => {
          clearInterval(timerState.timerInterval);
          setTimerState(
            {
              deadline: timerState.deadline,
              time: timerState.time,
              timerInterval: null,
            },
          );
        })()
        : null;
    return () => clearInterval(returnInterval || timerState.timerInterval);
  }, [started]);
  const {
    time,
  } = timerState;
  const timeToUse = reset ? null : time;
  return (
    <div className="timer">
      {`${timeToUse > 0 ? Math.floor((time / (1000 * 60)) % 60) : 0}`.padStart(2, '0')}
      :
      {`${timeToUse > 0 ? Math.floor((time / 1000) % 60) : 0}`.padStart(2, '0')}
    </div>
  );
};

export default Timer;
