import * as React from "react";
import {
  ExpandMore as ExpandMoreIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  ArrowCircleRight as ArrowCircleRightIcon,
  Style,
} from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";

const profileCardVariant = {
  initial: { y: 800 },
  animate: {
    y: 0,
    transition: { ease: "easeOut", duration: 0.5, delay: 0.25 },
  },
  whileInView: {
    y: 0,
    transition: { ease: "easeOut", duration: 0.5 },
  },
  exit: {
    x: "-100vw",
    y: 800,
  },
};

function ProfileCard({
  profileData,
  isFavorite,
  addFavorite,
  removeFavorite,
  enterProfile,
  compatibilityScore,
  buttonVariant,
}) {
  const {
    petName,
    petAge,
    petGender,
    petTags,
    petWeight,
    petBreed,
    petDescription,
    firstName,
    lastName,
    userID,
    petGallery,
  } = profileData;

  return (
    <AnimatePresence>
      <motion.div
        variants={profileCardVariant}
        initial="initial"
        animate="animate"
        whileInView="whileInView"
        exit="exit"
      >
        <Card
          key={userID}
          className="profileCard"
          style={{
            display: "flex",
            padding: "20px 30px",
            backgroundColor: "#ffd29d",
            borderRadius: "40px",
            boxShadow:
              "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
          }}
        >
          <CardMedia
            image={petGallery && petGallery[0]}
            sx={{
              borderRadius: "20px",
              boxShadow:
                "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
            }}
            style={{ width: "25%", height: 200, objectFit: "cover" }}
          />
          <CardContent className="cardContent">
            <div className="titleRow">
              <Typography variant="h5" component="h2">
                {petName}
              </Typography>
              <Typography variant="h5" component="h2">
                {petBreed}
              </Typography>
            </div>
            <Typography variant="subtitle1">Personality traits:</Typography>
            <Typography variant="body2">
              <span style={{ display: "flex" }}>
                {petTags &&
                  petTags.map(
                    (tag, idx) => tag + (idx != petTags.length - 1 ? ", " : "")
                  )}
              </span>
            </Typography>
            <Typography>
              <span>Owner: </span>
              <span>{firstName + " " + lastName}</span>
            </Typography>
          </CardContent>
          <CardActions
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-end",
              width: "15%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              {isFavorite ? "favorited" : "favorite"}
              <motion.div
                variants={buttonVariant}
                whileHover="whileHover"
                whileTap="whileTap"
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                {isFavorite ? (
                  <StarIcon
                    onClick={() => removeFavorite(userID)}
                    sx={{ width: "30px", height: "30px", cursor: "pointer" }}
                  />
                ) : (
                  <StarBorderIcon
                    onClick={() => addFavorite(userID)}
                    sx={{ width: "30px", height: "30px", cursor: "pointer" }}
                  />
                )}
              </motion.div>
            </div>

            <motion.div
              variants={buttonVariant}
              whileHover="whileHover"
              whileTap="whileTap"
            >
              <ArrowCircleRightIcon
                sx={{ width: "45px", height: "45px", cursor: "pointer" }}
                onClick={() => enterProfile(userID)}
              />
            </motion.div>
          </CardActions>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

export default ProfileCard;
