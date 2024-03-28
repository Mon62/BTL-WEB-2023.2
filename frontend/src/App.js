import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<SignUp />}>
          {/* <Route index element={<Home />} />
          <Route path="profile" element={<Profile />}/> */}
        </Route>
      </Routes>
      <ToastContainer hideProgressBar />
    </BrowserRouter>
  );
}

export default App;