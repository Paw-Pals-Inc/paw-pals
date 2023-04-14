import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SideNavbar from "../Home/SideNavbar";
import UserProfile from "./UserProfile";
import PageHeader from "../Home/PageHeader";
import { getUserProfile } from "../../utils/fetchRequests";
import LoadingProgress from "../Loading/LoadingProgress";
import "./profile.css";

const ProfilePage = ({
  isLoggedIn,
  onLogout,
  userProfile,
  updateUserProfile,
  userData,
  userProfiles,
  updateUserProfiles,
  favoriteProfiles,
  updateFavoriteProfiles,
  addFavorite,
  removeFavorite,
  compatibilityScores,
  buttonVariant,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userProfile || !userProfile.profilePic) {
      setIsLoading(true);
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 600);
    }
  }, [userProfile]);

  useEffect(() => {
    // on homepage load, get user profile data
    (async () => {
      const response = await getUserProfile(
        JSON.parse(localStorage.getItem("user")).id
      );
      updateUserProfile(response);
      console.log(response);
      if (!response) onLogout(); // logout if I don't get a response
    })();
  }, []);

  return isLoading ? (
    <LoadingProgress />
  ) : (
    <div className="homepage">
      <div className="content">
        <div className="sideNav">
          <SideNavbar onLogout={onLogout} userProfile={userProfile} />
        </div>
        <div className="contentRight">
          <PageHeader
            pageName={location.pathname}
            profile={userProfile}
            buttonVariant={buttonVariant}
          />
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
