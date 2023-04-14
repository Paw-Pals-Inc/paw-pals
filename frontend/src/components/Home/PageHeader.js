import { Avatar } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import LoadingProgress from "../Loading/LoadingProgress";

function PageHeader(props) {
  const navigate = useNavigate();
  const { pageName, profile } = props;
  const { firstName, petName, profilePic } = profile ? profile : "";
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!profilePic || !profile) {
      setIsLoading(true);
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 600);
    }
  }, [profile, profilePic]);

  let pageTitle = pageName.slice(1);
  let upperFirstLetter = pageTitle[0].toUpperCase();
  let upperPageTitle = upperFirstLetter + pageTitle.slice(1);

  // render page name in top left
  // render profile info and profile pic in top right

  return isLoading ? (
    <LoadingProgress />
  ) : (
    <div className="pageHeader">
      <div className="pageName">
        <h1>{upperPageTitle}</h1>
      </div>
      <div className="profileCorner">
        <div className="profileNames">
          <span className="ownerName">{firstName}</span>
          <span className="petName">{petName}</span>
        </div>
        <div className="profilePic">
          <Avatar
            src={profile && profilePic}
            sx={{ width: 50, height: 50, cursor: "pointer" }}
            onClick={() => navigate("/profile")}
          >
            {profile && firstName && firstName[0]}
          </Avatar>
        </div>
      </div>
    </div>
  );
}

export default PageHeader;
