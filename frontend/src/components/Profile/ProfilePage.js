import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import SideNavbar from "../Home/SideNavbar";
import UserProfile from "./UserProfile";
import PageHeader from "../Home/PageHeader";
import "./profile.css";

const ProfilePage = ({
  isLoggedIn,
  onLogout,
  userProfile,
  updateUserProfile,
  userData,
  profilePic,
  petGallery,
  petGalleries,
  userProfiles,
  updateUserProfiles,
  updateProfilePics,
  updateProfilePic,
  updatePetGallery,
  updatePetGalleries,
  favoriteProfiles,
  updateFavoriteProfiles,
  addFavorite,
  removeFavorite,
  compatibilityScores,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // go home to load pics if they aren't loaded
    console.log("pet gallery: ", petGallery);
    if (petGallery.length < 1) {
      navigate("/home");
    }
  }, []);

  useEffect(() => {
    // on homepage load, get user profile data
    const getUserProfile = async () => {
      if (localStorage.getItem("user") !== null) {
        let userID = JSON.parse(localStorage.getItem("user")).id;
        const jwt = localStorage.getItem("token");
        const response = await fetch(`http://localhost:4000/users/${userID}`, {
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        });
        if (response.ok) {
          response.json().then((data) => {
            // localStorage.setItem("userProfile", JSON.stringify(data));
            updateUserProfile(data);
            updatePetGallery(data);
            updateProfilePic(data);
          });
        } else {
          onLogout();
        }
      }
    };
    getUserProfile();
  }, []);
  return (
    <div className="homepage">
      <div className="content">
        <div className="sideNav">
          <SideNavbar onLogout={onLogout} userProfile={userProfile} />
        </div>
        <div className="contentRight">
          <PageHeader
            pageName={location.pathname}
            profile={userProfile}
            profilePic={profilePic}
          />
          <div className="mainContainer">
            <UserProfile
              updateUserProfile={updateUserProfile}
              userProfile={userProfile}
              profilePic={profilePic}
              petGallery={petGallery}
              updatePetGallery={updatePetGallery}
              updateProfilePic={updateProfilePic}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
