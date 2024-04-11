import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login/Login";
import ResetPassword from "./pages/Login/ResetPassword";
import SignUp from "./pages/SignUp/SignUp";
import Home from "./pages/Home/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/password/reset" element={<ResetPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Login />}>
          {/* <Route index element={<Home />} />
          <Route path="profile" element={<Profile />}/> */}
        </Route>
      </Routes>
      <ToastContainer hideProgressBar />
    </BrowserRouter>
  );
}

export default App;
