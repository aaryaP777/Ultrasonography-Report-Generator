import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ReportPageLiver from "./pages/ReportPageLiver";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/report/:organ" element={<ReportPageLiver />} />
      </Routes>
    </Router>
  );
}

export default App;
