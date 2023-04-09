import React, { useState } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  ListItemText,
  Checkbox,
} from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

const petTags = [
  "Likes to run",
  "Share toys",
  "Non-reactive",
  "High energy",
  "Friendly",
  "Likes to roughhouse",
  "Shy",
  "Friendly towards strangers",
  "Frequent barker",
  "Plays catch",
];

const PersonalityFilter = ({ value, onChange }) => {
  // Render personality filter component

  const handleTagChange = (event) => {
    const {
      target: { value },
    } = event;
    onChange(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <div className="personality-filter">
      <FormControl sx={{ m: 1, width: 300 }}>
        <Select
          id="multiple-checkbox"
          size="small"
          displayEmpty
          multiple
          value={value}
          onChange={handleTagChange}
          MenuProps={MenuProps}
          renderValue={(selected) => {
            return <em>Personality</em>;
          }}
        >
          {petTags.map((tag) => (
            <MenuItem key={tag} value={tag}>
              <Checkbox checked={value.indexOf(tag) > -1} />
              <ListItemText primary={tag} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default PersonalityFilter;
