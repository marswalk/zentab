import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import AuthLogin from "./AuthLogin";
import AuthCallback from "./AuthCallback";

ReactDOM.render(
  <React.StrictMode>
    {
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}></Route>
          <Route path="test" element={<div>BIG BOOM</div>} />
          <Route path="auth/login" element={<AuthLogin />} />
          <Route path="auth/callback" element={<AuthCallback />} />
        </Routes>
      </BrowserRouter>
    }
  </React.StrictMode>,
  document.getElementById("root"),
);
