import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login/Login";
import ResetPassword from "./pages/Login/ResetPassword"; 
import SignUp from "./pages/SignUp/SignUp";
import Home from "./pages/Home/Home";
import PageLayout from "./layouts/PageLayout/PageLayout.js";
import { Profile } from "./pages/Profile/Profile.js";

function App() {
  return (
    <BrowserRouter>
      <PageLayout>
        <Routes>
          <Route path="/signup" element={<SignUp />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/password/reset" element={<ResetPassword />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Login />} />
          
          <Route path="/profile/:username" element={<Profile />} />
        </Routes>
        <ToastContainer hideProgressBar />
      </PageLayout>
    </BrowserRouter>
  );
}

export default App;
