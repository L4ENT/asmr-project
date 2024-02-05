import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HostPage from "./pages/HostPage";
import PeerPage from "./pages/PeerPage";
import PeerProvider from "./providers/PeerProvider";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/host"
          element={
            <PeerProvider>
              <HostPage />
            </PeerProvider>
          }
        />
        <Route
          path="/peer"
          element={
            <PeerProvider>
              <PeerPage />
            </PeerProvider>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
