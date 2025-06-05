import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import ForgetPasswordPage from "./components/auth/ForgetPasswordPage";

import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";

import FilterProduct from "./pages/customer/FilterProduct";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forget-password" element={<ForgetPasswordPage />} />
        <Route path="/LandingPage" element={<LandingPage />} />

        <Route path="/product-detail" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />

        <Route path="/FilterProduct" element={<FilterProduct />} />

      </Routes>
    </Router>
  );
}

export default App;
