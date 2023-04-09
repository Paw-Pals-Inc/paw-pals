import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import LandingPage from "./components/Landing/LandingPage";
import HomePage from "./components/Home/HomePage";
import SignupPage from "./components/Signup/SignupPage";
import ProfilePage from "./components/Profile/ProfilePage";
import ChatPage from "./components/Chats/ChatPage";
import FavoritesPage from "./components/Favorites/FavoritesPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("user") !== null &&
      localStorage.getItem("user") !== "undefined"
  );
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [userProfile, setUserProfile] = useState(
    JSON.parse(localStorage.getItem("userProfile"))
  );
  const [userProfiles, setUserProfiles] = useState(
    JSON.parse(localStorage.getItem("userProfiles"))
  );
  const [favoriteProfiles, setFavoriteProfiles] = useState([]);
  const [compatibilityScores, setCompatibilityScores] = useState([]);

  useEffect(() => {
    // Check if user is logged in
    const checkLoginStatus = async () => {
      const jwt = localStorage.getItem("token");
      try {
        await fetch("http://localhost:4000/login/checkTokenValidity", {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }).then((resp) => {
          if (!resp.ok) {
            setIsLoggedIn(false);
            return resp.status;
          } else {
            resp.json().then((data) => {
              setIsLoggedIn(data.isValid);
            });
          }
        });
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  useEffect(() => {
    if (userProfile && userProfiles) {
      const scores = userProfiles.map((otherUser) =>
        calculateCompatibility(
          userProfile.petTags,
          otherUser.petTags,
          otherUser.userID
        )
      );
      console.log("compatibility scores: ", scores);
      setCompatibilityScores(scores);
    }
  }, [userProfile, userProfiles]);

  const updateFavoritesDB = async (newData) => {
    if (localStorage.getItem("user") !== null) {
      let userAccount = JSON.parse(localStorage.getItem("user"));
      const jwt = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/favorites/${userAccount.id}`,
        {
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          method: "PUT",
          body: JSON.stringify({ favorites: newData }),
        }
      );

      if (response.ok) {
        let favResp = await response.json();
        let newFavorites = favResp.favorites;
        let newFavoritesArr = JSON.parse(newFavorites);

        // update state with this
        setFavoriteProfiles((prev) => newFavoritesArr);
        localStorage.setItem("favoriteProfiles", newFavorites);
      } else {
        let error = await response.json();
        console.log("error: ", error.message);
      }
    }
  };

  const calculateCompatibility = (userTags, otherUserTags, otherUserId) => {
    console.log("user tags: ", userTags);
    console.log("other user tags: ", otherUserTags);
    let compatibilityScore;
    if (userTags && otherUserTags) {
      const [userTagsArr, otherUserTagsArr] = [userTags, otherUserTags];
      const matchingTags = userTagsArr.filter((tag) =>
        otherUserTagsArr.includes(tag)
      );
      compatibilityScore = matchingTags.length;
    } else {
      compatibilityScore = 0;
    }
    return { userId: otherUserId, score: compatibilityScore };
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setUserData(JSON.parse(localStorage.getItem("user")));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userProfile");
    localStorage.removeItem("userProfiles");
    localStorage.removeItem("favoriteProfiles");
    localStorage.removeItem("createdDogPersonality");
    localStorage.removeItem("createdDogProfile");
    localStorage.removeItem("createdProfile");
    localStorage.removeItem("password");
  };
  const updateToken = (newToken) => {
    setToken((prev) => newToken);
    localStorage.setItem("token", newToken);
  };
  const updateUserData = (newData) => {
    setUserData((prev) => ({ ...prev, ...newData }));
    localStorage.setItem("user", JSON.stringify(newData));
  };
  const updateUserProfile = (newData) => {
    setUserProfile((prev) => ({ ...prev, ...newData }));
    localStorage.setItem("userProfile", JSON.stringify(newData));
  };
  const updateUserProfiles = (newData) => {
    setUserProfiles((prev) => newData);
    localStorage.setItem("userProfiles", JSON.stringify(newData));
  };
  const updateFavoriteProfiles = (newData) => {
    updateFavoritesDB([...newData]);
  };
  const addFavorite = (userID) => {
    let favorites = favoriteProfiles || []; // array
    favorites.push(userID);
    updateFavoriteProfiles(favorites);
  };
  const removeFavorite = (userID) => {
    let favorites = favoriteProfiles || []; // array
    let newFavorites = favorites.filter((ids) => ids !== userID); // array
    updateFavoriteProfiles(newFavorites);
  };

  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/"
          element={
            !isLoggedIn ? (
              <LandingPage
                isLoggedIn={isLoggedIn}
                onLogin={handleLogin}
                updateUserData={updateUserData}
                updateUserProfile={updateUserProfile}
                updateToken={updateToken}
              />
            ) : (
              <Navigate replace to={"/home"} />
            )
          }
        ></Route>
        <Route
          exact
          path="/signup"
          element={
            <SignupPage
              updateUserProfile={updateUserProfile}
              userProfile={userProfile}
              onLogin={handleLogin}
              onLogout={handleLogout}
              isLoggedIn={isLoggedIn}
              userData={userData}
              updateToken={updateToken}
            />
          }
        ></Route>
        <Route
          exact
          path="/home"
          element={
            isLoggedIn ? (
              <HomePage
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
                userProfile={userProfile}
                userProfiles={userProfiles}
                updateUserProfile={updateUserProfile}
                updateUserProfiles={updateUserProfiles}
                favoriteProfiles={favoriteProfiles}
                updateFavoriteProfiles={updateFavoriteProfiles}
                addFavorite={addFavorite}
                removeFavorite={removeFavorite}
                compatibilityScores={compatibilityScores}
              />
            ) : (
              <Navigate replace to={"/"} />
            )
          }
        />
        <Route
          exact
          path="/chats"
          element={
            isLoggedIn ? (
              <ChatPage
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
                userProfile={userProfile}
                updateUserProfile={updateUserProfile}
                userProfiles={userProfiles}
              />
            ) : (
              <Navigate replace to={"/"} />
            )
          }
        ></Route>
        <Route
          exact
          path="/favorites"
          element={
            isLoggedIn ? (
              <FavoritesPage
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
                userProfile={userProfile}
                favoriteProfiles={favoriteProfiles}
                userProfiles={userProfiles}
                addFavorite={addFavorite}
                removeFavorite={removeFavorite}
                compatibilityScores={compatibilityScores}
              />
            ) : (
              <Navigate replace to={"/"} />
            )
          }
        ></Route>
        <Route
          exact
          path="/profile"
          element={
            isLoggedIn ? (
              <ProfilePage
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
                updateUserProfile={updateUserProfile}
                userProfile={userProfile}
                userData={userData}
              />
            ) : (
              <Navigate replace to={"/"} />
            )
          }
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
