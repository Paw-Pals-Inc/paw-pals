import React, { useState, useEffect } from "react";
import {
  saveUserProfileLocalStorage,
  validFileType,
} from "../../utils/functions";
import EditIcon from "@mui/icons-material/EditOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import { Badge } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoadingProgress from "../Loading/LoadingProgress";
import ImageGallery from "../ImageGallery/ImageGallery";

const uriBase =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://pawpals-383903.ue.r.appspot.com";

function GallerySection({ data, updateUserProfile }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    petGallery: data.petGallery,
  });
  const [errors, setErrors] = useState({
    petGallery: "",
  });
  const [images, setImages] = useState(
    data?.petGallery?.map((imgUrl) => {
      return {
        src: imgUrl,
        alt: "pet image",
      };
    })
  );

  useEffect(() => {
    if (!data || !data.petGallery) {
      setIsLoading(true);
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 600);
    }
  }, []);

  useEffect(() => {
    setFormData((prev) => ({
      petGallery: data.petGallery,
    }));
    setImages(
      data.petGallery?.map((imgUrl) => {
        return {
          src: imgUrl,
          alt: "pet image",
        };
      })
    );
  }, [data.petGallery]);

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  const handleGalleryChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
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
      // append to gallery
      console.log(formData.petGallery);
      setFormData((prev) => ({
        petGallery: [...formData.petGallery, reader.result],
      }));
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      // nop
    }
  };

  const removePicture = (idx) => {
    // remove pic from state
    let galleryArr = formData.petGallery;
    let newArr = galleryArr.filter((pic, index) => index !== idx);
    // update state
    setFormData((prev) => ({
      petGallery: newArr,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Form validation
    let isValid = true;

    if (formData.petGallery.length < 1) {
      isValid = false;
    }

    if (!isValid) {
      console.log("gallery pics not valid");
      toggleEditMode();
      return;
    }

    const userId = JSON.parse(localStorage.getItem("user")).id;
    const token = localStorage.getItem("token");

    // edit profile data
    await fetch(`${uriBase}/users/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }).then(async (resp) => {
      if (resp.ok) {
        // User updated successfully
        console.log("User updated successfully");
        const data = await resp.json();
        saveUserProfileLocalStorage(data);
        updateUserProfile(data);
        toggleEditMode();
        // refresh to see new pet profile pic
        navigate("/profile");
      } else {
        console.error("Error creating user:", resp.statusText);
        // render error message on screen
        return;
      }
    });
  };

  return isLoading ? (
    <LoadingProgress />
  ) : (
    <div className="personalProfileSection">
      {/* text boxes filled with user profile data */}
      {/* implement edit user data functionalilty*/}
      <form onSubmit={handleSubmit} className="profileGallery-form">
        <div>
          <h2 className="section-header">
            Gallery
            {editMode ? (
              <button type="submit">Save</button>
            ) : (
              <EditIcon onClick={toggleEditMode} sx={{ cursor: "pointer" }} />
            )}
          </h2>
          {errors.petGallery && <div>{errors.petGallery}</div>}
          <div className="galleryPictureSection">
            {formData.petGallery && editMode ? (
              formData.petGallery.map((pic, idx) => (
                <div key={idx} className="galleryImageDiv">
                  <Badge
                    badgeContent={
                      <ClearIcon
                        fontSize="large"
                        onClick={() => removePicture(idx)}
                      />
                    }
                  >
                    <img
                      style={{ width: "100%" }}
                      src={pic}
                      alt={`doggie${idx}`}
                    />
                  </Badge>
                </div>
              ))
            ) : (
              <ImageGallery images={images} />
            )}

            {editMode && (
              <div>
                <label htmlFor="petGallery" className="uploadPic-button">
                  Add more pics
                </label>
                <input
                  type="file"
                  id="petGallery"
                  name="petGallery"
                  onChange={handleGalleryChange}
                  style={{ opacity: 0 }}
                  hidden
                  accept="image/*"
                />
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default GallerySection;
