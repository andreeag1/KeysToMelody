import { useRef, useState } from "react";
import "./Modal.css";
import { useOutsideClick } from "../../hooks/useOutsideClick";

const Modal = (props) => {
  const { setTimeSig, handleTitle } = props;
  const [tempTitle, setTempTitle] = useState("");

  return (
    <div className="modal-main-container lato-regular">
      <div className="modal-text">Give your piece a name:</div>
      <input
        className="modal-input"
        value={tempTitle}
        onChange={(e) => setTempTitle(e.target.value)}
      />
      <div className="modal-text">Choose a time signature:</div>
      <div className="modal-select-container">
        <select
          className="modal-select"
          onChange={(e) => setTimeSig(e.target.value)}
        >
          <option value="4/4">4/4</option>
          <option value="3/4">3/4</option>
          <option value="2/4">2/4</option>
        </select>
      </div>

      <div className="modal-buttons" onClick={() => handleTitle(tempTitle)}>
        <div className="ok-button">Confirm</div>
      </div>
    </div>
  );
};

export default Modal;
