import "./App.css";
import SheetMusic from "./assets/sheet-music.png";

function App() {
  return (
    <div className="main-app-container judson-regular">
      <div className="hero-container">
        <div className="hero-title-container">
          <div className="hero-title">
            A Music Notation Software for Piano Players
          </div>
          <div className="hero-description nunito-sans">
            Turn your musical inspirations into reality with a tool to create
            flawless sheet music
          </div>
          <button className="get-started-button">Get Started!</button>
        </div>
        <img src={SheetMusic} className="hero-sheet-music-image" />
      </div>
      <div className="landing-page-section-one">
        <div className="section-one-title-container">
          <div className="section-one-title">Become a composer today!</div>
        </div>
      </div>
    </div>
  );
}

export default App;
