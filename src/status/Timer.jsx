import {
  useState,
  useEffect,
  useMemo,
} from 'react';

const Timer = ({ started }) => {
  const [deadline, setDeadLine] = useState(null);
  const parsedDeadline = useMemo(() => Date.parse(deadline), [deadline]);
  const [time, setTime] = useState(parsedDeadline - Date.now());
  const [timerInterval, setTimerInterval] = useState(null);
  useEffect(() => {
    // console.log('effect', !!(started && !timerInterval), !!(!started && timerInterval));
    const returnInterval = started && !timerInterval
      ? (() => {
        setDeadLine(new Date().toString());
        const interval = setInterval(
          () => {
            // console.log('interval ', Date.now() - parsedDeadline);
            setTime(Date.now() - parsedDeadline);
          },
          1000,
        );
        setTimerInterval(interval);
        return interval;
      })()
      : !started && timerInterval
        ? (() => {
          clearInterval(timerInterval);
          setTimerInterval(null);
        })()
        : null;
    return () => clearInterval(returnInterval || timerInterval);
  }, [started, timerInterval]);
  // console.log('time', time, parsedDeadline);
  return (
    <div className="timer">
      {`${time > 0 ? Math.floor((time / (1000 * 60)) % 60) : 0}`.padStart(2, '0')}
      :
      {`${time > 0 ? Math.floor((time / 1000) % 60) : 0}`.padStart(2, '0')}
    </div>
  );
};

export default Timer;
