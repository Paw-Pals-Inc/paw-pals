import React, { useState, useEffect } from "react";
import {
  saveUserProfileLocalStorage,
  validFileType,
  blobToDataURL,
} from "../../utils/functions";
import EditIcon from "@mui/icons-material/EditOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import { Badge } from "@mui/material";
import { useNavigate } from "react-router-dom";

function GallerySection({ data, petGallery, updatePetGallery }) {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    petGallery: petGallery,
  });
  const [errors, setErrors] = useState({
    petGallery: "",
  });

  useEffect(() => {
    if (!petGallery) {
      // get it again
      navigate("/home");
    }
    console.log(petGallery);
  }, [petGallery]);

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  const handleLabelClick = (e) => {
    console.log("click label");
    console.log(e);
    let input = document.querySelector("#petGallery");
    console.log(input);
    input.click();
  };

  const handleGalleryChange = (event) => {
    console.log("im listening to your add button");
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
    console.log(newArr);
    // update state
    setFormData((prev) => ({
      petGallery: newArr,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Form validation
    let isValid = true;
    let newForm = formData;

    if (formData.petGallery.length < 1) {
      isValid = false;
    } else {
      const promises = formData.petGallery.map(async (imageStr, idx) => {
        if (imageStr.match(/^blob/)) {
          console.log(`image ${idx} is a blob url`);
          // convert to data url
          let blob = await fetch(imageStr)
            .then((r) => r.blob())
            .then(async (blob) => {
              console.log(blob);
              let dataUrl = await blobToDataURL(blob);
              if (dataUrl) {
                if (dataUrl.match(/^blob/)) isValid = false;
                newForm = { petGallery: [...formData.petGallery] };
                newForm.petGallery[idx] = dataUrl;
                setFormData((prev) => newForm);
                console.log(newForm.petGallery);
              } else {
                console.log(dataUrl);
                isValid = false;
              }
            });
        }
      });
      await Promise.all(promises);
    }
    console.log("i should see this after my promises resolve");

    if (!isValid) {
      console.log("gallery pics not valid");
      toggleEditMode();
      return;
    }

    console.log(newForm);

    const userId = JSON.parse(localStorage.getItem("user")).id;
    const token = localStorage.getItem("token");

    // edit profile data
    await fetch(`http://localhost:4000/users/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newForm),
    }).then(async (resp) => {
      if (resp.ok) {
        // User created successfully
        console.log("User updated successfully");
        const data = await resp.json();
        let prevProfile = JSON.parse(localStorage.getItem("userProfile"));
        let newData = { ...prevProfile, ...data };
        console.log("new data: ", newData);
        saveUserProfileLocalStorage(newData);
        updatePetGallery(newData.petGallery);
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

  return (
    <div className="personalProfileSection">
      {/* text boxes filled with user profile data */}
      {/* implement edit user data functionalilty*/}
      <form onSubmit={handleSubmit} className="profileDescription-form">
        <div>
          <h2 className="section-header">
            Gallery
            {editMode ? (
              <button type="submit">Save</button>
            ) : (
              <EditIcon onClick={toggleEditMode} />
            )}
          </h2>
          {errors.petGallery && <div>{errors.petGallery}</div>}
          <div className="galleryPictureSection">
            {formData.petGallery &&
              formData.petGallery.map((pic, idx) => (
                <div key={idx} className="galleryImageDiv">
                  {editMode ? (
                    <Badge
                      badgeContent={
                        <ClearIcon
                          fontSize="large"
                          onClick={() => removePicture(idx)}
                        />
                      }
                    >
                      <img src={pic} alt={`doggie${idx}`} />
                    </Badge>
                  ) : (
                    <img src={pic} alt={`doggie${idx}`} />
                  )}
                </div>
              ))}
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
