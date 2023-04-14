export const getUserProfile = async (currentUserID) => {
  const jwt = localStorage.getItem("token");
  const response = await fetch(`http://localhost:4000/users/${currentUserID}`, {
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });
  return response.json();
};

export const getOtherUserProfiles = async (currentUserID) => {
  const jwt = localStorage.getItem("token");
  const response = await fetch(`http://localhost:4000/users/`, {
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });

  return response.json().then((data) => {
    return data.filter((profile) => profile.userID !== currentUserID);
  });
};

export const getFavoriteProfiles = async (currentUserID) => {
  const jwt = localStorage.getItem("token");
  const response = await fetch(
    `http://localhost:4000/favorites/${currentUserID}`,
    {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    }
  );

  return response.json().then((data) => data.favorites);
};
