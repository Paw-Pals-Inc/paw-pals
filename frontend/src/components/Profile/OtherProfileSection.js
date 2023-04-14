import React, { useState, useEffect } from "react";
import MaterialButton from "../MaterialComponents/MaterialButton";
import LoadingProgress from "../Loading/LoadingProgress";

function OtherProfileSection({ userProfile }) {
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!userProfile || !userProfile.petGallery) {
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
    <div style={{ width: "100%" }}>
      <div className="section-header">
        <h2>{userProfile.petName}</h2>
        <h2>{userProfile.petBreed}</h2>
      </div>
      <div>
        <div className="field-line">{userProfile.petDescription}</div>
        <div className="field-line about-tags-section">
          <div>
            <h3>About</h3>
            <ul className="about-list">
              <li>age: {userProfile.petAge}</li>
              <li>weight: {userProfile.petWeight}</li>
              <li>vaccinated: {userProfile.petVaccinated}</li>
              <li>neutered: {userProfile.petNeutered}</li>
              <li>location: {userProfile.city + ", " + userProfile.state}</li>
            </ul>
          </div>
          <div>
            <h3>Tags:</h3>
            <div className="tags-list">
              {userProfile.petTags.map((tag, idx) => (
                <MaterialButton
                  key={idx}
                  styleOverrides={{ width: "auto", backgroundColor: "#FFD29D" }}
                >
                  {tag}
                </MaterialButton>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "5%", alignItems: "baseline" }}>
          <h3>Owner:</h3>
          <span>{userProfile.firstName + " " + userProfile.lastName}</span>
        </div>
        <div className="field-line">
          <span>{userProfile.description}</span>
        </div>
        <div className="field-line">
          <h3>Gallery</h3>
        </div>
        <div className="galleryPictureSection">
          {userProfile.petGallery &&
            userProfile.petGallery.map((pic, idx) => (
              <div key={idx} className="galleryImageDiv">
                <img src={pic} alt={`doggie${idx}`} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default OtherProfileSection;
