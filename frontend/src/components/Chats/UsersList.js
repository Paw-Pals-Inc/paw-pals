import React, { useState, useEffect } from "react";
import { Avatar, Badge } from "@mui/material";
import { styled } from "@mui/material/styles";

const UsersList = ({ socket, userProfile, userProfiles, handleUserSelect }) => {
  const [activeUsers, setActiveUsers] = useState([]);
  useEffect(() => {
    if (!socket) return;
    socket.on("newUserResponse", (data) => setActiveUsers(data));
    console.log("active users: ", activeUsers);
  }, [socket, activeUsers]);

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: "#44b700",
      color: "#44b700",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0,
      },
    },
  }));

  const isUserActive = (userProfile, activeUsersArray) => {
    return activeUsersArray.some(
      (activeUserProfile) => activeUserProfile.userId === userProfile.userID
    );
  };

  return (
    <div className="usersList">
      {userProfile &&
        userProfiles &&
        userProfiles.map((user, index) => (
          <div className="chatUser" key={index}>
            {isUserActive(user, activeUsers) ? (
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar
                  key={user.userID}
                  onClick={() => handleUserSelect(user)}
                  src={user.profilePic}
                  sx={{ width: 60, height: 60 }}
                  // variant="rounded"
                >
                  {user.firstName[0]}
                </Avatar>
              </StyledBadge>
            ) : (
              <Avatar
                key={user.userID}
                onClick={() => handleUserSelect(user)}
                src={user.profilePic}
                sx={{ width: 60, height: 60 }}
                // variant="rounded"
              >
                {user.firstName[0]}
              </Avatar>
            )}

            <span>{user.firstName}</span>
          </div>
        ))}
    </div>
  );
};

export default UsersList;
