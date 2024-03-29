import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import SideNavbar from "../Home/SideNavbar";
import ChatRoom from "./ChatRoom";
import PageHeader from "../Home/PageHeader";
import UsersList from "./UsersList";
import OtherProfilePage from "../Profile/OtherProfilePage";
import LoadingProgress from "../Loading/LoadingProgress";
import { getCompatibilityScore } from "../../utils/functions";
import {
  getUserProfile,
  getOtherUserProfiles,
  getFavoriteProfiles,
} from "../../utils/fetchRequests";
import "./chat.css";
import { motion } from "framer-motion";

const uriBase =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://pawpals-383903.ue.r.appspot.com";

const ChatsPage = ({
  isLoggedIn,
  onLogout,
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
  const location = useLocation();
  const [socket, setSocket] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); // used to go to that user's chat room
  const [profileSelected, setProfileSelected] = useState(false); // used to render a specific profile page or homepage stuff
  const [selectedProfile, setSelectedProfile] = useState(null); // used to go to that user's profile page
  const [isLoading, setIsLoading] = useState(false);

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
    // Connect to socket.io server
    const newSocket = io(uriBase);
    setSocket(newSocket);

    //sends the user ID and socket ID to the Node.js server
    newSocket.on("connect", () => {
      console.log("socket: ", newSocket);
      console.log("socket id: ", newSocket.id);
      newSocket.emit("newUser", {
        userId: userProfile.userID,
        socketId: newSocket.id,
      });
    });

    return () => {
      // Disconnect from socket.io server when component unmounts
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    // if i came to the chat page with other data
    const { state } = location || {};
    if (state) {
      setSelectedUser(state.selectedUser);
    }
  }, []);

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

  const handleUserSelect = async (user) => {
    setSelectedUser(user);
  };

  const enterProfile = (profileID) => {
    setProfileSelected((prev) => true);
    setSelectedProfile((prev) => profileID);
  };

  const leaveProfile = () => {
    setProfileSelected((prev) => false);
    setSelectedProfile((prev) => null);
  };

  return isLoading ? (
    <LoadingProgress />
  ) : (
    <div className="homepage">
      <div className="content">
        <div className="sideNav">
          <SideNavbar
            onLogout={onLogout}
            isLoggedIn={isLoggedIn}
            userProfile={userProfile}
          />
        </div>
        <motion.div
          className="contentRight"
          key="chatsPage"
          initial={{ y: 600 }}
          animate={{ y: 0 }}
          exit={{ y: -600 }}
          transition={{ duration: 0.5 }}
        >
          <PageHeader pageName={location.pathname} profile={userProfile} />
          {profileSelected ? (
            <OtherProfilePage
              myProfile={userProfile}
              buttonVariant={buttonVariant}
              userProfile={
                userProfiles.filter(
                  (profile) => profile.userID === selectedProfile
                )[0]
              }
              compatibilityScore={() =>
                getCompatibilityScore(
                  userProfiles.filter(
                    (profile) => profile.userID === selectedProfile
                  )[0],
                  compatibilityScores
                )
              }
              isFavorite={favoriteProfiles.includes(selectedProfile.userID)}
              addFavorite={addFavorite}
              removeFavorite={removeFavorite}
              favoriteProfiles={favoriteProfiles}
              leaveProfile={leaveProfile}
            />
          ) : (
            <div className="chatWindow">
              <UsersList
                socket={socket}
                userProfile={userProfile}
                userProfiles={userProfiles}
                handleUserSelect={handleUserSelect}
              />
              <ChatRoom
                socket={socket}
                currentUser={userProfile}
                profiles={userProfiles}
                selectedUser={selectedUser}
                enterProfile={enterProfile}
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ChatsPage;
