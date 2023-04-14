import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/EditOutlined";
import MaterialButton from "../MaterialComponents/MaterialButton";
import { ButtonGroup } from "@mui/material";
import {
  saveUserProfileLocalStorage,
  validFileType,
} from "../../utils/functions";

function PetProfileSection({ data, updateUserProfile }) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    petName: data.petName,
    petAge: data.petAge,
    petGender: data.petGender,
    petVaccinated: data.petVaccinated,
    petNeutered: data.petNeutered,
    petWeight: data.petWeight,
    petBreed: data.petBreed,
    petGallery: data.petGallery,
  });
  const [errors, setErrors] = useState({
    petName: "",
    petAge: "",
    petGender: "",
    petBreed: "",
    petWeight: "",
    petVaccinated: false,
    petNeutered: false,
    petGallery: "",
  });

  const [maleSelected, setMaleSelected] = useState(false);
  const [femaleSelected, setFemaleSelected] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({ ...formData, petGallery: data.petGallery }));
  }, [data.petGallery]);

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

  const handlePetProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!validFileType(file)) {
      setErrors({
        ...errors,
        petGallery: `${file.name} not a valid file type. Update your selection.`,
      });
      return;
    }
    setErrors({ ...errors, petGallery: "" });

    const reader = new FileReader();

    // replaces old pet profile pic and pushes it into the gallery
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...formData,
        petGallery: [reader.result, ...formData.petGallery],
      }));
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      // nop
    }
  };
  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };
  const handleCheckboxChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.checked,
    });
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
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
      petGallery: "",
    };

    // petName
    if (formData.petName.trim() === "") {
      newErrors.petName = "Pet name is required";
      isValid = false;
    } else if (!/^[A-Za-z0-9\s]{2,50}$/i.test(formData.petName)) {
      newErrors.petName = "Pet name is invalid";
      isValid = false;
    }

    if (!typeof formData.petAge === "number") {
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

    if (!typeof formData.petWeight === "number") {
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

    if (formData.petGallery.length < 1) {
      newErrors.petGallery = "Pet profile picture is required";
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    try {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      await fetch(`http://localhost:4000/users/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }).then(async (resp) => {
        if (resp.ok) {
          // User created successfully
          console.log("User updated successfully");
          const data = await resp.json();
          saveUserProfileLocalStorage(data);
          updateUserProfile(data);
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
      <form className="personalProfile-form" onSubmit={handleSubmit}>
        <div>
          <h2 className="section-header">
            Pet Information
            {editMode ? (
              <button type="submit">Save</button>
            ) : (
              <EditIcon onClick={toggleEditMode} sx={{ cursor: "pointer" }} />
            )}
          </h2>
        </div>
        <div>
          <div className="field-line">
            <div className="field-line-left">
              <label>Name:</label>
              {editMode ? (
                <input
                  type="text"
                  name="petName"
                  id="petName"
                  value={formData.petName}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{formData.petName}</span>
              )}
            </div>
            <div className="field-line-right">
              <label>Sex:</label>
              {editMode ? (
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
                    size="small"
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
                    size="small"
                  >
                    Male
                  </MaterialButton>
                </ButtonGroup>
              ) : (
                <span>{formData.petGender}</span>
              )}
            </div>
          </div>
          <div className="field-line">
            <div className="field-line-left">
              <label>Breed:</label>
              {editMode ? (
                <input
                  type="text"
                  name="petBreed"
                  id="petBreed"
                  value={formData.petBreed}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{formData.petBreed}</span>
              )}
            </div>
            <div className="field-line-right">
              <label>Age:</label>
              {editMode ? (
                <input
                  type="number"
                  name="petAge"
                  id="petAge"
                  value={formData.petAge}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{formData.petAge} yrs</span>
              )}
            </div>
          </div>
          <div className="field-line">
            <label htmlFor="petWeight">Weight:</label>
            {editMode ? (
              <input
                type="number"
                name="petWeight"
                id="petWeight"
                value={formData.petWeight}
                onChange={handleInputChange}
              />
            ) : (
              <span>{formData.petWeight} lbs</span>
            )}
          </div>
          <div className="field-line">
            <div className="field-line-left">
              <label htmlFor="petVaccinated">Vaccinated:</label>
              {editMode ? (
                <input
                  type="checkbox"
                  id="petVaccinated"
                  name="petVaccinated"
                  value={formData.petVaccinated}
                  onChange={handleCheckboxChange}
                  checked={formData.petVaccinated}
                />
              ) : (
                <span>{formData.petVaccinated ? "Yes" : "No"}</span>
              )}
            </div>
            <div className="field-line-right">
              <label htmlFor="petNeutered">Neutered:</label>
              {editMode ? (
                <input
                  type="checkbox"
                  id="petNeutered"
                  name="petNeutered"
                  value={formData.petNeutered}
                  onChange={handleCheckboxChange}
                  checked={formData.petNeutered}
                />
              ) : (
                <span>{formData.petNeutered ? "Yes" : "No"}</span>
              )}
            </div>
          </div>
          {errors.petName && <div>{errors.petName}</div>}
          {errors.petAge && <div>{errors.petAge}</div>}
          {errors.petGender && <div>{errors.petGender}</div>}
          {errors.petBreed && <div>{errors.petBreed}</div>}
          {errors.petWeight && <div>{errors.petWeight}</div>}
          {errors.petVaccinated && <div>{errors.petVaccinated}</div>}
          {errors.petNeutered && <div>{errors.petNeutered}</div>}
        </div>
      </form>
      <div className="profilePictureSection">
        <img src={formData.petGallery[0]} alt="pet profile pic" />
        {editMode && (
          <div>
            <label htmlFor="petProfilePic" className="uploadPic-button">
              change picture
            </label>
            <input
              type="file"
              id="petProfilePic"
              name="petProfilePic"
              onChange={handlePetProfilePicChange}
              style={{ opacity: 0 }}
              hidden
              accept="image/*"
            />
          </div>
        )}
        {errors.petGallery && <div>{errors.petGallery}</div>}
      </div>
    </div>
  );
}

export default PetProfileSection;
