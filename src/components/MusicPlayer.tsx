import { useState } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState("Nenhuma música carregada");
  const [volume, setVolume] = useState(70);

  return (
    <div className="p-6 bg-gray-900 text-white h-full">
      <div className="flex flex-col space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Reproduzindo Agora</h3>
          <p className="text-gray-400">{currentTrack}</p>
        </div>

        <div className="flex justify-center space-x-4">
          <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors">
            <SkipBack size={20} />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-4 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors">
            <SkipForward size={20} />
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <Volume2 size={20} />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm w-8">{volume}%</span>
        </div>

        <div className="space-y-2">
          <input
            type="file"
            accept="audio/*"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setCurrentTrack(e.target.files[0].name);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default MusicPlayer;
