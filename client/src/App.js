import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import ProductDetail from "./components/product/product-detail";
import ProductList from "./components/product/productList/product-list";

const App = () => (
  <Router>
    <Routes>
      {/* components */}
      <Route path='/' element={<ProductList />} />
      <Route path="/products/:productId" element={<ProductDetail />} />
    </Routes>
  </Router>
);

export default App;
