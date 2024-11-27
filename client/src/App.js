import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/home/home";

const App = () => (
  <Router>
    <Routes>
      {/* components */}
      <Route path='/' element={<Home />} />
    </Routes>
  </Router>
);

export default App;
