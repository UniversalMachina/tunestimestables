import React, { useState, useEffect } from "react";

const GameOne: React.FC = () => {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="text-4xl font-mono border rounded-lg p-4 w-64 text-center">
        {formatTime(time)}
      </div>
      <div className="flex gap-4">
        <button
          onClick={handleStart}
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-2 rounded-lg text-xl"
        >
          Start
        </button>
        <button
          onClick={handleStop}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-2 rounded-lg text-xl"
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default GameOne;
