import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
// import PrivateRoute from "./PrivateRoute";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/dashboard/:userId"
          element={
            // <PrivateRoute>
            <Dashboard />
            // </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  </React.StrictMode>
);
