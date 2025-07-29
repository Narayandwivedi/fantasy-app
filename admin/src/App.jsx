import React from "react";
import { ToastContainer } from "react-toastify";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";

import ManagePlayers from "./pages/ManagePlayers/ManagePlayers";
import ManageTeams from "./pages/ManageTeams/ManageTeams";
import TeamDetails from "./pages/ManageTeams/TeamDetails";
import Demo from "./pages/Demo";
import UpcomingMatch from "./pages/ManageMatch/UpcomingMatch";
import LiveMatch from "./pages/ManageMatch/LiveMatch";
import CompletedMatch from "./pages/ManageMatch/CompletedMatch";
import MatchCard from "./components/MatchCard";
import MatchDetail from "./pages/ManageMatch/MatchDetail";
import ManageUser from "./pages/ManageUser";

const App = () => {
  return (
    <div>
      <ToastContainer />

      <div className="flex gap-4 lg:flex-row flex-col">
        <Sidebar />
        <Routes>

          <Route path="/" element={<ManagePlayers />} />
          <Route path="/manage-user" element={<ManageUser />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/teams" element={<ManageTeams />} />

          <Route path="/team-detail/:id" element={<TeamDetails />} />

          {/* for matches */}

          <Route path="/upcoming-matches" element={<UpcomingMatch />} />
          <Route path="/live-matches" element={<LiveMatch />} />
          <Route path="/completed-matches" element={<CompletedMatch />} />
          <Route path="/matches/:matchId" element={<MatchDetail />} />
          <Route path="/test" element={<MatchCard />} />

        </Routes>
      </div>
    </div>
  );
};

export default App;
