import React, { useState } from "react";
import EditIcon from "@mui/icons-material/EditOutlined";
import { saveUserProfileLocalStorage } from "../../utils/functions";

function PersonalProfileSection() {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: JSON.parse(localStorage.getItem("userProfile")).firstName,
    lastName: JSON.parse(localStorage.getItem("userProfile")).lastName,
    phoneNumber: JSON.parse(localStorage.getItem("userProfile")).phoneNumber,
    city: JSON.parse(localStorage.getItem("userProfile")).city,
    state: JSON.parse(localStorage.getItem("userProfile")).state,
  });

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      const token = localStorage.getItem("token");
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
      <form onSubmit={handleSubmit}>
        <div>
          <h2 className="section-header">
            Personal Information
            {editMode ? (
              <button type="submit">Save</button>
            ) : (
              <EditIcon onClick={toggleEditMode} />
            )}
          </h2>
        </div>
        <div className="profile-form">
          <div className="field-line">
            <label>First Name:</label>
            {editMode ? (
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            ) : (
              <span>{formData.firstName}</span>
            )}
          </div>
          <div className="field-line">
            <label>Last Name:</label>
            {editMode ? (
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            ) : (
              <span>{formData.lastName}</span>
            )}
          </div>
          <div className="field-line">
            <label>City:</label>
            {editMode ? (
              <input
                type="text"
                name="city"
                id="city"
                value={formData.city}
                onChange={handleInputChange}
              />
            ) : (
              <span>{formData.city}</span>
            )}
          </div>
          <div className="field-line">
            <label>State:</label>
            {editMode ? (
              <input
                type="text"
                name="state"
                id="state"
                value={formData.state}
                onChange={handleInputChange}
              />
            ) : (
              <span>{formData.state}</span>
            )}
          </div>
          <div className="field-line">
            <label htmlFor="phoneNumber">Phone Number:</label>
            {editMode ? (
              <input
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
            ) : (
              <span>{formData.phoneNumber}</span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default PersonalProfileSection;
