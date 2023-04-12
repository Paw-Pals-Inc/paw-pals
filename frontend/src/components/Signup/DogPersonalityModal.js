import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MaterialButton from "../MaterialComponents/MaterialButton";
import TagSelectButton from "./TagSelectButton";

const DogPersonalityModal = ({
  userProfile,
  updateUserProfile,
  createdDogProfileStatus,
  createdDogPersonalityStatus,
}) => {
  const navigate = useNavigate();
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const petTags = [
    "Likes to run",
    "Share toys",
    "Non-reactive",
    "High energy",
    "Friendly",
    "Likes to roughhouse",
    "Shy",
    "Friendly towards strangers",
    "Frequent barker",
    "Plays catch",
  ];
  const tagGroups = [];

  for (let index = 0; index < petTags.length; index += 3) {
    tagGroups.push(petTags.slice(index, index + 3));
  }

  const handleTagChange = (id, isSelected) => {
    if (isSelected) {
      setSelectedTagIds([...selectedTagIds, id]);
    } else {
      setSelectedTagIds(selectedTagIds.filter((tag) => tag !== id));
    }
  };

  const goBack = (event) => {
    createdDogPersonalityStatus(false);
    createdDogProfileStatus(false);
    localStorage.removeItem("createdDogProfile");
    navigate("/signup");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const userId = userProfile.userID;
      // filter tags by index
      let selectedTags = selectedTagIds.map((index) => petTags[index]);
      if (selectedTags.length > 10) {
        throw new Error("selected tags array not valid");
      }
      console.log("selected tags: ", selectedTags);
      console.log("selected tag IDs: ", selectedTagIds);

      console.log("user ID: " + userId);
      const response = await fetch("http://localhost:4000/users/" + userId, {
        method: "PUT",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ petTags: selectedTags }),
      });

      if (response.ok) {
        // Profile updated successfully
        console.log("Profile updated successfully");
        createdDogPersonalityStatus(true);
        localStorage.setItem("createdDogPersonality", JSON.stringify(true));
        response.json().then((data) => updateUserProfile({ ...data }));
      } else {
        console.error("Error updating user profile:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  return (
    <div className="signup-modal petPersonality-modal">
      <h2>Select all that applies to your pet</h2>
      <form onSubmit={handleSubmit} className="petPersonality-form">
        <div className="tags-container">
          {tagGroups.map((group, index) => (
            <div className="tag-group" key={index}>
              {group.map((tag, key) => (
                <TagSelectButton
                  key={key + index * 3}
                  selectedTagIds={selectedTagIds}
                  updateTags={handleTagChange}
                  id={key + index * 3}
                  tagName={tag}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="form-line">
          <div className="form-line-left">
            <MaterialButton
              onClick={goBack}
              styleOverrides={{ fontSize: ".8em" }}
            >
              Back
            </MaterialButton>
          </div>
          <div className="form-line-right">
            <MaterialButton type="submit" styleOverrides={{ fontSize: ".8em" }}>
              Next
            </MaterialButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DogPersonalityModal;
