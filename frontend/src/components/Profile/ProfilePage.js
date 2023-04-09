import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import SideNavbar from "../Home/SideNavbar";
import UserProfile from "./UserProfile";
import PageHeader from "../Home/PageHeader";

const ProfilePage = ({
  isLoggedIn,
  onLogout,
  userProfile,
  updateUserProfile,
  userData,
}) => {
  const location = useLocation();
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
            updateUserProfile(data);
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
          <PageHeader pageName={location.pathname} profile={userProfile} />
          <div className="mainContainer">
            <UserProfile
              updateUserProfile={updateUserProfile}
              userProfile={userProfile}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
