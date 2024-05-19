import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Login } from "./pages/Login/Login.js";
import ResetPassword from "./pages/Login/ResetPassword";
import SignUp from "./pages/SignUp/SignUp";
import {Home} from "./pages/Home/Home";
import PageLayout from "./layouts/PageLayout/PageLayout.js";
import { Profile } from "./pages/Profile/Profile.js";
import { Archive } from "./pages/Archive/Archive.js";
import { NotFound } from "./pages/NotFound/NotFound.js";
import Explore from "./pages/Explore/Explore.js";

function App() {
  return (
    <BrowserRouter>
      <PageLayout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/password/reset" element={<ResetPassword />} />
          <Route path="/home" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/profile/:profileUser" element={<Profile />} />
          <Route path="/profile/:profileUser/:tabName" element={<Profile />} />
          <Route
            path="/profile/:profileUser/archive/stories"
            element={<Archive />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer hideProgressBar />
      </PageLayout>
    </BrowserRouter>
  );
}

export default App;
