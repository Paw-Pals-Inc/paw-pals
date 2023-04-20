import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import SideNavbar from "../Home/SideNavbar";
import OtherUserProfile from "./OtherUserProfile";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import LoadingProgress from "../Loading/LoadingProgress";
import { motion } from "framer-motion";

const OtherProfilePage = ({
  myProfile,
  isLoggedIn,
  onLogout,
  userProfile,
  myProfile,
  updateUserProfile,
  userData,
  leaveProfile,
  compatibilityScore,
  addFavorite,
  removeFavorite,
  isFavorite,
  favoriteProfiles,
  buttonVariant,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userProfile || !myProfile) {
      setIsLoading(true);
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 600);
    }
  }, [userProfile, myProfile]);

  return isLoading ? (
    <LoadingProgress />
  ) : (
    <div className="mainContainer-otherProfile">
      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        <motion.div
          variants={buttonVariant}
          whileHover="whileHover"
          whileTap="whileTap"
        >
          <ArrowCircleLeftIcon
            onClick={leaveProfile}
            sx={{ width: "30px", height: "30px", cursor: "pointer" }}
          />
        </motion.div>
      </div>
      <OtherUserProfile
        userProfile={userProfile}
        compatibilityScore={compatibilityScore()}
        isFavorite={isFavorite}
        addFavorite={addFavorite}
        removeFavorite={removeFavorite}
        favoriteProfiles={favoriteProfiles}
        myProfile={myProfile}
      />
    </div>
  );
};

export default OtherProfilePage;
