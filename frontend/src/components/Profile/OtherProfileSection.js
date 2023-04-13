import React, { useEffect } from "react";

function OtherProfileSection({ userProfile }) {
  return (
    <div>
      <div className="personalProfileSection">
        <div>
          <h2 className="section-header">Personal Information</h2>
        </div>
        <div>
          <div className="field-line">
            <label>First Name: </label>
            {userProfile?.firstName}
          </div>
          <div className="field-line">
            <label>Last Name:</label>

            {userProfile?.lastName}
          </div>
          <div className="field-line">
            <label>City:</label>

            {userProfile?.city}
          </div>
          <div className="field-line">
            <label>State:</label>

            {userProfile?.state}
          </div>
          <div className="field-line">
            <label htmlFor="phoneNumber">Phone Number:</label>

            {userProfile?.phoneNumber}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtherProfileSection;
