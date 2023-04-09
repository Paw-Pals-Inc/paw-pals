import { AppBar, Toolbar, Link, Box } from "@mui/material";
import React from "react";
import MaterialButton from "../MaterialComponents/MaterialButton";
import logo_middle from "../../assets/logo_middle.png";

function Navbar(props) {
  const { isLoggedIn, signup, handleLogin } = props;

  const handleLoginButton = () => {
    if (isLoggedIn) return;
    handleLogin();
  };

  let imgHt = "70px";

  return (
    <div>
      <AppBar position="static">
        <Toolbar
          className="navbar-toolbar"
          sx={{
            backgroundColor: "white",
            display: "flex",
            flexDirection: "row",
            position: "relative",
          }}
        >
          <Link href="/" sx={isLoggedIn ? { m: "auto" } : { ml: "auto" }}>
            <Box
              className="logo-container"
              sizes="large"
              component="img"
              sx={{ maxHeight: imgHt }}
              alt="Logo"
              src={logo_middle}
            />
          </Link>
          {!isLoggedIn && !signup && (
            <MaterialButton
              styleOverrides={{ ml: "auto" }}
              color="inherit"
              onClick={handleLoginButton}
            >
              {isLoggedIn || signup ? "" : "Login"}
            </MaterialButton>
          )}
          {signup && <div></div>}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Navbar;
