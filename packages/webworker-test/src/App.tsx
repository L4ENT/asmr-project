import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [randomNumber, setRandomNumber] = useState(0);

  useEffect(() => {
    const worker = new Worker(
      new URL("./workers/randomNumberWorker.ts", import.meta.url),
      { type: "module" }
    );

    worker.onmessage = (event: MessageEvent) => {
      setRandomNumber(event.data);
    };

    return () => {
      worker.terminate();
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>From worker: {randomNumber}</p>
      </header>
    </div>
  );
}

export default App;
