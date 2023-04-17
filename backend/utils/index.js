const jwt = require("jsonwebtoken");
const fs = require("fs");

/** Login authentication middleware **/

// generate JWT token
function generateAccessToken(user) {
  return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "60m",
  });
}

// authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  });
}

/*Download the base64 image in the server and returns the filename path of image.*/
function saveImage(baseImage, userID) {
  const uploadPath =
    "/Users/brentonjackson/Documents/College/GSU/CS/CSC 4350 - Software Engineering/Projects/paw-pals/backend/uploads/images";
  //path of folder where you want to save the image.
  const localPath = `${uploadPath}/${userID}/`;
  //Find extension of file
  const ext = getExtensionFromDataURL(baseImage) || "png";
  const fileType = baseImage.substring("data:".length, baseImage.indexOf("/"));
  //Forming regex to extract base64 data of file.
  const regex = new RegExp(`^data:${fileType}\/${ext};base64,`, "gi");
  //Extract base64 data.
  const base64Data = baseImage.replace(regex, "");
  const rand = Math.ceil(Math.random() * 1000);
  //Random photo name with timeStamp so it will not overide previous images.
  const filename = `${Date.now()}_${rand}.${ext}`;

  //Check that if directory is present or not.
  if (!fs.existsSync(`${uploadPath}`)) {
    fs.mkdirSync(`${uploadPath}`, { recursive: true });
  }
  if (!fs.existsSync(localPath)) {
    fs.mkdirSync(localPath);
  }
  fs.writeFileSync(localPath + filename, base64Data, "base64");
  return filename;
}

const getExtensionFromDataURL = (dataUrl) => {
  const match = dataUrl.match(/^data:image\/(\w+);base64,/);
  if (match) {
    return match[1];
  } else {
    return null;
  }
};

module.exports = { generateAccessToken, authenticateToken, saveImage };
