import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { loginUserFunction } from "../services/Apis";
import Spinner from "react-bootstrap/Spinner";
import "../styles/mix.css";

const Loginpass = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [spiner, setSpiner] = useState(false);

  const navigate = useNavigate();

  // login user
  const loginUser = async (e) => {
    e.preventDefault();

    if (email === "") {
      toast.error("Enter Your Email !");
    } else if (password === "") {
      toast.error("Enter Your Password !");
    } else if (!email.includes("@")) {
      toast.error("Enter a Valid Email !");
    } else {
      setSpiner(true);
      const data = {
        email: email,
        password: password,
      };

      const response = await loginUserFunction(data);

      if (response.status === 200) {
        // console.log("test");
        setSpiner(false);
        navigate("/loginotp", { state: email });
      } else {
        setSpiner(false);
        toast.error("Invalid Credentials");
      }
    }
  };

  return (
    <>
      <section>
        <div className="form_data">
          <div className="form_heading">
            <h1>Welcome Back, Log In</h1>
            <p>Login with password.</p>
          </div>
          <form>
            <div className="form_input">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id=""
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email Address"
              />
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id=""
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Your Password "
              />
            </div>
            <button className="btn" onClick={loginUser}>
              Login
              {spiner ? (
                <span>
                  <Spinner animation="border" />
                </span>
              ) : (
                ""
              )}
            </button>
            <p>
              Don't have and account ?{" "}
              <NavLink to="/register">Register</NavLink>{" "}
            </p>
          </form>
        </div>
        <ToastContainer />
      </section>
    </>
  );
};

export default Loginpass;
