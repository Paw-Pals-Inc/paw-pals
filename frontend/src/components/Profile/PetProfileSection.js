import React, { useState } from "react";
import EditIcon from "@mui/icons-material/EditOutlined";

function PetProfileSection() {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    petName: JSON.parse(localStorage.getItem("userProfile")).petName,
    petAge: JSON.parse(localStorage.getItem("userProfile")).petAge,
    petGender: JSON.parse(localStorage.getItem("userProfile")).petGender,
    petVaccinated: JSON.parse(localStorage.getItem("userProfile"))
      .petVaccinated,
    petWeight: JSON.parse(localStorage.getItem("userProfile")).petWeight,
    petBreed: JSON.parse(localStorage.getItem("userProfile")).petBreed,
    petNeutered: JSON.parse(localStorage.getItem("userProfile")).petNeutered,
  });

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

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
          localStorage.setItem("userProfile", JSON.stringify(data));
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
      <form onSubmit={handleSubmit}>
        <div>
          <h2 className="section-header">
            Pet Information
            {editMode ? (
              <button type="submit">Save</button>
            ) : (
              <EditIcon onClick={toggleEditMode} />
            )}
          </h2>
        </div>
        <div className="profile-form">
          <div className="field-line">
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
          <div className="field-line">
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
          <div className="field-line">
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
          <div className="field-line">
            <label>Sex:</label>
            {editMode ? (
              <input
                type="text"
                name="petGender"
                id="petGender"
                value={formData.petGender}
                onChange={handleInputChange}
              />
            ) : (
              <span>{formData.petGender}</span>
            )}
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
            <label htmlFor="petVaccinated">Vaccinated:</label>
            {editMode ? (
              <input
                type="text"
                name="petVaccinated"
                id="petVaccinated"
                value={formData.petVaccinated}
                onChange={handleInputChange}
              />
            ) : (
              <span>{formData.petVaccinated ? "Yes" : "No"}</span>
            )}
          </div>
          <div className="field-line">
            <label htmlFor="petNeutered">Neutered:</label>
            {editMode ? (
              <input
                type="text"
                name="petNeutered"
                id="petNeutered"
                value={formData.petNeutered}
                onChange={handleInputChange}
              />
            ) : (
              <span>{formData.petNeutered ? "Yes" : "No"}</span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default PetProfileSection;
