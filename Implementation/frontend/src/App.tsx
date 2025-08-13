import DrumTool from "./components/DrumTool";
import { useEffect, useState } from "react";
import Metronome from "./components/Metronome";
import Sidebar from "./components/Sidebar";
import AccountDropdown from "components/AccountDropdown";
import useAuthStore from "stores/AuthStore";

function App() {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleBpmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBpm(Number(event.target.value));
  };

  const handleTogglePlayback = () => {
    setIsPlaying((prev) => !prev);
  };

  useEffect(() => {
    useAuthStore.getState().initSessionFromStorage();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault(); //prevent page scroll on spacebar press
        handleTogglePlayback(); //trigger play/pause toggle
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-b from-zinc-50 to-zinc-100">
      {/* main content wrapper */}

      <AccountDropdown />

      <div className="flex flex-col flex-1 w-full lg:flex-row">
        {/* sidebar */}
        <Sidebar />

        {/* main content */}
        <div className="flex items-center justify-center flex-1 p-4 content-tool">
          <div className="flex flex-col items-center w-full max-w-screen-lg pt-6 mx-auto rounded">
            <p className="w-full mb-4 text-4xl font-extrabold h-14">
              Drum Sampler
            </p>
            <DrumTool bpm={bpm} isPlaying={isPlaying} />
            {/* <Sequencer /> */}
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="h-auto m-3 bg-white text-black p-6 sm:px-16 rounded-2xl shadow-[0px_0px_15px_0px_rgba(0,_0,_0,_0.05)] flex flex-col sm:flex-row items-center gap-6">
        {/* Start/Stop Button */}
        <div className="flex justify-center flex-1 w-full sm:justify-start">
          <button
            onClick={handleTogglePlayback}
            className="px-6 py-2 font-semibold text-white transition duration-200 bg-blue-600 shadow hover:bg-blue-700 rounded-xl"
          >
            {isPlaying ? "Stop" : "Start"}
          </button>
        </div>

        {/* Controls */}
        <div className="flex-1 w-full space-y-3 text-sm">
          {/* BPM Slider */}
          <div className="flex items-center space-x-3">
            <label
              htmlFor="bpm-slider"
              className="w-10 font-medium text-gray-700"
            >
              BPM:
            </label>
            <div className="flex-1">
              <div className="flex items-center">
                <span className="w-12 text-center text-gray-500">{bpm}</span>
                <input
                  type="range"
                  min="1"
                  max="200"
                  value={bpm}
                  onChange={handleBpmChange}
                  className="w-full h-2 ml-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  id="bpm-slider"
                />
              </div>
            </div>
          </div>

          {/* Swing Slider */}
          <div className="flex items-center space-x-3">
            <label
              htmlFor="swing-slider"
              className="w-10 font-medium text-gray-700"
            >
              Swing:
            </label>
            <div className="flex-1">
              <div className="flex items-center">
                <span className="w-12 text-center text-gray-500">50</span>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value="50"
                  className="w-full h-2 ml-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  id="swing-slider"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Metronome Display */}
        <div className="flex justify-center flex-1 w-full sm:justify-end">
          <div className="w-full sm:w-auto">
            <Metronome bpm={bpm} isPlaying={isPlaying} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
