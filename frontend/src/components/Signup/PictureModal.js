import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MaterialButton from "../MaterialComponents/MaterialButton";
import { fileTypes } from "../../utils/constants";
import { validFileType } from "../../utils/functions";

const uriBase =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://pawpals-383903.ue.r.appspot.com";

const PictureModal = ({
  userData,
  onLogin,
  userProfile,
  updateUserProfile,
  createdDescriptonStatus,
  createdPicturesStatus,
}) => {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(null);
  const [petProfilePic, setPetProfilePic] = useState(null);

  const [errors, setErrors] = useState({
    profilePic: "",
    petProfilePic: "",
  });

  const handleLabelClick = () => {
    console.log("click label");
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (!validFileType(file)) {
      setErrors({
        profilePic: `${file.name} not a valid file type. Update your selection.`,
        petProfilePic: "",
      });
      return;
    }
    setErrors({
      profilePic: "",
      petProfilePic: "",
    });

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfilePic(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      setProfilePic(null);
    }
  };

  const handlePetPicChange = (event) => {
    const file = event.target.files[0];
    if (!validFileType(file)) {
      setErrors({
        petProfilePic: `${file.name} not a valid file type. Update your selection.`,
        profilePic: "",
      });
      return;
    }
    setErrors({
      profilePic: "",
      petProfilePic: "",
    });

    const reader = new FileReader();

    reader.onloadend = () => {
      setPetProfilePic(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      setPetProfilePic(null);
    }
  };

  const goBack = (event) => {
    createdDescriptonStatus(false);
    createdPicturesStatus(false);
    localStorage.removeItem("createdPictures");
    navigate("/signup");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Form validation
    let isValid = true;
    const newErrors = {
      profilePic: "",
      petProfilePic: "",
    };

    if (!profilePic) {
      newErrors.profilePic = "Profile picture is required.";
      isValid = false;
    }
    if (!petProfilePic) {
      newErrors.petProfilePic = "Pet profile picture is required.";
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    try {
      const userId = userProfile.userID;
      const response = await fetch(uriBase + "/users/" + userId, {
        method: "PUT",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          profilePic: profilePic,
          petGallery: [petProfilePic],
        }),
      });

      if (response.ok) {
        // Profile updated successfully
        console.log("Profile updated successfully");
        createdPicturesStatus(true);
        localStorage.setItem("createdPictures", JSON.stringify(true));
        response.json().then((data) => updateUserProfile({ ...data }));

        //login w/ new profile
        let password = localStorage.getItem("password");
        const login = await fetch(uriBase + "/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userData.email, password }),
        });

        if (login.ok) {
          // delete password from localstorage
          localStorage.removeItem("password");
          localStorage.removeItem("createdProfile");
          localStorage.removeItem("createdDogProfile");
          localStorage.removeItem("createdDogPersonality");
          localStorage.removeItem("createdDescription");
          localStorage.removeItem("createdPictures");
          const data = await login.json();
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          // User has been authenticated successfully
          onLogin(data.user);
          // Redirect to profile page
          navigate("/home");
        }
      } else {
        console.error("Error updating user profile:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  return (
    <div className="signup-modal pic-modal">
      <h2>Upload profile pictures</h2>
      <form onSubmit={handleSubmit} className="pictureModal-form">
        <div className="form-line">
          <div className="form-line-left">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <h3 style={{ textAlign: "center" }}>Your Profile Picture:</h3>
              <label
                htmlFor="profilePic"
                className="uploadPic-button"
                onClick={handleLabelClick}
              >
                upload
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
            {profilePic && (
              <img
                className="imagePreview"
                src={profilePic}
                alt="Profile Pic Preview"
                style={{ maxWidth: "200px", marginTop: "1rem" }}
              />
            )}
          </div>
          <div className="form-line-right">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <h3 style={{ textAlign: "center" }}>Pet Profile Picture:</h3>
              <label
                htmlFor="petProfilePic"
                className="uploadPic-button"
                onClick={handleLabelClick}
              >
                upload
              </label>
              <input
                type="file"
                id="petProfilePic"
                name="petProfilePic"
                onChange={handlePetPicChange}
                style={{ opacity: 0 }}
                hidden
                accept="image/*"
              />
            </div>
            {petProfilePic && (
              <img
                className="imagePreview"
                src={petProfilePic}
                alt="Pet Profile Pic Preview"
                style={{ maxWidth: "200px", marginTop: "1rem" }}
              />
            )}
          </div>
        </div>
        {errors.profilePic && <div className="errors">{errors.profilePic}</div>}
        {errors.petProfilePic && (
          <div className="errors">{errors.petProfilePic}</div>
        )}
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
              Finish
            </MaterialButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PictureModal;
