import React, { useState } from "react";

function GallerySection({ data }) {
  const { petName, firstName } = data;
  const [formData, setFormData] = useState({
    description: JSON.parse(localStorage.getItem("userProfile")).description,
    petDescription: JSON.parse(localStorage.getItem("userProfile"))
      .petDescription,
  });

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
      const currentProfileData = JSON.parse(
        localStorage.getItem("userProfile")
      );
      // edit profile data
      const newProfileData = { ...currentProfileData, ...formData };
      await fetch(`http://localhost:4000/users/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProfileData),
      }).then(async (resp) => {
        if (resp.ok) {
          // User created successfully
          console.log("User updated successfully");
          const data = await resp.json();
          let prevProfile = JSON.parse(localStorage.getItem("userProfile"));
          let newData = { ...prevProfile, ...data };
          console.log("new data: ", newData);
          localStorage.setItem("userProfile", JSON.stringify(newData));
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
          <h2 className="section-header">Gallery</h2>
        </div>
      </form>
    </div>
  );
}

export default GallerySection;
