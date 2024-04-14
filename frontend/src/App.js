import Loginpass from "./pages/Loginpass";
import Loginotp from "./pages/Loginotp";
import Imageregister from "./pages/Imageregister";
import ImageLogin from "./pages/Imagelogin";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Otp from "./pages/Otp";
import Error from "./pages/Error";
import Headers from "./components/Headers";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import "./App.css";

function App() {
  // code for image authentication
  return (
    <>
      <Headers />
      <Routes>
        <Route path="/" element={<Loginpass />} />
        <Route path="/loginotp" element={<Loginotp />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user/otp" element={<Otp />} />
        <Route path="*" element={<Error />} />
        <Route path="/imageregister" element={<Imageregister />} />
        <Route path="/imagelogin" element={<ImageLogin />} />
      </Routes>
    </>
  );
}

export default App;
