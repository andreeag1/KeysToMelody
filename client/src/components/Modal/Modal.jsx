import { useRef, useState } from "react";
import "./Modal.css";
import { useOutsideClick } from "../../hooks/useOutsideClick";

const Modal = (props) => {
  const [tempTitle, setTempTitle] = useState("");

  return (
    <div className="modal-main-container lato-regular">
      <div className="modal-text">Give your piece a name:</div>
      <input
        className="modal-input"
        value={tempTitle}
        onChange={(e) => setTempTitle(e.target.value)}
      />
      <div
        className="modal-buttons"
        onClick={() => props.handleTitle(tempTitle)}
      >
        <div className="ok-button">Confirm</div>
      </div>
    </div>
  );
};

export default Modal;
