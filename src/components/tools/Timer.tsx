import { useEffect, useState } from "react";
import { Play, Pause } from "lucide-react";

const TimerComponent: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [inputTime, setInputTime] = useState({ minutes: 25, seconds: 0 });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (time === 0 && isRunning) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const startTimer = () => {
    if (time === 0) {
      setTime(inputTime.minutes * 60 + inputTime.seconds);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setTime(0);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="p-6 bg-gray-900 text-white h-full">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-6xl font-mono font-bold text-blue-400">
          {formatTime(time)}
        </div>

        <div className="flex space-x-4">
          <div className="flex flex-col items-center">
            <label className="text-sm text-gray-400 mb-1">Minutos</label>
            <input
              type="number"
              value={inputTime.minutes}
              onChange={(e) =>
                setInputTime({
                  ...inputTime,
                  minutes: parseInt(e.target.value) || 0,
                })
              }
              className="w-20 p-2 bg-gray-800 border border-gray-700 rounded text-center"
              disabled={isRunning}
            />
          </div>
          <div className="flex flex-col items-center">
            <label className="text-sm text-gray-400 mb-1">Segundos</label>
            <input
              type="number"
              value={inputTime.seconds}
              onChange={(e) =>
                setInputTime({
                  ...inputTime,
                  seconds: parseInt(e.target.value) || 0,
                })
              }
              className="w-20 p-2 bg-gray-800 border border-gray-700 rounded text-center"
              disabled={isRunning}
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={startTimer}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            {isRunning ? <Pause size={20} /> : <Play size={20} />}
            <span>{isRunning ? "Pausar" : "Iniciar"}</span>
          </button>
          <button
            onClick={resetTimer}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimerComponent;
