import React from "react";
import Container from "react-bootstrap/Container";
// import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";

const Headers = () => {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <NavLink
            to="/"
            className=" text-light text-decoration-none text-center"
            style={{ textAlign: "center" }}
          >
            3 level Authentication
          </NavLink>
          {/* <Nav className="">
            <NavLink
              to="/register"
              className="mt-3 mx-2 text-light text-decoration-none"
            >
              Register
            </NavLink>
            <NavLink
              to="/"
              className="mt-3 mx-2 text-light text-decoration-none"
            >
              Login
            </NavLink> */}
          {/* <img src="/logo192.png" style={{ width: 50 }} alt="" />
          </Nav> */}
        </Container>
      </Navbar>
    </>
  );
};

export default Headers;
