import React from "react";
import Button from "@mui/material/Button";

const MaterialButton = (props) => {
  const { styleOverrides, type, onClick, name, id, value } = props;

  const styles = {
    border: "1px black solid",
    borderRadius: "10px",
    backgroundColor: "#FF8854",
    color: "black",
    textTransform: "none",
    padding: "10px",
    width: "80px",
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
    >
      {props.children}
    </Button>
  );
};

export default MaterialButton;
