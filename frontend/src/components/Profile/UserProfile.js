import React, { useState, useEffect } from "react";
import PersonalProfileSection from "./PersonalProfileSection";
import PetProfileSection from "./PetProfileSection";
import DescriptionSection from "./DescriptionSection";
import GallerySection from "./GallerySection";
import AttributeSection from "./AttributeSection";

function UserProfile({ userProfile, updateUserProfile }) {
  const {
    petName,
    petBreed,
    petVaccinated,
    petNeutered,
    petAge,
    petGender,
    petTags,
    petWeight,
    firstName,
    lastName,
    phoneNumber,
    description,
    petDescription,
    city,
    state,
  } = userProfile;
  const personalData = { firstName, lastName, phoneNumber, city, state };
  const petData = {
    petName,
    petAge,
    petGender,
    petTags,
    petWeight,
    petBreed,
    petVaccinated,
    petNeutered,
  };
  const descriptions = { description, petDescription, firstName, petName };
  return (
    <div className="userProfile">
      <PersonalProfileSection data={personalData} />
      <PetProfileSection data={petData} />
      <AttributeSection data={petData} />
      <GallerySection data={userProfile} />
      <DescriptionSection data={descriptions} />
    </div>
  );
}

export default UserProfile;
