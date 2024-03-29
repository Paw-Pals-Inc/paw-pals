import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MaterialButton from "../MaterialComponents/MaterialButton";

const uriBase =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://pawpals-383903.ue.r.appspot.com";

function LoginModal({ onLogin }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${uriBase}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      // User has been authenticated successfully
      onLogin(data.user);
      // Redirect to profile page
      navigate("/home");
    } else {
      // Display an error message
      const data = await response.json();
      alert(data.message);
    }
  };

  return (
    <div className="login-modal">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
        />
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />
        <br />

        <MaterialButton type="submit">Login</MaterialButton>
      </form>
    </div>
  );
}

export default LoginModal;
