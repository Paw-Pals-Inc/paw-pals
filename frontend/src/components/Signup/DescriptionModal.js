import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MaterialButton from "../MaterialComponents/MaterialButton";

const DescriptionModal = ({
  userProfile,
  updateUserProfile,
  createdDescriptonStatus,
  createdDogPersonalityStatus,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: "",
    petDescription: "",
  });
  const [errors, setErrors] = useState({
    description: "",
    petDescription: "",
  });

  const handleInputChange = (event) => {
    console.log(event);
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const goBack = (event) => {
    createdDescriptonStatus(false);
    createdDogPersonalityStatus(false);
    localStorage.removeItem("createdDescription");
    navigate("/signup");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Form validation
    let isValid = true;
    const newErrors = {
      description: "",
      petDescription: "",
    };

    // petName
    if (formData.description.trim() === "") {
      newErrors.description = "Description is required";
      isValid = false;
    }
    if (formData.petDescription.trim() === "") {
      newErrors.petDescription = "Pet Description is required";
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    try {
      const userId = userProfile.userID;
      console.log("user ID: " + userId);
      console.log(formData);
      const response = await fetch("http://localhost:4000/users/" + userId, {
        method: "PUT",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ...userProfile, ...formData }),
      });

      if (response.ok) {
        // Profile updated successfully
        console.log("Profile updated successfully");
        createdDescriptonStatus(true);
        localStorage.setItem("createdDescription", JSON.stringify(true));
        response.json().then((data) => updateUserProfile({ ...data }));
      } else {
        console.error("Error updating user profile:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  return (
    <div className="signup-modal">
      <h2>Quick description about yourself and your pet</h2>
      <form onSubmit={handleSubmit} className="descriptionModal-form">
        <div className="form-line">
          <textarea
            id="description"
            name="description"
            className="descriptionArea"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            placeholder={"Your description"}
            style={{ width: "100%" }}
          />
        </div>
        <div className="form-line">
          <textarea
            id="petDescription"
            name="petDescription"
            className="descriptionArea"
            value={formData.petDescription}
            onChange={handleInputChange}
            rows={4}
            placeholder={"Pet description"}
            style={{ width: "100%" }}
          />
        </div>
        {errors.description && <div>{errors.description}</div>}
        {errors.petDescription && <div>{errors.petDescription}</div>}
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

export default DescriptionModal;
