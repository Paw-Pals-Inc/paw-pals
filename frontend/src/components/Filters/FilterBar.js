import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import AgeFilter from "./AgeFilter";
import PersonalityFilter from "./PersonalityFilter";
import GenderFilter from "./GenderFilter";
import SizeFilter from "./SizeFilter";

const FilterBar = ({
  onFilter,
  onClearFilter,
  clearFilters,
  resetClearFilter,
}) => {
  const [sizeFilterValue, setSizeFilterValue] = useState([]);
  const [genderFilterValue, setGenderFilterValue] = useState([]);
  const [personalityFilterValue, setPersonalityFilterValue] = useState([]);
  const [ageFilterValue, setAgeFilterValue] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    sizeFilter: sizeFilterValue,
    genderFilter: genderFilterValue,
    personalityFilter: personalityFilterValue,
    ageFilter: ageFilterValue,
  });

  useEffect(() => {
    // reset all filter states
    if (clearFilters) {
      setSizeFilterValue([]);
      setGenderFilterValue([]);
      setPersonalityFilterValue([]);
      setAgeFilterValue([]);
      resetClearFilter();
    }
  }, [clearFilters]);

  useEffect(() => {
    // update selected filters when filter values change
    setSelectedFilters({
      sizeFilter: sizeFilterValue,
      genderFilter: genderFilterValue,
      personalityFilter: personalityFilterValue,
      ageFilter: ageFilterValue,
    });
  }, [
    sizeFilterValue,
    genderFilterValue,
    personalityFilterValue,
    ageFilterValue,
  ]);

  const handleFilterButtonClick = () => {
    onFilter(selectedFilters);
  };

  const handleClearFilterButton = () => {
    onClearFilter();
  };

  // Event handler for updating size filter value
  const handleSizeFilterChange = (sizeArr) => {
    setSizeFilterValue([...sizeArr]);
  };

  // Event handler for updating gender filter value
  const handleGenderFilterChange = (genderArr) => {
    setGenderFilterValue([...genderArr]);
  };

  // Event handler for updating gender filter value
  const handlePersonalityFilterChange = (personalityArr) => {
    setPersonalityFilterValue([...personalityArr]);
  };

  // Event handler for updating age filter value
  const handleAgeFilterChange = (ageArr) => {
    setAgeFilterValue([...ageArr]);
  };

  return (
    <div className="filterArea">
      Filter By:
      <SizeFilter value={sizeFilterValue} onChange={handleSizeFilterChange} />
      <GenderFilter
        value={genderFilterValue}
        onChange={handleGenderFilterChange}
      />
      <PersonalityFilter
        value={personalityFilterValue}
        onChange={handlePersonalityFilterChange}
      />
      <AgeFilter value={ageFilterValue} onChange={handleAgeFilterChange} />
      <Button
        variant="contained"
        color="primary"
        onClick={handleFilterButtonClick}
      >
        Filter
      </Button>
      <Button
        variant="contained"
        sx={{ backgroundColor: "white", color: "primary.main" }}
        onClick={handleClearFilterButton}
      >
        Clear Filter
      </Button>
    </div>
  );
};

export default FilterBar;
