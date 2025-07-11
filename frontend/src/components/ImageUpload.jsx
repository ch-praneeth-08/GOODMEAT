import React, { useState, useRef } from 'react';
import axios from 'axios';
import './ImageUpload.css';

// This component now receives a `label` prop for better reusability.
function ImageUpload({ onUpload, value, label = "Product Image" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const sigResponse = await axios.get('http://localhost:5000/upload/signature', { withCredentials: true });
      const { signature, timestamp } = sigResponse.data;
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;
      const cloudinaryResponse = await axios.post(cloudinaryUrl, formData);

      onUpload(cloudinaryResponse.data.secure_url);

    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload-container">
      {/* The label is now dynamic */}
      <label>{label}</label> 
      <div className="image-preview-wrapper">
        {value ? (
          <img src={value} alt="Preview" className="image-preview" />
        ) : (
          <div className="image-placeholder">No Image</div>
        )}
        
        <div className="image-upload-overlay">
          {uploading ? (
            <div className="spinner"></div>
          ) : (
            <button 
              type="button" 
              className="btn-upload" 
              onClick={() => fileInputRef.current.click()}
            >
              {value ? 'Change Image' : 'Upload Image'}
            </button>
          )}
        </div>
      </div>
      <input
        type="file"
        accept="image/png, image/jpeg, image/webp"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      {error && <p className="upload-error">{error}</p>}
    </div>
  );
}

export default ImageUpload;