import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SideNavbar from "./SideNavbar";
import ProfileCard from "./ProfileCard";
import OtherProfilePage from "../Profile/OtherProfilePage";
import PageHeader from "./PageHeader";
import FilterBar from "../Filters/FilterBar";
import { getSizeBoundsArr, getAgeBoundsArr } from "../../utils/functions";
import "./home.css";
import { CleaningServicesTwoTone } from "@mui/icons-material";

const HomePage = ({
  onLogout,
  userProfile,
  profilePic,
  petGallery,
  petGalleries,
  userProfiles,
  updateUserProfile,
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
  const [profileSelected, setProfileSelected] = useState(false); // used to render a specific profile page or homepage stuff
  const [filteredProfiles, setFilteredProfiles] = useState(userProfiles);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [clearFilters, setClearFilters] = useState(false);

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

  useEffect(() => {
    // get other user's data on home page load
    const getOtherProfiles = async () => {
      if (localStorage.getItem("user") !== null) {
        const jwt = localStorage.getItem("token");
        const response = await fetch(`http://localhost:4000/users/`, {
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        });
        if (response.ok) {
          response.json().then((data) => {
            let filteredData = data.filter(
              (profile) =>
                profile.userID !== JSON.parse(localStorage.getItem("user")).id
            );
            updateUserProfiles(filteredData);
            updateProfilePics(filteredData);
            updatePetGalleries(filteredData);
            console.log(petGalleries);
          });
        }
      }
    };

    getOtherProfiles();
  }, []);

  useEffect(() => {
    console.log("grabbing other profiles and re-rendering");
    if (!filteredProfiles) {
      filteredProfiles = userProfiles;
    }
  }, []);

  useEffect(() => {
    // get favorites data on favorites page load
    const getFavorites = async () => {
      if (localStorage.getItem("user") !== null) {
        let userAccount = JSON.parse(localStorage.getItem("user"));
        const jwt = localStorage.getItem("token");
        const favorites = await fetch(
          `http://localhost:4000/favorites/${userAccount.id}`,
          {
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`,
            },
          }
        );

        if (favorites.ok) {
          let favResp = await favorites.json();
          let favProfiles = favResp.favorites ? favResp.favorites : [];
          updateFavoriteProfiles(favProfiles);
          localStorage.setItem(
            "favoriteProfiles",
            JSON.stringify([...favProfiles])
          );
        } else {
          let error = await favorites.json();
          console.log(error.message);
        }
      }
    };

    getFavorites();
  }, []);

  useEffect(() => {
    console.log("galleries: ", petGalleries);
  }, [petGalleries]);

  const handleFilter = (selectedFilters) => {
    const { sizeFilter, genderFilter, personalityFilter, ageFilter } =
      selectedFilters;
    console.log("size filter array: ", sizeFilter);
    console.log("gender filter array: ", genderFilter);
    console.log("personality filter array: ", personalityFilter);
    console.log("age filter array: ", ageFilter);
    // filter based on filters user used:
    let filteredProfiles;
    filteredProfiles = userProfiles
      .filter((profile) => {
        if (profile.petWeight === null || profile.petWeight === "") return true;
        if (sizeFilter.length > 0) {
          let sizeRange = getSizeBoundsArr(sizeFilter);
          console.log("size boundary: ", sizeRange);
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
          console.log(profileTags);
          return personalityFilter.every((tag) => profileTags.includes(tag));
          // return profileTags.some((tag) => personalityFilter.includes(tag));
        }
        return true;
      })
      .filter((profile) => {
        if (profile.petAge === null || profile.petAge === "") return true;
        if (ageFilter.length > 0) {
          let ageRange = getAgeBoundsArr(ageFilter);
          console.log("age boundary: ", ageRange);
          return profile.petAge >= ageRange[0] && profile.petAge <= ageRange[1];
        }
        return true;
      });

    console.log("filtered profiles: ", filteredProfiles);
    setFilteredProfiles(filteredProfiles);
  };

  const handleClearFilter = () => {
    // clear filters
    setFilteredProfiles(userProfiles);
    console.log("sending clear filter bar command");
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

  const getCompatibilityScore = (profile) => {
    let compatibilityScore = compatibilityScores.filter(
      (prof) => prof.userId === profile.userID
    )[0]?.score;
    return compatibilityScore;
  };

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
          {profileSelected ? (
            <OtherProfilePage
              userProfile={
                userProfiles.filter(
                  (profile) => profile.userID === selectedProfile
                )[0]
              }
              leaveProfile={leaveProfile}
              compatibilityScore={() =>
                getCompatibilityScore(
                  userProfiles.filter(
                    (profile) => profile.userID === selectedProfile
                  )[0]
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
                {!userProfiles ||
                !filteredProfiles ||
                !petGalleries.length > 0 ? (
                  <div>No data yet!</div>
                ) : (
                  filteredProfiles.map((profile, idx) => {
                    let isFavorite = favoriteProfiles.includes(profile.userID);
                    let compatibilityScore = getCompatibilityScore(profile);
                    console.log("pet galleries: ", petGalleries);
                    let petGallery;
                    if (petGalleries.length > 0) {
                      console.log("pet galleries: ", petGalleries);
                      try {
                        petGallery =
                          petGalleries &&
                          petGalleries.filter(
                            (prof) => prof.userID === profile.userID
                          )[0].petGallery;
                        console.log("pet gallery chosen: ", petGallery);
                      } catch (err) {
                        console.error(err);
                      }
                    }

                    return (
                      <ProfileCard
                        key={idx}
                        profileData={profile}
                        isFavorite={isFavorite}
                        addFavorite={addFavorite}
                        removeFavorite={removeFavorite}
                        enterProfile={enterProfile}
                        compatibilityScore={compatibilityScore}
                        petGallery={petGallery}
                      />
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
