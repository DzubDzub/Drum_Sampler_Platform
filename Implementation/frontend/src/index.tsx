import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import LoginPage from "./Login/Login";
import ProtectedRoute from "components/ProtectedRoute";
import Dashboard from "dashboards/Dashboard";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["student", "teacher"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
);

reportWebVitals();
