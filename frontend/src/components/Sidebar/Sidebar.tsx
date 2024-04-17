import "./Sidebar.css";
import { VscLibrary } from "react-icons/vsc";
import { MdFavoriteBorder } from "react-icons/md";
import { BsCollection } from "react-icons/bs";
import { useState } from "react";

const Sidebar = () => {
  const [clicked, setClicked] = useState<string>("library");

  return (
    <div className="sidebar-container lato-regular">
      <div
        className={
          "sidebar-section " +
          (clicked === "library" ? "sidebar-section-opaque" : "")
        }
      >
        <div className="sidebar-section-icon">
          <VscLibrary className="library-icon" />
        </div>
        <div className="sidebar-section-text">My Library</div>
      </div>
      <div
        className={
          "sidebar-section " +
          (clicked === "favorites" ? "sidebar-section-opaque" : "")
        }
      >
        <div className="sidebar-section-icon">
          <MdFavoriteBorder className="library-icon" />
        </div>
        <div className="sidebar-section-text">Favourites</div>
      </div>
      <div
        className={
          "sidebar-section " +
          (clicked === "collections" ? "sidebar-section-opaque" : "")
        }
      >
        <div className="sidebar-section-icon">
          <BsCollection className="library-icon" />
        </div>
        <div className="sidebar-section-text">Collections</div>
      </div>
    </div>
  );
};

export default Sidebar;
