import React, { useState } from "react";
import { Select, MenuItem, ListItemText, Checkbox } from "@mui/material";

const ages = ["Puppy", "Adult", "Senior"];

const AgeFilter = ({ value, onChange }) => {
  // Render age filter component

  const handleAgeChange = (event) => {
    const {
      target: { value },
    } = event;

    onChange(typeof value === "string" ? value.split(",") : value); // Update age range state
  };

  const renderAgeLabels = (sizeIndex) => {
    switch (sizeIndex) {
      case 0:
        return "Puppy (0-2 yrs)";
      case 1:
        return "Adult (2-12 yrs)";
      case 2:
        return "Senior (13+ yrs)";
      default:
        break;
    }
  };

  return (
    <div className="age-filter">
      <Select
        value={value}
        onChange={handleAgeChange}
        displayEmpty
        multiple
        renderValue={(selected) => {
          return <em>Age</em>;
        }}
        size="small"
      >
        {ages.map((age, idx) => (
          <MenuItem key={age} value={age}>
            <Checkbox checked={value.indexOf(age) > -1} />
            <ListItemText primary={renderAgeLabels(idx)} />
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default AgeFilter;
