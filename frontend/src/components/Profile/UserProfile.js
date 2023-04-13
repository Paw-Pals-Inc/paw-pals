import React, { useState, useEffect } from "react";
import PersonalProfileSection from "./PersonalProfileSection";
import PetProfileSection from "./PetProfileSection";
import DescriptionSection from "./DescriptionSection";
import GallerySection from "./GallerySection";
import AttributeSection from "./AttributeSection";

function UserProfile({ userProfile, updateUserProfile }) {
  const profilePic = userProfile && userProfile.profilePic;
  const petGallery = userProfile && userProfile.petGallery;
  const petName = userProfile && userProfile.petName;
  const petBreed = userProfile && userProfile.petBreed;
  const petVaccinated = userProfile && userProfile.petVaccinated;
  const petNeutered = userProfile && userProfile.petNeutered;
  const petAge = userProfile && userProfile.petAge;
  const petGender = userProfile && userProfile.petGender;
  const petTags = userProfile && userProfile.petTags;
  const petWeight = userProfile && userProfile.petWeight;
  const firstName = userProfile && userProfile.firstName;
  const lastName = userProfile && userProfile.lastName;
  const phoneNumber = userProfile && userProfile.phoneNumber;
  const description = userProfile && userProfile.description;
  const petDescription = userProfile && userProfile.petDescription;
  const city = userProfile && userProfile.city;
  const state = userProfile && userProfile.state;

  const personalData = {
    firstName,
    lastName,
    phoneNumber,
    city,
    state,
    profilePic,
  };
  const petData = {
    petName,
    petAge,
    petGender,
    petTags,
    petWeight,
    petBreed,
    petVaccinated,
    petNeutered,
    petGallery,
  };
  const descriptions = { description, petDescription, firstName, petName };
  return (
    <div className="userProfile">
      <PersonalProfileSection data={personalData} />
      <PetProfileSection data={petData} />
      <AttributeSection data={petData} />
      <GallerySection data={petData} />
      <DescriptionSection data={descriptions} />
    </div>
  );
}

export default UserProfile;
