import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useUserStore from "../hooks/useUserData";
import LoginSvg from "../assets/LoginIcon";
import { loginWithGoogle } from "../services/userService";

const FormCard = ({ title, children }) => {
  const { setUser } = useUserStore();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (response) => {
    console.log("inside handle google sign in");
    const googleToken = response.credential;
    try {
      const { token, user } = await loginWithGoogle(googleToken);

      setUser(user);
      login(token);

      localStorage.setItem("loginType", "google");
      localStorage.setItem("token", token);
      localStorage.setItem("userName", user.name);

      navigate("/home");
      toast.success("Login with Google Successfully");
    } catch (error) {
      toast.error(
        "Login with Google Failed: " + (error.message || "Something went wrong")
      );
    }
  };

  const handleGoogleError = () => {
    toast.error("Login with Google Failed");
  };
  return (
    <div className="form-card">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "2rem",
        }}
      >
        <h2>{title}</h2>
        <LoginSvg />
      </div>
      <div className="form-content">
        {children}
        <p style={{ margin: "10px" }}>or</p>
        <div className="social-login">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>
      </div>
    </div>
  );
};

export default FormCard;
