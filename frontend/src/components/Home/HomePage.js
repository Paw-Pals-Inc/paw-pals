import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SideNavbar from "./SideNavbar";
import ProfileCard from "./ProfileCard";
import OtherProfilePage from "../Profile/OtherProfilePage";
import PageHeader from "./PageHeader";
import FilterBar from "../Filters/FilterBar";
import {
  getSizeBoundsArr,
  getAgeBoundsArr,
  getCompatibilityScore,
} from "../../utils/functions";
import {
  getUserProfile,
  getOtherUserProfiles,
  getFavoriteProfiles,
} from "../../utils/fetchRequests";
import "./home.css";
import LoadingProgress from "../Loading/LoadingProgress";
import { motion } from "framer-motion";

const HomePage = ({
  onLogout,
  userData,
  userProfile,
  userProfiles,
  updateUserProfile,
  updateUserProfiles,
  favoriteProfiles,
  updateFavoriteProfiles,
  addFavorite,
  removeFavorite,
  compatibilityScores,
  buttonVariant,
}) => {
  const [profileSelected, setProfileSelected] = useState(false); // used to render a specific profile page or homepage stuff
  const [filteredProfiles, setFilteredProfiles] = useState(userProfiles);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [clearFilters, setClearFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!userProfile || !userProfiles) {
      setIsLoading(true);
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 600);
    }
  }, [userProfile, userProfiles]);

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

  useEffect(() => {
    // get other user's data on home page load
    (async () => {
      const response = await getOtherUserProfiles(
        JSON.parse(localStorage.getItem("user")).id
      );
      updateUserProfiles(response);
      setFilteredProfiles(response);
    })();
  }, []);

  useEffect(() => {
    // get favorites data on favorites page load
    (async () => {
      const response = await getFavoriteProfiles(
        JSON.parse(localStorage.getItem("user")).id
      );
      updateFavoriteProfiles(response);
      localStorage.setItem("favoriteProfiles", JSON.stringify(response));
    })();
  }, []);

  useEffect(() => {
    console.log("grabbing other profiles and re-rendering");
    if (!filteredProfiles) {
      setFilteredProfiles(userProfiles);
    }
  }, []);

  const handleFilter = (selectedFilters) => {
    const { sizeFilter, genderFilter, personalityFilter, ageFilter } =
      selectedFilters;

    // filter based on filters user used:
    let filteredProfiles;
    filteredProfiles = userProfiles
      .filter((profile) => {
        if (profile.petWeight === null || profile.petWeight === "") return true;
        if (sizeFilter.length > 0) {
          let sizeRange = getSizeBoundsArr(sizeFilter);
          return (
            profile.petWeight >= sizeRange[0] &&
            profile.petWeight <= sizeRange[1]
          );
        }
        return true;
      })
      .filter((profile) => {
        if (profile.petGender === "") return true;
        if (genderFilter.length > 0) {
          return genderFilter.includes(profile.petGender);
        }
        return true;
      })
      .filter((profile) => {
        if (
          profile.petTags === null ||
          profile.petTags === "" ||
          profile.petTags.length === 0
        )
          return true;
        if (personalityFilter.length > 0) {
          let profileTags = profile.petTags;
          return personalityFilter.every((tag) => profileTags.includes(tag));
          // return profileTags.some((tag) => personalityFilter.includes(tag));
        }
        return true;
      })
      .filter((profile) => {
        if (profile.petAge === null || profile.petAge === "") return true;
        if (ageFilter.length > 0) {
          let ageRange = getAgeBoundsArr(ageFilter);
          return profile.petAge >= ageRange[0] && profile.petAge <= ageRange[1];
        }
        return true;
      });

    setFilteredProfiles(filteredProfiles);
  };

  const handleClearFilter = () => {
    // clear filters
    setFilteredProfiles(userProfiles);
    setClearFilters((prev) => true);
  };

  const resetClearFilter = () => {
    setClearFilters((prev) => false);
  };

  const enterProfile = (profileID) => {
    console.log("entering profile ", profileID);
    setProfileSelected((prev) => true);
    setSelectedProfile((prev) => profileID);
  };

  const leaveProfile = () => {
    console.log("leaving profile");
    setProfileSelected((prev) => false);
    setSelectedProfile((prev) => null);
  };

  return isLoading ? (
    <LoadingProgress />
  ) : (
    <div className="homepage">
      <div className="content">
        <div className="sideNav">
          <SideNavbar onLogout={onLogout} userProfile={userProfile} />
        </div>

        <motion.div
          className="contentRight"
          key="homepage"
          initial={{ y: 600 }}
          animate={{ y: 0 }}
          exit={{ y: -600, delay: 1 }}
          transition={{ duration: 0.5 }}
        >
          <PageHeader pageName={location.pathname} profile={userProfile} />
          {profileSelected ? (
            <OtherProfilePage
              buttonVariant={buttonVariant}
              isFavorite={favoriteProfiles.includes(selectedProfile.userID)}
              addFavorite={addFavorite}
              removeFavorite={removeFavorite}
              favoriteProfiles={favoriteProfiles}
              myProfile={userProfile}
              userProfile={
                userProfiles.filter(
                  (profile) => profile.userID === selectedProfile
                )[0]
              }
              myProfile={userProfile}
              leaveProfile={leaveProfile}
              compatibilityScore={() =>
                getCompatibilityScore(
                  userProfiles.filter(
                    (profile) => profile.userID === selectedProfile
                  )[0],
                  compatibilityScores
                )
              }
            />
          ) : (
            <div className="mainContainer">
              <FilterBar
                onFilter={handleFilter}
                onClearFilter={handleClearFilter}
                clearFilters={clearFilters}
                resetClearFilter={resetClearFilter}
              />
              <div className="data">
                {!userProfiles || !filteredProfiles ? (
                  <div>No data yet!</div>
                ) : (
                  filteredProfiles
                    .sort(
                      (a, b) =>
                        getCompatibilityScore(b, compatibilityScores) -
                        getCompatibilityScore(a, compatibilityScores)
                    )
                    .map((profile, idx) => {
                      let isFavorite = favoriteProfiles.includes(
                        profile.userID
                      );
                      let compatibilityScore = getCompatibilityScore(
                        profile,
                        compatibilityScores
                      );

                      return (
                        <ProfileCard
                          key={idx}
                          profileData={profile}
                          isFavorite={isFavorite}
                          addFavorite={addFavorite}
                          removeFavorite={removeFavorite}
                          enterProfile={enterProfile}
                          compatibilityScore={compatibilityScore}
                          buttonVariant={buttonVariant}
                        />
                      );
                    })
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
