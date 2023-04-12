import React, { useState } from "react";
import { saveUserProfileLocalStorage } from "../../utils/functions";
import EditIcon from "@mui/icons-material/EditOutlined";

function GallerySection({ data, petGallery }) {
  const { petName, firstName } = data;
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    petGallery: petGallery.petGallery,
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
      // Form validation
      let isValid = true;

      if (petGallery.length < 1) {
        isValid = false;
      } else {
        petGallery.forEach((imageStr) => {
          if (imageStr.match(/^blob/)) isValid = false;
        });
      }

      if (!isValid) {
        console.log("gallery pics not valid");
        return;
      }

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
            Gallery
            {editMode && <button type="submit">Save</button>}
          </h2>
          <div>
            {petGallery &&
              petGallery.map((pic, idx) => (
                <div key={idx}>
                  <img src={pic} alt={`doggie${idx}`} />
                </div>
              ))}
            <button type="button" onClick={toggleEditMode}>
              Add More Pics
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default GallerySection;
