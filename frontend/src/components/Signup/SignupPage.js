import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import ProfileModal from "./ProfileModal";
import DogProfileModal from "./DogProfileModal";
import DogPersonalityModal from "./DogPersonalityModal";
import DescriptionModal from "./DescriptionModal";
import PictureModal from "./PictureModal";
import "./signup.css";

const SignupPage = ({
  isLoggedIn,
  onLogin,
  onLogout,
  updateUserProfile,
  userProfile,
  userData,
  updateToken,
}) => {
  const [createdProfile, setCreatedProfile] = useState(
    JSON.parse(localStorage.getItem("createdProfile"))
  );
  const [createdDogProfile, setCreatedDogProfile] = useState(
    JSON.parse(localStorage.getItem("createdDogProfile"))
  );
  const [createdDogPersonality, setCreatedDogPersonality] = useState(
    JSON.parse(localStorage.getItem("createdDogPersonality"))
  );
  const [createdDescription, setCreatedDescription] = useState(
    JSON.parse(localStorage.getItem("createdDescription"))
  );
  const [createdPictures, setCreatedPictures] = useState(
    JSON.parse(localStorage.getItem("createdPictures"))
  );

  const completedProfileCreation = (status) => {
    setCreatedProfile((prev) => status);
  };
  const completedDogProfileCreation = (status) => {
    setCreatedDogProfile((prev) => status);
  };
  const completedDogPersonalityCreation = (status) => {
    setCreatedDogPersonality((prev) => status);
  };
  const completedDescriptionCreation = (status) => {
    setCreatedDescription((prev) => status);
  };
  const completedPicturesCreation = (status) => {
    setCreatedPictures((prev) => status);
  };

  return (
    <div className="signup-page">
      <Navbar isLoggedIn={isLoggedIn} onLogin={onLogin} signup={true} />
      <div className="signup-content">
        <h1>Create your account</h1>
        {createdProfile === true ? (
          createdDogProfile === true ? (
            createdDogPersonality === true ? (
              createdDescription === true ? (
                <PictureModal
                  userData={userData}
                  userProfile={userProfile}
                  updateUserProfile={updateUserProfile}
                  createdDescriptonStatus={completedDescriptionCreation}
                  createdPicturesStatus={completedPicturesCreation}
                  updateToken={updateToken}
                  onLogin={onLogin}
                />
              ) : (
                <DescriptionModal
                  userData={userData}
                  userProfile={userProfile}
                  updateUserProfile={updateUserProfile}
                  createdDescriptonStatus={completedDescriptionCreation}
                  createdDogPersonalityStatus={completedDogPersonalityCreation}
                  updateToken={updateToken}
                  onLogin={onLogin}
                />
              )
            ) : (
              <DogPersonalityModal
                userData={userData}
                userProfile={userProfile}
                updateUserProfile={updateUserProfile}
                createdDogProfileStatus={completedDogProfileCreation}
                createdDogPersonalityStatus={completedDogPersonalityCreation}
                updateToken={updateToken}
                onLogin={onLogin}
              />
            )
          ) : (
            <DogProfileModal
              userProfile={userProfile}
              updateUserProfile={updateUserProfile}
              createdDogProfileStatus={completedDogProfileCreation}
              createdProfileStatus={completedProfileCreation}
            />
          )
        ) : (
          <ProfileModal
            userProfile={userProfile}
            updateUserProfile={updateUserProfile}
            createdProfileStatus={completedProfileCreation}
          />
        )}
      </div>
    </div>
  );
};

export default SignupPage;
