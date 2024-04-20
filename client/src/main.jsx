import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import EditScore from "./pages/EditScore/EditScore.jsx";
// import PrivateRoute from "./PrivateRoute";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/dashboard/:userId" element={<Dashboard />} />
      <Route path="/new" element={<EditScore />} />
    </Routes>
  </Router>
);
