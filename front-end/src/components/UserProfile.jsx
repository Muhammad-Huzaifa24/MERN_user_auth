import React, { useState, useEffect } from "react";
import useUserStore from "../hooks/useUserData";
import ChangeProfilePictureModal from "./ChangeProfilePic";
import ChangePasswordModal from "./ChangePassword";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableUser, setEditableUser] = useState({});
  const [originalUser, setOriginalUser] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangePasswordClick = () => {
    setIsChangingPassword(true);
  };

  const handleCloseModal = () => {
    setIsChangingPassword(false);
  };

  const { user, fetchUser, saveUser } = useUserStore();

  const userName = localStorage.getItem("userName");
  const loginType = localStorage.getItem("loginType");

  useEffect(() => {
    if (userName) {
      fetchUser(userName);
    }
  }, [userName, fetchUser]);

  useEffect(() => {
    if (user) {
      setEditableUser(user);
      setOriginalUser(user);
    }
  }, [user]);

  const handleSaveClick = async () => {
    if (JSON.stringify(originalUser) === JSON.stringify(editableUser)) {
      setIsEditing(false);
      return;
    }
    if (userName !== editableUser.name) {
      localStorage.setItem("userName", editableUser.name);
    }
    const { password, ...userWithoutPassword } = editableUser;
    const userData = { ...userWithoutPassword, loginType };

    await saveUser(userName, userData);
    setIsEditing(false);
    await fetchUser(userName);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleProfilePicClick = () => {
    setIsModalOpen(true);
  };

  const handleUpdateProfilePicture = () => {
    fetchUser(userName);
  };
  const handleCancelClick = () => {
    setIsEditing(false);
  };

  return (
    <>
      <div className="user-profile-card">
        <div className="user-profile-avatar">
          <img
            src={user?.profilePicture}
            alt={user?.name}
            onClick={handleProfilePicClick}
          />
        </div>
        <div className="user-profile-info">
          <div className="user-profile-field">
            <label>Name:</label>
            {isEditing ? (
              <input
                id="user-name"
                type="text"
                name="name"
                value={editableUser.name || ""}
                onChange={handleChange}
              />
            ) : (
              <span>{user?.name}</span>
            )}
          </div>
          <div className="user-profile-field">
            <label>Email:</label>
            {isEditing ? (
              <input
                id="user-email"
                type="email"
                name="email"
                value={editableUser.email || ""}
                onChange={handleChange}
              />
            ) : (
              <span>{user?.email}</span>
            )}
          </div>
          <div className="user-profile-field">
            <label>Age:</label>
            {isEditing ? (
              <input
                type="number"
                name="age"
                id="number"
                value={editableUser.age || ""}
                onChange={handleChange}
              />
            ) : (
              <span>{user?.age}</span>
            )}
          </div>
          <div className="user-profile-field">
            <label>Gender:</label>
            {isEditing ? (
              <select
                name="gender"
                value={editableUser.gender || ""}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <span>{user?.gender}</span>
            )}
          </div>
          <div>
            {loginType === "Manual" ? (
              <div>
                <a href="#" onClick={handleChangePasswordClick}>
                  Change your password
                </a>
              </div>
            ) : null}
          </div>
          <div className="user-profile-actions">
            {isEditing ? (
              <div className="profile-save-cancel-btn">
                <button className="save-btn" onClick={handleSaveClick}>
                  Save
                </button>
                <button className="cancel-btn" onClick={handleCancelClick}>
                  Cancel
                </button>
              </div>
            ) : (
              <button className="edit-btn" onClick={handleEditClick}>
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
      <ChangeProfilePictureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUpdateProfilePicture}
      />
      <ChangePasswordModal
        isOpen={isChangingPassword}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default UserProfile;
