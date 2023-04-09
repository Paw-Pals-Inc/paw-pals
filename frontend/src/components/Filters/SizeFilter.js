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

  return (
    <div className="size-filter">
      <FormControl sx={{ m: 1, width: 300 }}>
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
          {sizes.map((size) => (
            <MenuItem key={size} value={size}>
              <Checkbox checked={value.indexOf(size) > -1} />
              <ListItemText primary={size} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default SizeFilter;
