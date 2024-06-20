import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import './profileManagement.css';

const Profile = () => {
    return (
      <div className="profile-container">
        <h1>Profile Management</h1>
      </div>
    );
  };
  
  export default Profile;