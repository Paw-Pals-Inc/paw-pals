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
  localStorage.setItem("userProfiles", JSON.stringify(profiles));
}

export async function saveUserProfileLocalStorage(profile) {
  localStorage.setItem("userProfile", JSON.stringify(profile));
}

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
