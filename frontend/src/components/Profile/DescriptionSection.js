import React, { useState } from "react";
import EditIcon from "@mui/icons-material/EditOutlined";
import { saveUserProfileLocalStorage } from "../../utils/functions";

function DescriptionSection({ data }) {
  const { petName, firstName } = data;
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    petDescription: "",
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
            Descriptions
            {editMode ? (
              <button type="submit">Save</button>
            ) : (
              <EditIcon onClick={toggleEditMode} />
            )}
          </h2>
        </div>
        <div>
          <h3 style={{ fontWeight: "900" }}>{firstName}</h3>
          {editMode ? (
            <textarea
              type="text"
              name="description"
              id="description"
              className="descriptionArea"
              value={formData.description}
              onChange={handleInputChange}
              style={{ width: "60%" }}
              rows={4}
            ></textarea>
          ) : (
            <p
              className={
                formData.description === ""
                  ? "desc-placeholder"
                  : "desc-paragraph"
              }
            >
              {formData.description === ""
                ? "Add bio here!"
                : formData.description}
            </p>
          )}
        </div>
        <div>
          <h3 style={{ fontWeight: "900" }}>{petName}</h3>
          {editMode ? (
            <textarea
              type="text"
              name="petDescription"
              id="petDescription"
              className="descriptionArea"
              value={formData.petDescription}
              onChange={handleInputChange}
              style={{ width: "60%" }}
              rows={4}
            ></textarea>
          ) : (
            <p
              className={
                formData.petDescription === ""
                  ? "desc-placeholder"
                  : "desc-paragraph"
              }
            >
              {formData.petDescription === ""
                ? "Talk about your pet here!"
                : formData.petDescription}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default DescriptionSection;
