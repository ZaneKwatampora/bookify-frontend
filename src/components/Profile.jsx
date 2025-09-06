import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import getBaseUrl from '../utils/baseURL';

const UserProfile = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const [imageFileName, setImageFileName] = useState(currentUser?.profilePicture || '');

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentUser?._id) return;
  
    const formData = new FormData();
    formData.append('profilePicture', file);
    formData.append('userId', currentUser._id);
  
    try {
      const res = await axios.put('http://localhost:5000/api/auth/profile-picture', formData);
      setCurrentUser(res.data.updatedUser); // Make sure your backend returns this
    } catch (err) {
      console.error('Upload failed', err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Edit Profile Picture</h2>

      <img
        src={
          imageFileName ||
          'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
        }
        alt="Profile"
        className="w-24 h-24 object-cover rounded-full mb-4"
      />

      <input type="file" accept="image/*" onChange={handleImageChange} />
      {imageFileName && (
        <p className="text-sm text-gray-600 mt-2">
          Saved as: <code>{imageFileName}</code>
        </p>
      )}
    </div>
  );
};

export default UserProfile;