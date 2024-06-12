import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ChatApp from "./components/Chat/ChatApp";

function App() {
  return (
    <>
      <div className="h-screen w-screen">
        <Router>
          <Routes>
            <Route path="/" element={<ChatApp />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
