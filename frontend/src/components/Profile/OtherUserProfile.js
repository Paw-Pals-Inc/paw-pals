import React, { useState, useEffect } from "react";
import OtherProfileSection from "./OtherProfileSection";
import MaterialButton from "../MaterialComponents/MaterialButton";
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router";
import LoadingProgress from "../Loading/LoadingProgress";

function OtherUserProfile({
  myProfile,
  userProfile,
  compatibilityScore,
  isFavorite,
  addFavorite,
  removeFavorite,
  favoriteProfiles,
}) {
  const navigate = useNavigate();
  const currentPage = useLocation().pathname;
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileFavorite, setIsProfileFavorite] = useState(isFavorite);

  useEffect(() => {
    if (
      !myProfile ||
      !userProfile ||
      !userProfile.petGallery ||
      !userProfile.profilePic
    ) {
      setIsLoading(true);
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 600);
    }
  }, [userProfile, myProfile]);

  useEffect(() => {
    // check if favorite again
    if (favoriteProfiles.includes(userProfile.userID))
      setIsProfileFavorite(true);
  }, [isFavorite, favoriteProfiles]);

  return isLoading ? (
    <LoadingProgress />
  ) : (
    <div className="otherProfile-container">
      <div className="picture-section">
        <img
          src={
            userProfile && userProfile.petGallery && userProfile.petGallery[0]
          }
          alt="pet profile pic"
        />
        <img src={userProfile && userProfile.profilePic} alt="profile pic" />
        {currentPage !== "/chats" && (
          <MaterialButton
            styleOverrides={{ width: "100%", backgroundColor: "#ffd29d" }}
            onClick={() =>
              navigate("/chats", { state: { selectedUser: userProfile } })
            }
          >
            Message
          </MaterialButton>
        )}
      </div>
      <div className="profile-section">
        <OtherProfileSection
          userProfile={userProfile}
          myProfile={myProfile}
          compatibilityScore={compatibilityScore}
        />
      </div>
      <div className="favorite-section">
        {isProfileFavorite ? "favorited" : "favorite"}
        {isProfileFavorite ? (
          <StarIcon
            onClick={() => {
              setIsProfileFavorite(false);
              removeFavorite(userProfile.userID);
            }}
            sx={{ width: "30px", height: "30px", cursor: "pointer" }}
          />
        ) : (
          <StarBorderIcon
            onClick={() => {
              setIsProfileFavorite(true);
              addFavorite(userProfile.userID);
            }}
            sx={{ width: "30px", height: "30px", cursor: "pointer" }}
          />
        )}
      </div>
    </div>
  );
}

export default OtherUserProfile;
