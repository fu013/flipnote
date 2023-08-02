/* eslint-disable react/jsx-pascal-case */
import Login from "page/auth/login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./page/main/App";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="auth/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
