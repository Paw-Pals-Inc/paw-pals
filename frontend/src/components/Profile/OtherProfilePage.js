import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import SideNavbar from "../Home/SideNavbar";
import OtherUserProfile from "./OtherUserProfile";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";

const OtherProfilePage = ({
  isLoggedIn,
  onLogout,
  userProfile,
  updateUserProfile,
  userData,
  leaveProfile,
  compatibilityScore,
}) => {
  return (
    <div className="homepage">
      <div className="content">
        <div className="sideNav"></div>
        <div className="mainContainer">
          <ArrowCircleLeftIcon onClick={leaveProfile} />
          <OtherUserProfile
            userProfile={userProfile}
            compatibilityScore={compatibilityScore}
          />
        </div>
      </div>
    </div>
  );
};

export default OtherProfilePage;
