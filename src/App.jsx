import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/login/loginPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
