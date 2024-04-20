import React, { useState } from "react";
import "./Navbar.css";
import Auth from "../Auth/Auth";

const Navbar = () => {
  const [openModal, setOpenModal] = useState(false);
  const [signInTrue, setSignInTrue] = useState(false);

  return (
    <>
      <div className="main-navbar-container">
        <div className="main-navbar-title judson-bold">KeysToMelody</div>
        <div className="navbar-buttons lato-regular">
          <div className="home-button">Home</div>
          <div
            className="sign-in-button"
            onClick={() => (setOpenModal(true), setSignInTrue(true))}
          >
            Sign-in
          </div>
          <button
            className="sign-up-button"
            onClick={() => (setOpenModal(true), setSignInTrue(false))}
          >
            Sign-up
          </button>
        </div>
      </div>
      {openModal && (
        <Auth setOpenModal={setOpenModal} signInTrue={signInTrue} />
      )}
    </>
  );
};

export default Navbar;
