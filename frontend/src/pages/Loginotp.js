import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { sentOtpFunction } from "../services/Apis";
import Spinner from "react-bootstrap/Spinner";
import "../styles/mix.css";
import { useLocation } from "react-router-dom";

const Loginotp = () => {
  const location = useLocation();
  const email = location.state;
  console.log(location.state);
  const [spiner, setSpiner] = useState(false);

  const navigate = useNavigate();

  // sendotp
  const sendOtp = async (e) => {
    e.preventDefault();

    if (email === "") {
      toast.error("Enter Your Email !");
    } else if (!email.includes("@")) {
      toast.error("Enter a Valid Email !");
    } else {
      setSpiner(true);
      const data = {
        email: email,
      };

      const response = await sentOtpFunction(data);

      if (response.status === 200) {
        setSpiner(false);
        navigate("/user/otp", { state: email });
      } else {
        setSpiner(false);
        toast.error(response.response.data.error);
      }
    }
  };

  return (
    <>
      <section>
        <div className="form_data">
          <div className="form_heading">
            <h1>Welcome Back, Log In</h1>
            <p>Login with otp.</p>
          </div>
          <form>
            <p>Email will be sent to {email}</p>
            <br />
            <button className="btn" onClick={sendOtp}>
              Send OTP
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

export default Loginotp;
