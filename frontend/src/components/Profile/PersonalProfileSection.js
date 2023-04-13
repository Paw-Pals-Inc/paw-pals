import React, { useState } from "react";
import EditIcon from "@mui/icons-material/EditOutlined";
import {
  saveUserProfileLocalStorage,
  validFileType,
} from "../../utils/functions";

function PersonalProfileSection({ data, updateUserProfile }) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: data?.firstName,
    lastName: data?.lastName,
    phoneNumber: data?.phoneNumber,
    city: data?.city,
    state: data?.state,
    profilePic: data?.profilePic,
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    city: "",
    state: "",
    phoneNumber: "",
    profilePic: "",
  });

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!validFileType(file)) {
      setErrors({
        ...errors,
        profilePic: `${file.name} not a valid file type. Update your selection.`,
      });
      return;
    }
    setErrors({ ...errors, profilePic: "" });

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prev) => ({ ...formData, profilePic: reader.result }));
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
      profilePic: "",
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

    // profile pic
    if (!formData.profilePic) {
      newErrors.profilePic = "Profile picture is required.";
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

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
      {/* text boxes filled with user profile data */}
      {/* implement edit user data functionalilty*/}
      <form className="personalProfile-form" onSubmit={handleSubmit}>
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
        <div>
          <div className="field-line">
            <div className="field-line-left">
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
            <div className="field-line-right">
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
          </div>
          <div className="field-line">
            <div className="field-line-left">
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
            <div className="field-line-right">
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
          </div>
          <div className="field-line">
            <div className="field-line-left">
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
          {errors.firstName && <div>{errors.firstName}</div>}
          {errors.lastName && <div>{errors.lastName}</div>}
          {errors.city && <div>{errors.city}</div>}
          {errors.state && <div>{errors.state}</div>}
          {errors.phoneNumber && <div>{errors.phoneNumber}</div>}
        </div>
      </form>
      <div className="profilePictureSection">
        <img src={formData.profilePic} alt="profile pic" />
        {editMode && (
          <div>
            <label htmlFor="profilePic" className="uploadPic-button">
              change picture
            </label>
            <input
              type="file"
              id="profilePic"
              name="profilePic"
              onChange={handleProfilePicChange}
              style={{ opacity: 0 }}
              hidden
              accept="image/*"
            />
          </div>
        )}
        {errors.profilePic && <div>{errors.profilePic}</div>}
      </div>
    </div>
  );
}

export default PersonalProfileSection;
