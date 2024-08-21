import axios from "axios";

// const API_URL = "http://localhost:3001/api";
const API_URL = "https://mern-user-auth.vercel.app/api";
// const API_URL = process.env.REACT_APP_API_URL_REMOTE;

// signup user

export const signUpUser = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    throw new Error("Error signing up user");
  }
};

// login user

export const loginUser = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, formData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// login user with google

export const loginWithGoogle = async (googleToken) => {
  console.log("inside user service");
  console.log("token", googleToken);
  try {
    console.log("inside try block");
    const response = await axios.post(`${API_URL}/google-login`, {
      googleToken,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// fetch user by name

export const fetchUserByName = async (userName) => {
  try {
    const response = await axios.get(`${API_URL}/users/name/${userName}`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching user by name");
  }
};

// fetch all users

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching users");
  }
};

// update user

export const updateUserByName = async (userName, userData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found");
    }
    const response = await axios.patch(
      `${API_URL}/users/name/${userName}`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error.message);
    throw new Error("Error updating user");
  }
};

// verify token

export const verifyToken = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/check-auth`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.isAuthenticated;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error("Authentication failed");
    }
    throw error;
  }
};

// profile pic

export const uploadProfilePicture = async (selectedFile) => {
  const formData = new FormData();
  formData.append("profilePicture", selectedFile);

  try {
    const response = await axios.post(
      `${API_URL}/upload-profile-picture`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data.url;
  } catch (error) {
    console.error("Error uploading profile picture:", error.message);
    throw error;
  }
};

export const changePassword = async (oldPassword, newPassword) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      `${API_URL}/change-password`,
      { oldPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendForgotPasswordEmail = async (email) => {
  const response = await axios.post(`${API_URL}/forgot-password`, { email });
  return response.data;
};
