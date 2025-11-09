import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Zenith TV
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Modern IPTV Player with Peer-to-Peer Remote Control
        </p>
        <button
          onClick={() => setCount((count) => count + 1)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
        >
          Count is {count}
        </button>
        <p className="text-gray-400 mt-8">
          Desktop app powered by Electron + React + Vite
        </p>
      </div>
    </div>
  );
}

export default App;
