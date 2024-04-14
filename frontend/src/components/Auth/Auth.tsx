import React, { LegacyRef, useRef } from "react";
import "./Auth.css";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import Google from "../../assets/google.png";

interface props {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Auth = (props: props) => {
  const { setOpenModal } = props;
  const modalRef = useRef<HTMLDivElement>(null);

  useOutsideClick(modalRef, () => setOpenModal(false));
  return (
    <div className="auth-transition-container nunito-sans">
      <div className="auth-container" ref={modalRef}>
        <div className="auth-input-container">
          <div className="auth-input-title">Email Address</div>
          <input className="auth-input" />
        </div>
        <div className="auth-input-container">
          <div className="auth-input-title">Password</div>
          <input className="auth-input" />
        </div>
        <button className="auth-button">Sign In</button>
        <div className="other-sign-in-option-container">
          <div className="line" />
          <div className="other-sign-in-option-text">Or, Sign in with</div>
          <div className="line" />
        </div>
        <div className="google-sign-in">
          <img src={Google} className="google-icon" />
          <div className="google-text">Google</div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
