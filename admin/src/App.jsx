import React from "react";
import { ToastContainer } from "react-toastify";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";

import ManagePlayers from "./pages/ManagePlayers/ManagePlayers";
import ManageTeams from "./pages/ManageTeams/ManageTeams";
import TeamDetails from "./pages/ManageTeams/TeamDetails";
import Demo from "./pages/Demo";
import UpcomingMath from "./pages/ManageMatch/UpcomingMath";
import LiveMatch from "./pages/ManageMatch/LiveMatch";
import CompletedMatch from "./pages/ManageMatch/CompletedMatch";
import MatchCard from "./components/MatchCard";

const App = () => {
  return (
    <div>
      <ToastContainer />

      <div className="flex gap-4 lg:flex-row flex-col">
        <Sidebar />
        <Routes>
          <Route path="/" element={<ManagePlayers />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/teams" element={<ManageTeams />} />

          <Route path="/team-detail/:id" element={<TeamDetails />} />

          {/* for matches */}

          <Route path="/matches/upcoming" element={<UpcomingMath />} />
          <Route path="/matches/live" element={<LiveMatch />} />
          <Route path="/matches/completed" element={<CompletedMatch />} />
          <Route path="/test" element={<MatchCard />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
