import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import MaterialButton from "../MaterialComponents/MaterialButton";
import LoginModal from "../Navbar/LoginModal";
import SignupModal from "./SignupModal";
import "./landing.css";
import banner from "../../assets/landing.png";

const LandingPage = ({
  isLoggedIn,
  onLogin,
  updateUserData,
  updateUserProfile,
  updateToken,
}) => {
  const handleSignupButton = () => {
    setShowLoginModal((prev) => false);
    toggleSignup();
  };
  const handleLoginButton = () => {
    toggleLogin();
    setShowSignupModal((prev) => false);
  };

  const [createdAccount, setCreatedAccount] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const completedAccountCreation = (status) => {
    setCreatedAccount((prev) => status);
  };

  const toggleLogin = () => {
    setShowLoginModal((prev) => !prev);
  };
  const toggleSignup = () => {
    setShowSignupModal((prev) => !prev);
  };
  return (
    <div>
      <div>
        <Navbar
          isLoggedIn={isLoggedIn}
          onLogin={onLogin}
          handleLogin={handleLoginButton}
        />
      </div>
      <div className="main">
        <div className="contentContainer">
          <h1 className="welcome">Welcome</h1>
          <p className="subtext">
            Do you have a furry friend who could use some socialization? Our app
            makes it easy to connect with other dog owners in your area and
            schedule playdates for your pups 🐶.
          </p>
          <MaterialButton onClick={handleSignupButton}>Sign up</MaterialButton>
        </div>
        {showLoginModal && (
          <div className="loginContainer">
            <LoginModal onLogin={onLogin} />
          </div>
        )}{" "}
        {showSignupModal && (
          <div className="loginContainer">
            <SignupModal
              onLogin={onLogin}
              createdAccountStatus={completedAccountCreation}
              updateUserData={updateUserData}
              updateUserProfile={updateUserProfile}
              updateToken={updateToken}
            />
          </div>
        )}
        {!showLoginModal && !showSignupModal && (
          <div className="imageContainer">
            <img className="landingImage" src={banner} alt="dogs playing" />
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
