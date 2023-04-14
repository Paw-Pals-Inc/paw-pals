import React, { useState, useEffect } from "react";
import OtherProfileSection from "./OtherProfileSection";
import MaterialButton from "../MaterialComponents/MaterialButton";
import { Badge } from "@mui/material";
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router";
import LoadingProgress from "../Loading/LoadingProgress";

function OtherUserProfile({
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
  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: "yellow",
      color: "black",
      fontSize: "1.5rem",
      width: "45px",
      height: "45px",
      border: "none",
      top: "10px",
      left: "25px",
      borderRadius: "50%",
      boxShadow:
        "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
    },
  }));

  useEffect(() => {
    if (!userProfile || !userProfile.petGallery || !userProfile.profilePic) {
      setIsLoading(true);
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 600);
    }
  }, [userProfile]);

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
        <StyledBadge
          badgeContent={compatibilityScore}
          overlap="circular"
          showZero
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <img src={userProfile.petGallery[0]} alt="pet profile pic" />
        </StyledBadge>
        <img src={userProfile.profilePic} alt="profile pic" />
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
        <OtherProfileSection userProfile={userProfile} />
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
