import React, { useState, useEffect } from "react";
import "./imageGallery.css";
import LoadingProgress from "../Loading/LoadingProgress";

const ImageGallery = ({ images }) => {
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log(images);
    if (!images) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleImageClick = (image) => {
    setFullscreenImage(image);
  };

  const handleCloseFullscreen = () => {
    setFullscreenImage(null);
  };

  return isLoading ? (
    <LoadingProgress />
  ) : (
    <>
      {/* Render thumbnail images */}
      {images &&
        images.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={image.alt}
            onClick={() => handleImageClick(image)}
            className="thumbnail-image"
          />
        ))}

      {/* Render fullscreen image */}
      {fullscreenImage && (
        <div className="fullscreen-overlay" onClick={handleCloseFullscreen}>
          <img
            src={fullscreenImage.src}
            alt={fullscreenImage.alt}
            className="fullscreen-image"
          />
        </div>
      )}
    </>
  );
};

export default ImageGallery;
