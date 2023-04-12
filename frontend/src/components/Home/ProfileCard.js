import * as React from "react";
import {
  ExpandMore as ExpandMoreIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  ArrowCircleRight as ArrowCircleRightIcon,
  Style,
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  CardActions,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  BadgeUnstyled,
} from "@mui/material";
import { styled } from "@mui/material/styles";

function ProfileCard({
  profileData,
  isFavorite,
  addFavorite,
  removeFavorite,
  enterProfile,
  compatibilityScore,
  petGallery,
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
    profilePictureUrl,
  } = profileData;

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: "white",
      color: "black",
      fontSize: "1rem",
      width: "25px",
      height: "25px",
      border: "1px solid black",
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        border: "1px solid black",
      },
    },
  }));
  return (
    <div>
      <Card
        key={userID}
        className="profileCard"
        style={{
          display: "flex",
          padding: "20px 30px",
          backgroundColor: "#ffd29d",
          borderRadius: "40px",
        }}
      >
        <CardMedia
          image={petGallery && petGallery[0]}
          sx={{ borderRadius: "20px" }}
          children={
            <StyledBadge
              badgeContent={compatibilityScore}
              showZero
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            />
          }
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

          <Typography variant="body2" component="p" color="textSecondary">
            {(petDescription.length > 250
              ? petDescription.substr(0, 250) + "..."
              : petDescription) ||
              "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid dolorem explicabo laboriosam iure enim sequi, impedit illum recusandae quasi obcaecati atque voluptas vero ipsa voluptatem blanditiis officiis repudiandae deserunt illo odio"}
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
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            {isFavorite ? "favorited" : "favorite"}
            {isFavorite ? (
              <StarIcon onClick={() => removeFavorite(userID)} />
            ) : (
              <StarBorderIcon onClick={() => addFavorite(userID)} />
            )}
          </div>
          <ArrowCircleRightIcon onClick={() => enterProfile(userID)} />
        </CardActions>
      </Card>
    </div>
  );
}

export default ProfileCard;
