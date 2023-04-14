import React, { useState } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  ListItemText,
  Checkbox,
} from "@mui/material";

const genders = ["Male", "Female"];

const GenderFilter = ({ value, onChange }) => {
  // Render gender filter component

  const handleGenderChange = (event) => {
    const {
      target: { value },
    } = event;
    onChange(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <div className="gender-filter">
      <FormControl sx={{ m: 1, width: 300, backgroundColor: "white" }}>
        <Select
          size="small"
          value={value}
          multiple
          displayEmpty
          onChange={handleGenderChange}
          renderValue={(selected) => {
            return <em>Gender</em>;
          }}
        >
          {genders.map((gender) => (
            <MenuItem key={gender} value={gender}>
              <Checkbox checked={value.indexOf(gender) > -1} />
              <ListItemText primary={gender} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default GenderFilter;
