import React, { useState, useEffect } from "react";
import TagSelectButton from "../Signup/TagSelectButton";
import { saveUserProfileLocalStorage } from "../../utils/functions";
import { petTags } from "../../utils/constants";

function AttributeSection({ data }) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    petTags: data.petTags || [],
  });
  const [selectedTagIds, setSelectedTagIds] = useState([]);

  useEffect(() => {
    // set selected tag ids from pet tags loaded
    let selectedIds = [];
    if (formData.petTags) {
      selectedIds = formData.petTags.map((tag) => petTags.indexOf(tag));
      setSelectedTagIds(selectedIds);
    }
  }, []);

  const toggleEditMode = (e) => {
    if (e) e.preventDefault();
    setEditMode((prev) => !prev);
  };

  const handleTagChange = (id, isSelected) => {
    if (isSelected) {
      // make sure not a duplicate
      if (!selectedTagIds.includes(id)) {
        setSelectedTagIds([...selectedTagIds, id]);
      }
    } else {
      setSelectedTagIds(selectedTagIds.filter((tag) => tag !== id));
    }
  };

  const updateFormData = (newData) => {
    setFormData((prev) => ({ petTags: [...newData] }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // filter tags by index
    let selectedTags = selectedTagIds.map((index) => petTags[index]);
    if (selectedTags.length > 10) {
      throw new Error("selected tags array not valid");
    }

    try {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      const token = localStorage.getItem("token");

      // edit profile data
      await fetch(`http://localhost:4000/users/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ petTags: selectedTags }),
      }).then(async (resp) => {
        if (resp.ok) {
          // User created successfully
          console.log("User updated successfully");
          const data = await resp.json();
          let prevProfile = JSON.parse(localStorage.getItem("userProfile"));
          let newData = { ...prevProfile, ...data };

          saveUserProfileLocalStorage(newData);
          updateFormData(newData.petTags);
          toggleEditMode();
        } else {
          console.error("Error creating user:", resp.statusText);
          // render error message on screen
          return;
        }
      });
    } catch (error) {
      console.error("Error creating user:", error);
      alert(error);
    }
  };

  return (
    <div className="personalProfileSection">
      {/* text boxes filled with user profile data */}
      {/* implement edit user data functionalilty*/}
      <form onSubmit={handleSubmit} className="profileAttributes-form">
        <div>
          <h2 className="section-header">
            Attributes
            {editMode ? (
              <button type="submit">Save</button>
            ) : (
              <button type="button" onClick={toggleEditMode}>
                Add More
              </button>
            )}
          </h2>
        </div>
        <div className="tags">
          {editMode
            ? petTags.map((tag, idx) => (
                <TagSelectButton
                  key={idx}
                  selectedTagIds={selectedTagIds}
                  updateTags={handleTagChange}
                  id={idx}
                  tagName={tag}
                  styleOverrides={{ width: "auto" }}
                />
              ))
            : typeof formData.petTags === "object" &&
              formData.petTags.length > 0
            ? petTags.map(
                (tag, idx) =>
                  formData.petTags.includes(tag) && (
                    <TagSelectButton
                      key={idx}
                      selectedTagIds={selectedTagIds}
                      id={idx}
                      tagName={tag}
                      styleOverrides={{
                        backgroundColor: "#FFD29D",
                        width: "auto",
                      }}
                      clickAction={() => console.log("do nothing :)")}
                    />
                  )
              )
            : "Add some tags describing your pet!"}
        </div>
      </form>
    </div>
  );
}

export default AttributeSection;
