import { useState, useRef } from "react";
import "./EditScore.css";
import Natural from "../../assets/natural.png";
import Sharp from "../../assets/sharp.png";
import Flat from "../../assets/flat.png";
import WholeNote from "../../assets/whole.png";
import HalfNote from "../../assets/half.png";
import QuarterNote from "../../assets/quarter.png";
import EightNote from "../../assets/eight.png";
import SixteenthNote from "../../assets/sixteenth.png";
import ThirtySecondNote from "../../assets/thirtysecond.png";
import SixtyFourthNote from "../../assets/sixtyfourth.png";
import DottedNote from "../../assets/dotted.png";
import Staccato from "../../assets/staccato.png";
import Modal from "../../components/Modal/Modal";
import Score from "../../components/Score/Score";
import { IoMdAddCircleOutline } from "react-icons/io";

const EditScore = () => {
  const [clicked, setClicked] = useState("note");
  const [titleModal, setTitleModal] = useState(true);
  const [title, setTitle] = useState("");
  const [noteClicked, setNoteClicked] = useState("");
  const [newStave, setNewStave] = useState(false);
  const tabs = ["note", "articulation", "ornament", "dynamic", "bar", "text"];
  const [staveLength, setStaveLength] = useState(1);
  const [width, setWidth] = useState(810);
  const [height, setHeight] = useState(300);
  const [timeSig, setTimeSig] = useState("4/4");
  const [confirmed, setConfirmed] = useState(false);
  const pageContainer = useRef(null);

  const handleTitle = (input) => {
    setTitle(input);
    setTitleModal(false);
    setConfirmed(true);
  };

  const handleAddNewStave = () => {
    setStaveLength(staveLength + 1);
    setNewStave(true);
    staveLength % 3 == 0 ? setHeight(height + 150) : setWidth(width + 150);
  };

  return (
    <div className={"score-page-container lato-regular "}>
      <div className="score-page-header">
        {tabs.map((tab, i) => (
          <div
            key={i}
            className={
              "header-section " + (clicked === tab ? "border-bottom" : "")
            }
            onClick={() => setClicked(tab)}
          >
            {tab}
          </div>
        ))}
      </div>
      {clicked == "note" && (
        <div className="header-subsection">
          <div className="header-sign-subsection">
            <div
              className={
                "subsection-note " +
                (noteClicked === "natural" ? "blue-icon" : "")
              }
              onClick={() =>
                noteClicked === "natural"
                  ? setNoteClicked("")
                  : setNoteClicked("natural")
              }
            >
              <img src={Natural} className={"icon"} title="natural" />
            </div>
            <div
              className={
                "subsection-note " +
                (noteClicked === "sharp" ? "blue-icon" : "")
              }
              onClick={() =>
                noteClicked === "sharp"
                  ? setNoteClicked("")
                  : setNoteClicked("sharp")
              }
            >
              <img src={Sharp} className="sharp-icon" title="sharp" />
            </div>
            <div
              className={
                "subsection-note " + (noteClicked === "flat" ? "blue-icon" : "")
              }
              onClick={() =>
                noteClicked === "flat"
                  ? setNoteClicked("")
                  : setNoteClicked("flat")
              }
            >
              <img src={Flat} className="flat-icon" title="flat" />
            </div>
          </div>
          <div className="header-sign-subsection">
            <div
              className={
                "subsection-note padding-top " +
                (noteClicked === "whole" ? "blue-icon" : "")
              }
              onClick={() =>
                noteClicked === "whole"
                  ? setNoteClicked("")
                  : setNoteClicked("whole")
              }
            >
              <img src={WholeNote} className="whole-icon" title="whole note" />
            </div>
            <div
              className={
                "subsection-note " + (noteClicked === "half" ? "blue-icon" : "")
              }
              onClick={() =>
                noteClicked === "half"
                  ? setNoteClicked("")
                  : setNoteClicked("half")
              }
            >
              <img src={HalfNote} className="half-icon" title="half note" />
            </div>
            <div
              className={
                "subsection-note padding-top " +
                (noteClicked === "quarter" ? "blue-icon" : "")
              }
              onClick={() =>
                noteClicked === "quarter"
                  ? setNoteClicked("")
                  : setNoteClicked("quarter")
              }
            >
              <img
                src={QuarterNote}
                className="quarter-icon"
                title="quarter note"
              />
            </div>
            <div
              className={
                "subsection-note " +
                (noteClicked === "eigth" ? "blue-icon" : "")
              }
              onClick={() =>
                noteClicked === "eigth"
                  ? setNoteClicked("")
                  : setNoteClicked("eigth")
              }
            >
              <img src={EightNote} className="eight-icon" title="eight note" />
            </div>
            <div
              className={
                "subsection-note " +
                (noteClicked === "sixteenth" ? "blue-icon" : "")
              }
              onClick={() =>
                noteClicked === "sixteenth"
                  ? setNoteClicked("")
                  : setNoteClicked("sixteenth")
              }
            >
              <img
                src={SixteenthNote}
                className="sixteenth-icon"
                title="sixteenth note"
              />
            </div>
            <div
              className={
                "subsection-note padding-top " +
                (noteClicked === "thirtysecond" ? "blue-icon" : "")
              }
              onClick={() =>
                noteClicked === "thirtysecond"
                  ? setNoteClicked("")
                  : setNoteClicked("thirtysecond")
              }
            >
              <img
                src={ThirtySecondNote}
                className="thirtysecond-icon"
                title="thirtysecond note"
              />
            </div>
            <div
              className={
                "subsection-note " +
                (noteClicked === "sixtyfourth" ? "blue-icon" : "")
              }
              onClick={() =>
                noteClicked === "sixtyfourth"
                  ? setNoteClicked("")
                  : setNoteClicked("sixtyfourth")
              }
            >
              <img
                src={SixtyFourthNote}
                className="sixtyfourth-icon"
                title="sixtyfourth note"
              />
            </div>
            <div
              className={
                "subsection-note " +
                (noteClicked === "dotted" ? "blue-icon" : "")
              }
              onClick={() =>
                noteClicked === "dotted"
                  ? setNoteClicked("")
                  : setNoteClicked("dotted")
              }
            >
              <img
                src={DottedNote}
                className="sixtyfourth-icon"
                title="dotted note"
              />
            </div>
          </div>
        </div>
      )}
      {clicked == "articulation" && (
        <div className="header-subsection">
          <div className="header-sign-subsection">
            <div className="subsection-note">
              <img
                src={Staccato}
                className="sixtyfourth-icon"
                title="staccato"
              />
            </div>
          </div>
        </div>
      )}
      {titleModal && (
        <Modal handleTitle={handleTitle} setTimeSig={setTimeSig} />
      )}
      <div className="page-container judson-bold" ref={pageContainer}>
        <div className="score-title-container">{title}</div>
        <div className="score-edit-container">
          <Score
            newStave={newStave}
            setNewStave={setNewStave}
            staveLength={staveLength}
            timeSig={timeSig}
            width={width}
            height={height}
            setHeight={setHeight}
            confirmed={confirmed}
          />
          <div
            className="add-stave-container lato-regular"
            onClick={() => handleAddNewStave()}
          >
            <IoMdAddCircleOutline className="add-stave-icon" />
            <div className="add-stave-title">New Stave</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditScore;
