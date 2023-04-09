import React, { useState, useEffect } from "react";
import OtherProfileSection from "./OtherProfileSection";

function OtherUserProfile({ userProfile, compatibilityScore }) {
  return (
    <div className="container">
      <div className="col-1 picture-section"></div>
      <div className="col-2 profile-section">
        <OtherProfileSection profile={userProfile} />
      </div>
      <div className="col-3 favorite-section"></div>
    </div>
  );
}

export default OtherUserProfile;
