import { useState } from "react";
import "./Score.css";
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

const Score = () => {
  const [clicked, setClicked] = useState<string>("note");
  const tabs = ["note", "articulation", "ornament", "dynamic", "bar", "text"];

  return (
    <div className="score-page-container lato-regular">
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
      {clicked === "note" && (
        <div className="header-subsection">
          <div className="header-sign-subsection">
            <div className="subsection-note">
              <img src={Natural} className="icon" />
            </div>
            <div className="subsection-note">
              <img src={Sharp} className="sharp-icon" />
            </div>
            <div className="subsection-note">
              <img src={Flat} className="flat-icon" />
            </div>
          </div>
          <div className="header-sign-subsection">
            <div className="subsection-note padding-top">
              <img src={WholeNote} className="whole-icon" />
            </div>
            <div className="subsection-note">
              <img src={HalfNote} className="half-icon" />
            </div>
            <div className="subsection-note padding-top">
              <img src={QuarterNote} className="quarter-icon" />
            </div>
            <div className="subsection-note">
              <img src={EightNote} className="eight-icon" />
            </div>
            <div className="subsection-note">
              <img src={SixteenthNote} className="sixteenth-icon" />
            </div>
            <div className="subsection-note padding-top">
              <img src={ThirtySecondNote} className="thirtysecond-icon" />
            </div>
            <div className="subsection-note">
              <img src={SixtyFourthNote} className="sixtyfourth-icon" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Score;
