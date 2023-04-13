import React, { useState, useEffect } from "react";
import OtherProfileSection from "./OtherProfileSection";
import MaterialButton from "../MaterialComponents/MaterialButton";
import { Badge } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router";

function OtherUserProfile({ userProfile, compatibilityScore }) {
  const navigate = useNavigate();
  const currentPage = useLocation().pathname;
  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: "yellow",
      color: "black",
      fontSize: "1.5rem",
      width: "45px",
      height: "45px",
      border: "1px solid black",
      top: "10px",
      left: "25px",
      borderRadius: "50%",
    },
  }));

  return (
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
      <div className="favorite-section"></div>
    </div>
  );
}

export default OtherUserProfile;
