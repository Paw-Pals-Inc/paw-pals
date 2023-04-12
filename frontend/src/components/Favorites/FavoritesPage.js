import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SideNavbar from "../Home/SideNavbar";
import ProfileCard from "../Home/ProfileCard";
import OtherProfilePage from "../Profile/OtherProfilePage";
import PageHeader from "../Home/PageHeader";
import FilterBar from "../Filters/FilterBar";

const FavoritesPage = ({
  isLoggedIn,
  onLogout,
  userProfile,
  addFavorite,
  removeFavorite,
  userProfiles,
  compatibilityScores,
  favoriteProfiles,
  profilePic,
  petGallery,
  petGalleries,
  updateUserProfile,
  updateUserProfiles,
  updateProfilePics,
  updateProfilePic,
  updatePetGallery,
  updatePetGalleries,
  updateFavoriteProfiles,
}) => {
  const location = useLocation();
  const [profileSelected, setProfileSelected] = useState(false); // used to render a specific profile page or homepage stuff
  const [filteredProfiles, setFilteredProfiles] = useState(
    userProfiles.filter((prof) => favoriteProfiles.includes(prof.userID))
  );
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [clearFilters, setClearFilters] = useState(false);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favoriteProfiles"))
  );

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

  const getSizeBoundsArr = (sizeFilterArr) => {
    console.log(sizeFilterArr);

    let minWeight;
    let maxWeight;
    // manipulate array
    if (sizeFilterArr.includes("Small")) {
      minWeight = 0;
      if (sizeFilterArr.includes("Medium")) {
        if (sizeFilterArr.includes("Large")) {
          maxWeight = 1000;
        } else {
          maxWeight = 58;
        }
      } else {
        maxWeight = 23;
      }
    } else if (sizeFilterArr.includes("Medium")) {
      minWeight = 24;
      if (sizeFilterArr.includes("Large")) {
        maxWeight = 1000;
      } else {
        maxWeight = 58;
      }
    } else if (sizeFilterArr.includes("Large")) {
      minWeight = 59;
      maxWeight = 1000;
    }

    return [minWeight, maxWeight];
  };

  const getAgeBoundsArr = (ageFilterArr) => {
    console.log(ageFilterArr);

    let minAge;
    let maxAge;
    // manipulate array
    if (ageFilterArr.includes("Puppy")) {
      minAge = 0;
      if (ageFilterArr.includes("Adult")) {
        if (ageFilterArr.includes("Senior")) {
          maxAge = 1000;
        } else {
          maxAge = 12;
        }
      } else {
        maxAge = 2;
      }
    } else if (ageFilterArr.includes("Adult")) {
      minAge = 3;
      if (ageFilterArr.includes("Senior")) {
        maxAge = 1000;
      } else {
        maxAge = 12;
      }
    } else if (ageFilterArr.includes("Senior")) {
      minAge = 13;
      maxAge = 1000;
    }

    return [minAge, maxAge];
  };

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
      .filter((prof) => {
        // first get favorite profiles
        return favorites.includes(prof.userID);
      })
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
          return genderFilter.includes(profile.gender);
        }
        return true;
      })
      .filter((profile) => {
        console.log(profile);
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
    if (profile) {
      let compatibilityScore = compatibilityScores.filter(
        (prof) => prof.userId === profile.userID
      )[0]?.score;
      return compatibilityScore;
    }
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
              userProfile={userProfiles.filter(
                (profile) => profile.userID === selectedProfile
              )}
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
                {!userProfiles || !favorites || favorites.length === 0 ? (
                  <div>
                    No favorites yet! Go to the home tab to favorite a profile!
                  </div>
                ) : (
                  filteredProfiles.map((profile, idx) => {
                    let compatibilityScore = getCompatibilityScore(profile);
                    return (
                      <ProfileCard
                        key={idx}
                        profileData={profile}
                        isFavorite={true}
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

export default FavoritesPage;
