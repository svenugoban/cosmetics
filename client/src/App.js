import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/product/home/home";
import ProductDetail from "./components/product/product-detail";

const App = () => (
  <Router>
    <Routes>
      {/* components */}
      <Route path='/' element={<Home />} />
      <Route path="/products/:productId" element={<ProductDetail />} />
    </Routes>
  </Router>
);

export default App;
