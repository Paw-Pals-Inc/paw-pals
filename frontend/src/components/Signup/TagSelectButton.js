import { useState, useEffect } from "react";
import MaterialButton from "../MaterialComponents/MaterialButton";

const TagSelectButton = (props) => {
  const {
    id,
    updateTags,
    tagName,
    styleOverrides,
    clickAction,
    selectedTagIds,
  } = props;
  const [isSelected, setIsSelected] = useState(false);
  useEffect(() => {
    if (selectedTagIds && id !== null) {
      setIsSelected((prev) => selectedTagIds.includes(id));
    }
  }, [id, selectedTagIds]);

  const defaultStyle = {
    width: "210px",
  };
  const toggleStyle = {
    backgroundColor: "yellow",
    width: "210px",
  };
  const handleClick = (e) => {
    // remove or add to tags array
    setIsSelected((prev) => !prev);
    updateTags(id, !isSelected);
  };
  return (
    <div className="tagSelect-button" key={id}>
      <MaterialButton
        key={id}
        onClick={clickAction ? clickAction : handleClick}
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
