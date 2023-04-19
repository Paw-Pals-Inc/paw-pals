import React from "react";
import Button from "@mui/material/Button";

const MaterialButton = (props) => {
  const { styleOverrides, type, onClick, name, id, value, size } = props;

  const styles = {
    border: "none",
    boxShadow:
      "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
    borderRadius: "10px",
    backgroundColor: "#FF8854",
    color: "black",
    textTransform: "none",
    padding: "10px",
    width: "80px",
    "&:hover": {
      backgroundColor: "#FF8854",
      color: "white",
    },
  };

  const totalStyles = { ...styles, ...styleOverrides };

  return (
    <Button
      type={type}
      sx={totalStyles}
      onClick={onClick}
      name={name}
      id={id}
      value={value}
      size={size}
    >
      {props.children}
    </Button>
  );
};

export default MaterialButton;
