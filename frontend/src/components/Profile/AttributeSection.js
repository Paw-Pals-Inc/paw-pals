import React, { useState } from "react";
import EditIcon from "@mui/icons-material/EditOutlined";
import MaterialButton from "../MaterialComponents/MaterialButton";
import { saveUserProfileLocalStorage } from "../../utils/functions";

function AttributeSection({ data }) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    petTags: JSON.parse(localStorage.getItem("userProfile")).petTags || [],
  });

  const toggleEditMode = (e) => {
    if (e) e.preventDefault();
    setEditMode((prev) => !prev);
  };

  const updateFormData = (newData) => {
    setFormData((prev) => ({ petTags: [...newData] }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(event);
    console.log("submitting");

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
        body: JSON.stringify(formData),
      }).then(async (resp) => {
        if (resp.ok) {
          // User created successfully
          console.log("User updated successfully");
          const data = await resp.json();
          let prevProfile = JSON.parse(localStorage.getItem("userProfile"));
          let newData = { ...prevProfile, ...data };
          console.log("new data: ", newData);

          saveUserProfileLocalStorage(newData);
          // localStorage.setItem("userProfile", JSON.stringify(newData));
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
      <form onSubmit={handleSubmit} className="profileDescription-form">
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
          {typeof formData.petTags === "object" && formData.petTags.length > 0
            ? formData.petTags.map((tag, idx) => (
                <MaterialButton
                  key={idx}
                  styleOverrides={{ backgroundColor: "#FFD29D" }}
                >
                  {tag}
                </MaterialButton>
              ))
            : "Add some tags describing your pet!"}
        </div>
      </form>
    </div>
  );
}

export default AttributeSection;
