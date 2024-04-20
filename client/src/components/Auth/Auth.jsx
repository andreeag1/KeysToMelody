import React, {
  FormEvent,
  LegacyRef,
  useEffect,
  useRef,
  useState,
} from "react";
import "./Auth.css";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import Google from "../../assets/google.png";
import { BACKEND_URL } from "../../config";
import { useNavigate } from "react-router-dom";

const Auth = (props) => {
  const { setOpenModal, signInTrue } = props;
  const modalRef = useRef(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [google, setGoogle] = useState(false);
  const navigate = useNavigate();

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      if (signInTrue) {
        const resp = await fetch(`${BACKEND_URL}/user/login`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            google: google,
            email: email,
            password: password,
          }),
        });
        if (!resp.ok) {
          const parsedResp = await resp.json();
          setError(parsedResp.message);
          throw new Error(JSON.stringify(resp));
        }
        const parsedResp = await resp.json();
        console.log(parsedResp);
        navigate(`/dashboard/${parsedResp.public_id}`);
      } else {
        console.log(import.meta.env.BACKEND_URL);
        const resp = await fetch(`${BACKEND_URL}/user/signup`, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            email: email,
            name: name,
            password: password,
          }),
        });
        if (!resp.ok) {
          const parsedResp = await resp.json();
          setError(parsedResp.message);
          throw new Error(JSON.stringify(resp));
        }
        const parsedResp = await resp.json();
        console.log(parsedResp);
        navigate(`/dashboard/${parsedResp.public_id}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      let headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Accept", "application/json");
      headers.append("Access-Control-Allow-Origin", "http://127.0.0.1:5000");
      headers.append("Access-Control-Allow-Credentials", "true");
      const resp = await fetch(`${BACKEND_URL}/user/google`, {
        method: "GET",
        headers: headers,
      });
      if (!resp.ok) {
        console.log("hello", resp);
        throw new Error(JSON.stringify(resp));
      }
      const parsedResp = await resp.json();
      console.log(parsedResp);
      window.location.assign(parsedResp.auth_url);
    } catch (err) {
      console.log(err);
    }
  };

  useOutsideClick(modalRef, () => setOpenModal(false));
  return (
    <form
      className="auth-transition-container nunito-sans hidden-body-scrollbar"
      onSubmit={(e) => handleAuthSubmit(e)}
    >
      <div className="auth-container" ref={modalRef}>
        <div className="auth-input-container">
          <div className="auth-input-title">Email Address</div>
          <input
            className="auth-input"
            required
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {!signInTrue && (
          <div className="auth-input-container">
            <div className="auth-input-title">Name</div>
            <input
              className="auth-input"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}
        <div className="auth-input-container">
          <div className="auth-input-title">Password</div>
          <input
            className="auth-input"
            required
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button className="auth-button" type="submit">
          {signInTrue ? "Sign In" : "Sign Up"}
        </button>
        <div className="other-sign-in-option-container">
          <div className="line" />
          <div className="other-sign-in-option-text">Or, Sign in with</div>
          <div className="line" />
        </div>
        <div
          className="google-sign-in"
          onClick={() => (setGoogle(true), handleGoogleLogin())}
        >
          <img src={Google} className="google-icon" />
          <div className="google-text">Google</div>
        </div>
      </div>
    </form>
  );
};

export default Auth;
