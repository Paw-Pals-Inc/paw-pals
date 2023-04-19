import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MaterialButton from "../MaterialComponents/MaterialButton";

const uriBase =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://pawpals-383903.ue.r.appspot.com";

const SignupModal = ({
  onLogin,
  createdAccountStatus,
  updateToken,
  updateUserData,
  updateUserProfile,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // form validation
    let isValid = true;
    const newErrors = {
      email: "",
      password: "",
    };

    if (formData.email.trim() === "") {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (formData.password.trim() === "") {
      newErrors.password = "Password is required";
      isValid = false;
    }
    // } else if (formData.password.length < 6) {
    //   newErrors.password = "Password must be at least 6 characters long";
    //   isValid = false;
    // }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    try {
      await fetch(`${uriBase}/users`, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((resp) => {
          if (resp.ok) {
            // User created successfully
            console.log("User created successfully");
          } else {
            // console.error("Error creating user:", resp.statusText);
            const message = resp.json().then((data) => alert(data.message));
            // console.log("message: ", message);
            // render error message on screen
            return;
          }
          return resp.json();
        })
        .then((data) => {
          // localStorage.setItem("token", data.token);
          // localStorage.setItem("user", JSON.stringify(data.user));
          // save password for eventual login
          localStorage.setItem("password", formData.password);
          console.log("data: ", data);
          updateToken(data.token);
          console.log("updating user profile");
          updateUserData(data.user);
          updateUserProfile(data.profile);
          onLogin(data.user);
        })
        .then(() => createdAccountStatus(true));
      navigate("/signup");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="signup-modal">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="email"
        />
        {errors.email && <div className="errors">{errors.email}</div>}
        <br />
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="password"
          autoComplete="on"
        />
        {errors.password && <div className="errors">{errors.password}</div>}
        <br />
        <input
          type="password"
          id="confirm-password"
          name="confirm-password"
          onChange={handleInputChange}
          placeholder="confirm password"
          autoComplete="on"
        />
        {errors.password && <div className="errors">{errors.password}</div>}
        <br />
        <MaterialButton type="submit">Sign Up</MaterialButton>
      </form>
    </div>
  );
};

export default SignupModal;
