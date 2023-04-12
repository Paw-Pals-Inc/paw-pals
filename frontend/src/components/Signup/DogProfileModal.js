import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MaterialButton from "../MaterialComponents/MaterialButton";
import { ButtonGroup } from "@mui/material";

const DogProfileModal = ({
  socket,
  isLoggedIn,
  setIsLoggedIn,
  token,
  setToken,
  userProfile,
  updateUserProfile,
  createdDogProfileStatus,
  createdProfileStatus,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    petName: "",
    petAge: "",
    petGender: "",
    petBreed: "",
    petWeight: "",
    petVaccinated: false,
    petNeutered: false,
  });
  const [errors, setErrors] = useState({
    petName: "",
    petAge: "",
    petGender: "",
    petBreed: "",
    petWeight: "",
    petVaccinated: false,
    petNeutered: false,
  });
  const [maleSelected, setMaleSelected] = useState(false);
  const [femaleSelected, setFemaleSelected] = useState(false);

  const toggleStyle = {
    backgroundColor: "yellow",
  };
  const handleGenderButtonClick = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
    if (event.target.id === "Male") {
      if (maleSelected) {
        setMaleSelected((prev) => false);
        setFormData({
          ...formData,
          [event.target.name]: "",
        });
      } else {
        setMaleSelected((prev) => true);
        setFemaleSelected((prev) => false);
      }
    } else {
      if (femaleSelected) {
        setFemaleSelected((prev) => false);
        setFormData({
          ...formData,
          [event.target.name]: "",
        });
      } else {
        setMaleSelected((prev) => false);
        setFemaleSelected((prev) => true);
      }
    }
  };

  const handleInputChange = (event) => {
    console.log(event.target.name);
    console.log(event.target.value);
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleCheckboxChange = (event) => {
    console.log(event);
    setFormData({
      ...formData,
      [event.target.name]: event.target.checked,
    });
  };

  const goBack = (event) => {
    createdDogProfileStatus(false);
    createdProfileStatus(false);
    localStorage.removeItem("createdProfile");
    navigate("/signup");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Form validation
    let isValid = true;
    const newErrors = {
      petName: "",
      petAge: "",
      petGender: "",
      petBreed: "",
      petWeight: "",
      petVaccinated: false,
      petNeutered: false,
    };

    // petName
    if (formData.petName.trim() === "") {
      newErrors.petName = "Pet name is required";
      isValid = false;
    } else if (!/^[A-Za-z0-9\s]{2,50}$/i.test(formData.petName)) {
      newErrors.petName = "Pet name is invalid";
      isValid = false;
    }

    if (formData.petAge.trim() === "") {
      newErrors.petAge = "Pet Age is required";
      isValid = false;
    } else if (!/^\d+$/.test(formData.petAge)) {
      newErrors.petAge = "Pet Age is invalid";
      isValid = false;
    }

    if (formData.petGender.trim() === "") {
      newErrors.petGender = "Gender is required";
      isValid = false;
    } else if (!/^[A-Za-z]+$/i.test(formData.petGender)) {
      newErrors.petGender = "Gender is invalid";
      isValid = false;
    }

    if (formData.petBreed.trim() === "") {
      newErrors.petBreed = "Breed is required";
      isValid = false;
    } else if (!/^[A-Za-z0-9\s]{2,50}$/i.test(formData.petBreed)) {
      newErrors.petBreed = "Breed is invalid";
      isValid = false;
    }

    if (formData.petWeight.trim() === "") {
      newErrors.petWeight = "Weight is required";
      isValid = false;
    } else if (!/^\d+(\.\d+)?$/.test(formData.petWeight)) {
      newErrors.petWeight = "Weight is invalid";
      isValid = false;
    }

    if (!typeof formData.petVaccinated === "boolean") {
      newErrors.petVaccinated = "Invalid input for pet vaccinated";
      isValid = false;
    }

    if (!typeof formData.petVaccinated === "boolean") {
      newErrors.petNeutered = "Invalid input for pet neutered";
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
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Profile updated successfully
        console.log("Profile updated successfully");
        createdDogProfileStatus(true);
        localStorage.setItem("createdDogProfile", JSON.stringify(true));
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
      <h2>Pet Information</h2>
      <form onSubmit={handleSubmit} className="profileModal-form">
        <div className="form-line">
          <div className="form-line-left">
            <input
              type="text"
              id="petName"
              name="petName"
              value={formData.petName}
              onChange={handleInputChange}
              placeholder="name"
            />
          </div>
          <div className="form-line-right" style={{ gap: "25px" }}>
            <input
              style={{ width: "80px" }}
              type="number"
              id="petAge"
              name="petAge"
              value={formData.petAge}
              onChange={handleInputChange}
              placeholder="age"
            />
            <ButtonGroup
              variant="contained"
              aria-label="outlined primary button group"
              sx={{ boxShadow: "none" }}
            >
              <MaterialButton
                id="Female"
                name="petGender"
                value={"Female"}
                onClick={handleGenderButtonClick}
                styleOverrides={femaleSelected && toggleStyle}
              >
                Female
              </MaterialButton>
              <MaterialButton
                id="Male"
                name="petGender"
                value={"Male"}
                onClick={handleGenderButtonClick}
                styleOverrides={maleSelected && toggleStyle}
                placeholder="Male"
              >
                Male
              </MaterialButton>
            </ButtonGroup>
          </div>
        </div>
        <div className="form-line">
          <div className="form-line-left">
            <input
              type="text"
              id="petBreed"
              name="petBreed"
              value={formData.petBreed}
              onChange={handleInputChange}
              placeholder="breed"
            />
          </div>
          <div className="form-line-right">
            <input
              type="number"
              id="petWeight"
              name="petWeight"
              value={formData.petWeight}
              onChange={handleInputChange}
              placeholder="weight"
            />
            <span style={{ marginLeft: "5px" }}>lbs</span>
          </div>
        </div>
        <div className="form-line">
          <div className="form-line-left">
            <label htmlFor="petVaccinated">Vaccinated?</label>
            <input
              type="checkbox"
              id="petVaccinated"
              name="petVaccinated"
              value={formData.petVaccinated}
              onChange={handleCheckboxChange}
              checked={formData.petVaccinated}
            />
          </div>
          <div className="form-line-right">
            <label htmlFor="petNeutered">Neutered?</label>
            <input
              type="checkbox"
              id="petNeutered"
              name="petNeutered"
              value={formData.petNeutered}
              onChange={handleCheckboxChange}
              checked={formData.petNeutered}
            />
          </div>
        </div>
        {errors.petName && <div>{errors.petName}</div>}
        {errors.petAge && <div>{errors.petAge}</div>}
        {errors.petGender && <div>{errors.petGender}</div>}
        {errors.petBreed && <div>{errors.petBreed}</div>}
        {errors.petWeight && <div>{errors.petWeight}</div>}
        {errors.petVaccinated && <div>{errors.petVaccinated}</div>}
        {errors.petNeutered && <div>{errors.petNeutered}</div>}
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

export default DogProfileModal;
