import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { registerfunction } from "../services/Apis";
import "../styles/mix.css";

const Register = () => {
  const [passhow, setPassShow] = useState(false);

  const [inputdata, setInputdata] = useState({
    username: "",
    email: "",
    password: "",
    imageHash: "",
  });

  const navigate = useNavigate();

  // setinputvalue
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputdata({ ...inputdata, [name]: value });
  };

  // register data
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = inputdata;

    if (username === "") {
      toast.error("Enter Your Name");
    } else if (email === "") {
      toast.error("Enter Your Email");
    } else if (!email.includes("@")) {
      toast.error("Enter Valid Email");
    } else if (password === "") {
      toast.error("Enter Your Password");
    } else if (password.length < 6) {
      toast.error("password length minimum 6 character");
    } else {
      const response = await registerfunction(inputdata);

      if (response.status === 200) {
        setInputdata({ ...inputdata, username: "", email: "", password: "" });
        navigate("/imageregister", { state: response.data.email });
      } else {
        toast.error(response.response.data.error);
      }
    }
  };

  return (
    <>
      <section>
        <div className="form_data">
          <div className="form_heading">
            <h1>Register</h1>
            {/* <p style={{ textAlign: "center" }}>Create an account</p> */}
          </div>
          <form>
            <div className="form_input">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                id=""
                onChange={handleChange}
                placeholder="Enter Username"
              />
            </div>
            <div className="form_input">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id=""
                onChange={handleChange}
                placeholder="Enter Email Address"
              />
            </div>
            <div className="form_input">
              <label htmlFor="password">Password</label>
              <div className="two">
                <input
                  type={!passhow ? "password" : "text"}
                  name="password"
                  id=""
                  onChange={handleChange}
                  placeholder="Enter password"
                />
                <div className="showpass" onClick={() => setPassShow(!passhow)}>
                  {!passhow ? "Show" : "Hide"}
                </div>
              </div>
            </div>
            <button className="btn" onClick={handleSubmit}>
              Sign Up
            </button>
            <p>
              Existing User ? <NavLink to="/">Log In</NavLink>{" "}
            </p>
          </form>
        </div>
        <ToastContainer />
      </section>
    </>
  );
};

export default Register;
