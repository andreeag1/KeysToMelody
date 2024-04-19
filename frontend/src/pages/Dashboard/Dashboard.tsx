import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Dashboard.css";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdCreateNewFolder } from "react-icons/md";

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard">
        <div className="scores-container lato-regular">
          <div className="scores-container-title">My Scores</div>
          <div className="add-score-collection-container">
            <div className="add-collection-container">
              <MdCreateNewFolder className="add-score-icon" />
              <div className="new-score">New Collection</div>
            </div>
            <div
              className="add-score-container"
              onClick={() => navigate("/new")}
            >
              <IoMdAddCircleOutline className="add-score-icon" />
              <div className="new-score">New Score</div>
            </div>
          </div>
        </div>
        <div className="scores-list-container">
          <div className="new-score-container" onClick={() => navigate("/new")}>
            <IoMdAddCircleOutline className="new-score-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
