import React, { useState, useEffect } from "react";
import MaterialButton from "../MaterialComponents/MaterialButton";
import LoadingProgress from "../Loading/LoadingProgress";
import ImageGallery from "../ImageGallery/ImageGallery";

function OtherProfileSection({ userProfile }) {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState(
    userProfile?.petGallery?.map((imgUrl) => {
      return {
        src: imgUrl,
        alt: "pet image",
      };
    })
  );
  useEffect(() => {
    if (!userProfile || !userProfile.petGallery) {
      setIsLoading(true);
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 600);
    }
  }, [userProfile]);

  useEffect(() => {
    setImages(
      userProfile.petGallery?.map((imgUrl) => {
        return {
          src: imgUrl,
          alt: "pet image",
        };
      })
    );
  }, [userProfile.petGallery]);

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
              <li>vaccinated: {userProfile.petVaccinated ? "Yes" : "No"}</li>
              <li>neutered: {userProfile.petNeutered ? "Yes" : "No"}</li>
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
        <div
          className="galleryPictureSection"
          style={{ paddingBottom: "40px" }}
        >
          {userProfile.petGallery && <ImageGallery images={images} />}
        </div>
      </div>
    </div>
  );
}

export default OtherProfileSection;
