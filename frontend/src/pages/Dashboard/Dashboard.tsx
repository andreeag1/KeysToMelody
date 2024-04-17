import Sidebar from "../../components/Sidebar/Sidebar";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard">
        <div className="scores-container lato-regular">
          <div className="scores-container-title">My Scores</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
