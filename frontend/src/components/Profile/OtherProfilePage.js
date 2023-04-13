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
    <div className="mainContainer-otherProfile">
      <ArrowCircleLeftIcon onClick={leaveProfile} />
      <OtherUserProfile
        userProfile={userProfile}
        compatibilityScore={compatibilityScore()}
      />
    </div>
  );
};

export default OtherProfilePage;
