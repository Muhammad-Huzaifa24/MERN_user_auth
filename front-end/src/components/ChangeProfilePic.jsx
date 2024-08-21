import React, { useState } from "react";
import Loader from "./Loader";
import { uploadProfilePicture } from "../services/userService";

const ChangeProfilePictureModal = ({ isOpen, onClose, onUpdate }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      setLoading(true);

      try {
        const uploadedUrl = await uploadProfilePicture(selectedFile);
        onUpdate(uploadedUrl);
        onClose();
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Change Profile Picture</h2>
        {loading ? (
          <Loader />
        ) : (
          <>
            {preview ? (
              <img src={preview} alt="Preview" className="image-preview" />
            ) : (
              <p>No file selected</p>
            )}
            <input type="file" onChange={handleFileChange} />
            <div className="upload-close-btn-div">
              <button className="upload-btn" onClick={handleUpload}>
                Upload
              </button>
              <button className="close-btn" onClick={onClose}>
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChangeProfilePictureModal;
