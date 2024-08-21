import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Loader from "../components/Loader";
import UserList from "./UserList";
import UserProfile from "./UserProfile";
import ChangeProfilePictureModal from "./ChangeProfilePic";
import useUserStore from "../hooks/useUserData";
import LogoutSvg from "../assets/LogoutIcon";

const Profile = () => {
  const [selectedItem, setSelectedItem] = useState("#profile");
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState(false);
  const [userProfile, setUserProfile] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, fetchUser, fetchAllUsers } = useUserStore();
  const navigate = useNavigate();

  const name = localStorage.getItem("userName");

  useEffect(() => {
    if (name) {
      fetchUser(name);
      fetchAllUsers();
    } else {
      navigate("/");
    }
  }, [navigate, fetchUser]);

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.clear();
      navigate("/");
      toast.success("Logged out successfully!");
    }, 1000);
  };

  const handleChangeMenuItem = (item) => {
    setSelectedItem(item);
    setMenuOpen(false);
    setUserList(item === "#users");
    setUserProfile(item === "#profile");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleProfilePicClick = () => {
    setIsModalOpen(true);
  };

  const handleUpdateProfilePicture = () => {
    console.log("name", user.name);
    fetchUser(user.name);
    fetchAllUsers();
  };

  return (
    <div className="profile-container">
      <header className="header">
        <img
          src={user?.profilePicture}
          alt="Profile"
          className="profile-picture"
          onClick={handleProfilePicClick}
        />
        <p className="user-name">{user?.name}</p>
        <nav className={`nav-menu ${menuOpen ? "open" : ""}`}>
          <div className="menu-div">
            <a
              href="#profile"
              className={selectedItem === "#profile" ? "active" : ""}
              onClick={() => handleChangeMenuItem("#profile")}
            >
              Profile
            </a>
            <a
              href="#users"
              className={selectedItem === "#users" ? "active" : ""}
              onClick={() => handleChangeMenuItem("#users")}
            >
              Users
            </a>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
            <LogoutSvg />
          </button>
        </nav>
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
      </header>

      <main className="content">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {userList && <UserList />}
            {userProfile && <UserProfile />}
          </>
        )}
      </main>
      <ChangeProfilePictureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUpdateProfilePicture}
      />
    </div>
  );
};

export default Profile;
