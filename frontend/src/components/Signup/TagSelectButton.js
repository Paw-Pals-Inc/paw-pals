import { useState } from "react";
import MaterialButton from "../MaterialComponents/MaterialButton";

const TagSelectButton = (props) => {
  const { id, updateTags, tagName, styleOverrides } = props;
  const [isSelected, setIsSelected] = useState(false);
  const defaultStyle = {
    width: "210px",
  };
  const toggleStyle = {
    backgroundColor: "yellow",
    width: "210px",
  };
  const handleClick = (e) => {
    // remove or add to tags array
    console.log("isSelected: ", isSelected);
    updateTags(id, !isSelected);
    setIsSelected((prev) => !prev);
    console.log("isSelected new: ", isSelected);
  };
  return (
    <div className="tagSelect-button" key={id}>
      <MaterialButton
        onClick={handleClick}
        styleOverrides={
          isSelected
            ? { ...toggleStyle, ...styleOverrides }
            : { ...defaultStyle, ...styleOverrides }
        }
      >
        {tagName}
      </MaterialButton>
    </div>
  );
};

export default TagSelectButton;
