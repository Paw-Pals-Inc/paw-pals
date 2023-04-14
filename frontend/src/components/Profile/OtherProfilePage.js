import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import SideNavbar from "../Home/SideNavbar";
import OtherUserProfile from "./OtherUserProfile";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import LoadingProgress from "../Loading/LoadingProgress";

const OtherProfilePage = ({
  isLoggedIn,
  onLogout,
  userProfile,
  updateUserProfile,
  userData,
  leaveProfile,
  compatibilityScore,
  addFavorite,
  removeFavorite,
  isFavorite,
  favoriteProfiles,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userProfile) {
      setIsLoading(true);
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 600);
    }
  }, [userProfile]);

  return isLoading ? (
    <LoadingProgress />
  ) : (
    <div className="mainContainer-otherProfile">
      <ArrowCircleLeftIcon
        onClick={leaveProfile}
        sx={{ width: "30px", height: "30px", cursor: "pointer" }}
      />
      <OtherUserProfile
        userProfile={userProfile}
        compatibilityScore={compatibilityScore()}
        isFavorite={isFavorite}
        addFavorite={addFavorite}
        removeFavorite={removeFavorite}
        favoriteProfiles={favoriteProfiles}
      />
    </div>
  );
};

export default OtherProfilePage;
