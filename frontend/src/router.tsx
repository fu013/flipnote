/* eslint-disable react/jsx-pascal-case */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./page/main/App";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
