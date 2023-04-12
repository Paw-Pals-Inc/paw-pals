import { DOG_WEIGHTS, DOG_AGES } from "./constants";
import { fileTypes } from "./constants";

export const calculateCompatibility = (
  userTags,
  otherUserTags,
  otherUserId
) => {
  console.log("user tags: ", userTags);
  console.log("other user tags: ", otherUserTags);
  let compatibilityScore;
  if (userTags && otherUserTags) {
    const [userTagsArr, otherUserTagsArr] = [userTags, otherUserTags];
    const matchingTags = userTagsArr.filter((tag) =>
      otherUserTagsArr.includes(tag)
    );
    compatibilityScore = (matchingTags.length / userTags.length) * 10;
    compatibilityScore = Math.round(compatibilityScore * 10) / 10; // one dec place
  } else {
    compatibilityScore = 0;
  }
  return { userId: otherUserId, score: compatibilityScore };
};

export function saveUserProfilesLocalStorage(profiles) {
  profiles.forEach(async (profile) => {
    profile = await modifyProfileImageData(profile);
  });
  localStorage.setItem("userProfiles", JSON.stringify(profiles));
}

/**
 * convert profile pic before saving to local storage due to memory limitations
 * @param {*} profile  user profile object
 */
export async function saveUserProfileLocalStorage(profile) {
  let newProfile = await modifyProfileImageData(profile);
  console.log("new profile after mod: ", newProfile);
  localStorage.setItem("userProfile", JSON.stringify(newProfile));
}

const modifyProfileImageData = async (profile) => {
  if (profile.profilePic) {
    // convert image data url to image url
    console.log("handling the profile pic");
    console.log(profile.profilePic);
    profile.profilePic = await convertDataUrlToImageUrl(profile.profilePic);
  }

  if (profile.petGallery) {
    console.log("handling user's pet gallery pics");
    for (let i = 0; i < profile.petGallery.length; i++) {
      profile.petGallery[i] = await convertDataUrlToImageUrl(
        profile.petGallery[i]
      );
    }
  }
  return profile;
};

const convertDataUrlToImageUrl = async (dataUrl) => {
  if (dataUrl === "") return "";
  const blob = await dataURLtoBlob(dataUrl); // Convert Data URL to Blob
  const imageUrl = URL.createObjectURL(blob); // Create image URL from Blob
  return imageUrl;
};

const dataURLtoBlob = async (dataUrl) => {
  if (dataUrl.match(/^blob/)) {
    console.log("gotta convert to actual blob");
    // convert to actual blob
    let blob = await fetch(dataUrl)
      .then((r) => r.blob())
      .then(async (blob) => {
        console.log(blob);
        dataUrl = await blobToDataURL(blob);
      });
  }

  console.log("we're good to go with the data url");
  const arr = dataUrl.split(","); // Split the Data URL into type and data parts
  const mime = arr[0].match(/:(.*?);/)[1]; // Extract MIME type from type part
  const bstr = atob(arr[1]); // Decode the data part using base64
  let n = bstr.length;
  const u8arr = new Uint8Array(n); // Create Uint8Array to store binary data

  // Convert binary data from base64 to Uint8Array
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  // Create Blob from Uint8Array and return
  return new Blob([u8arr], { type: mime });
};

export const blobToDataURL = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (_e) => resolve(reader.result);
    reader.onerror = (_e) => reject(reader.error);
    reader.onabort = (_e) => reject(new Error("Read aborted"));
    reader.readAsDataURL(blob);
  });
};

export const getSizeBoundsArr = (sizeFilterArr) => {
  console.log(sizeFilterArr);

  let minWeight;
  let maxWeight;
  // manipulate array
  if (sizeFilterArr.includes("Small")) {
    minWeight = DOG_WEIGHTS.SMALL.MIN;
    if (sizeFilterArr.includes("Medium")) {
      if (sizeFilterArr.includes("Large")) {
        maxWeight = DOG_WEIGHTS.LARGE.MAX;
      } else {
        maxWeight = DOG_WEIGHTS.MEDIUM.MAX;
      }
    } else {
      maxWeight = DOG_WEIGHTS.SMALL.MAX;
    }
  } else if (sizeFilterArr.includes("Medium")) {
    minWeight = DOG_WEIGHTS.MEDIUM.MIN;
    if (sizeFilterArr.includes("Large")) {
      maxWeight = DOG_WEIGHTS.LARGE.MAX;
    } else {
      maxWeight = DOG_WEIGHTS.MEDIUM.MAX;
    }
  } else if (sizeFilterArr.includes("Large")) {
    minWeight = DOG_WEIGHTS.LARGE.MIN;
    maxWeight = DOG_WEIGHTS.LARGE.MAX;
  }

  return [minWeight, maxWeight];
};

export const getAgeBoundsArr = (ageFilterArr) => {
  console.log(ageFilterArr);

  let minAge;
  let maxAge;
  // manipulate array
  if (ageFilterArr.includes("Puppy")) {
    minAge = DOG_AGES.PUPPY.MIN;
    if (ageFilterArr.includes("Adult")) {
      if (ageFilterArr.includes("Senior")) {
        maxAge = DOG_AGES.SENIOR.MAX;
      } else {
        maxAge = DOG_AGES.ADULT.MAX;
      }
    } else {
      maxAge = DOG_AGES.PUPPY.MAX;
    }
  } else if (ageFilterArr.includes("Adult")) {
    minAge = DOG_AGES.ADULT.MIN;
    if (ageFilterArr.includes("Senior")) {
      maxAge = DOG_AGES.SENIOR.MAX;
    } else {
      maxAge = DOG_AGES.ADULT.MAX;
    }
  } else if (ageFilterArr.includes("Senior")) {
    minAge = DOG_AGES.SENIOR.MIN;
    maxAge = DOG_AGES.SENIOR.MAX;
  }

  return [minAge, maxAge];
};

export function validFileType(file) {
  return fileTypes.includes(file.type);
}
