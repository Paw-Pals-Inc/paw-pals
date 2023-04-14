import React, { useState } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  ListItemText,
  Checkbox,
} from "@mui/material";

const sizes = ["Small", "Medium", "Large"];

const SizeFilter = ({ value, onChange }) => {
  // Render size filter component

  const handleSizeChange = (event) => {
    const {
      target: { value },
    } = event;

    onChange(typeof value === "string" ? value.split(",") : value);
  };

  const renderSizeLabels = (sizeIndex) => {
    switch (sizeIndex) {
      case 0:
        return "Small (0-25 lbs)";
      case 1:
        return "Medium (26-58 lbs)";
      case 2:
        return "Large (59+ lbs)";
      default:
        break;
    }
  };

  return (
    <div className="size-filter">
      <FormControl sx={{ m: 1, width: 300, backgroundColor: "white" }}>
        <Select
          id="multiple-checkbox"
          size="small"
          displayEmpty
          multiple
          value={value}
          onChange={handleSizeChange}
          renderValue={(selected) => {
            return <em>Size</em>;
          }}
        >
          {sizes.map((size, idx) => (
            <MenuItem key={size} value={size}>
              <Checkbox checked={value.indexOf(size) > -1} />
              <ListItemText primary={renderSizeLabels(idx)} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default SizeFilter;
