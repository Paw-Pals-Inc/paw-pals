import { Avatar } from "@mui/material";
import React from "react";

function PageHeader(props) {
  const { pageName, profile, profilePic } = props;
  const { firstName, petName } = profile ? profile : "";

  let pageTitle = pageName.slice(1);
  let upperFirstLetter = pageTitle[0].toUpperCase();
  let upperPageTitle = upperFirstLetter + pageTitle.slice(1);
  console.log(upperPageTitle);

  // render page name in top left
  // render profile info and profile pic in top right

  return (
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
          <Avatar src={profilePic}>
            {profile && firstName && firstName[0]}
          </Avatar>
        </div>
      </div>
    </div>
  );
}

export default PageHeader;
