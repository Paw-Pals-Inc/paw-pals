import React, { useState } from "react";
import MaterialButton from "../MaterialComponents/MaterialButton";

const ProfileModal = ({
  socket,
  isLoggedIn,
  setIsLoggedIn,
  token,
  setToken,
  userProfile,
  updateUserProfile,
  createdProfileStatus,
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    city: "",
    state: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    city: "",
    state: "",
    phoneNumber: "",
  });

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Form validation
    let isValid = true;
    const newErrors = {
      firstName: "",
      lastName: "",
      city: "",
      state: "",
      phoneNumber: "",
    };

    // firstName
    if (formData.firstName.trim() === "") {
      newErrors.firstName = "First name is required";
      isValid = false;
    } else if (!/^[A-Za-z- ]{2,}$/i.test(formData.firstName)) {
      newErrors.firstName = "First name is invalid";
      isValid = false;
    }
    // lastName
    if (formData.lastName.trim() === "") {
      newErrors.lastName = "Last name is required";
      isValid = false;
    } else if (!/^[A-Za-z- ]{2,}$/i.test(formData.lastName)) {
      newErrors.lastName = "Last name is invalid";
      isValid = false;
    }
    // city
    if (formData.city.trim() === "") {
      newErrors.city = "City is required";
      isValid = false;
    } else if (!/^[A-Za-z- ]{2,}$/i.test(formData.city)) {
      newErrors.city = "City is invalid";
      isValid = false;
    }
    // state
    if (formData.state.trim() === "") {
      newErrors.state = "State is required";
      isValid = false;
    } else if (
      !/^(?:[A-Za-z]{2}|Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming)$/i.test(
        formData.state
      )
    ) {
      newErrors.state = "State is invalid";
      isValid = false;
    }
    // phone number
    if (formData.phoneNumber.trim() === "") {
      newErrors.phoneNumber = "Phone number is required";
      isValid = false;
    } else if (!/^[0-9-]{10,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number is invalid. Must be 10 digits";
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    try {
      const userId = userProfile.userID;
      console.log("user ID: " + userId);
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
        createdProfileStatus(true);
        localStorage.setItem("createdProfile", JSON.stringify(true));
        response.json().then((data) => updateUserProfile({ ...data }));
      } else {
        console.error("Error updating user profile:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  return (
    <div className="profile-modal">
      <h2>Personal Information</h2>
      <form onSubmit={handleSubmit} className="profileModal-form">
        <div className="form-line">
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="first name"
          />
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="last name"
          />
        </div>
        <div className="form-line">
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="city"
          />
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            placeholder="state"
          />
        </div>

        <div className="form-line">
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="phone number"
          />
          <input className="hidden" />
        </div>
        {errors.firstName && <div>{errors.firstName}</div>}
        {errors.lastName && <div>{errors.lastName}</div>}
        {errors.city && <div>{errors.city}</div>}
        {errors.state && <div>{errors.state}</div>}
        {errors.phoneNumber && <div>{errors.phoneNumber}</div>}

        <div className="form-line">
          <MaterialButton type="submit">Next</MaterialButton>
        </div>
      </form>
    </div>
  );
};

export default ProfileModal;
