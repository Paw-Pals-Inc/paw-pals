import React, { useState, useEffect } from "react";
import "./imageGallery.css";
import LoadingProgress from "../Loading/LoadingProgress";
import { motion, AnimatePresence } from "framer-motion";

const imageVariant = {
  small: {
    maxWidth: "0%",
    maxHeight: "0%",
    transition: {
      duration: 0.3, // duration of the animation in seconds
      ease: "easeOut", // easing function for the animation
    },
  },
  large: {
    maxWidth: "90%", // large size of the image
    maxHeight: "90%",
    transition: {
      duration: 0.3, // duration of the animation in seconds
      ease: "easeIn", // easing function for the animation
    },
  },
};
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
          <motion.img
            key={index}
            src={image.src}
            alt={image.alt}
            onClick={() => handleImageClick(image)}
            className="thumbnail-image"
            whileHover={{ scale: 1.2 }}
          />
        ))}

      {/* Render fullscreen image */}
      <AnimatePresence>
        {fullscreenImage && (
          <div className="fullscreen-overlay" onClick={handleCloseFullscreen}>
            <motion.img
              key="galleryImg"
              variants={imageVariant}
              initial="small"
              animate="large"
              exit="small"
              src={fullscreenImage.src}
              alt={fullscreenImage.alt}
              className="fullscreen-image"
            />
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageGallery;
