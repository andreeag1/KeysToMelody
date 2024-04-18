import { useState } from "react";
import "./Sidebar.css";
import { VscLibrary } from "react-icons/vsc";
import { MdFavoriteBorder } from "react-icons/md";
import { BsCollection } from "react-icons/bs";
import { HiOutlineTrash } from "react-icons/hi2";
import { RxCounterClockwiseClock } from "react-icons/rx";

const Sidebar = () => {
  const [clicked, setClicked] = useState<string>("scores");

  return (
    <div className="sidebar-container lato-regular">
      <div
        className={
          "sidebar-section " +
          (clicked === "scores" ? "sidebar-section-opaque" : "")
        }
        onClick={() => setClicked("scores")}
      >
        <div className="sidebar-section-icon">
          <VscLibrary className="library-icon" />
        </div>
        <div className="sidebar-section-text">My Scores</div>
      </div>
      <div
        className={
          "sidebar-section " +
          (clicked === "collections" ? "sidebar-section-opaque" : "")
        }
        onClick={() => setClicked("collections")}
      >
        <div className="sidebar-section-icon">
          <BsCollection className="library-icon" />
        </div>
        <div className="sidebar-section-text">Collections</div>
      </div>
      <div
        className={
          "sidebar-section " +
          (clicked === "favorites" ? "sidebar-section-opaque" : "")
        }
        onClick={() => setClicked("favorites")}
      >
        <div className="sidebar-section-icon">
          <MdFavoriteBorder className="library-icon" />
        </div>
        <div className="sidebar-section-text">Favorites</div>
      </div>
      <div
        className={
          "sidebar-section " +
          (clicked === "recent" ? "sidebar-section-opaque" : "")
        }
        onClick={() => setClicked("recent")}
      >
        <div className="sidebar-section-icon">
          <RxCounterClockwiseClock className="library-icon" />
        </div>
        <div className="sidebar-section-text">Recent</div>
      </div>
      <div
        className={
          "sidebar-section " +
          (clicked === "trash" ? "sidebar-section-opaque" : "")
        }
        onClick={() => setClicked("trash")}
      >
        <div className="sidebar-section-icon">
          <HiOutlineTrash className="library-icon" />
        </div>
        <div className="sidebar-section-text">Trash</div>
      </div>
    </div>
  );
};

export default Sidebar;
