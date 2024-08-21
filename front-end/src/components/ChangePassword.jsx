import React, { useState } from "react";
import axios from "axios";
import { changePassword } from "../services/userService";
import { toast } from "react-hot-toast";

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    try {
      const data = await changePassword(oldPassword, newPassword);

      toast.success("Password has been changed!");
      onClose();
    } catch (error) {
      if (error.response && error.response.data) {
        setPasswordError(error.response.data.message);
        console.log(error.message);
      } else {
        console.error("Error changing password:", error.message);
        setPasswordError("An error occurred while changing password.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="password-modal-overlay">
      <div className="password-modal-content">
        <h2 className="password-h2">Change Password</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePasswordSubmit();
          }}
        >
          <div className="password-form-group">
            <input
              placeholder="Old password"
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div className="password-form-group">
            <input
              placeholder="New password"
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="password-form-group">
            <input
              placeholder="Confirm password"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {passwordError && (
            <div className="password-error">{passwordError}</div>
          )}
          <div className="password-form-actions">
            <button type="submit">Change Password</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
