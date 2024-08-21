import React, { useState } from "react";
import FormCard from "./FormCard";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/userService";
import useUserStore from "../hooks/useUserData";
import ForgotPasswordModal from "./ForgotPassword";

const LoginForm = () => {
  const { setUser } = useUserStore();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { token, user } = await loginUser(formData);

      login(token);
      setUser(user);

      localStorage.setItem("loginType", "Manual");
      localStorage.setItem("token", token);
      localStorage.setItem("userName", user.name);

      navigate("/home");
      toast.success("Login Successfully");
    } catch (error) {
      console.error("Error logging in:", error);
      setTimeout(() => {
        toast.error("Login Failed: " + error.message);
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <FormCard title="Login">
          <form>
            <div className="form-row">
              <div className="form-group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="submit-button"
              onClick={handleSubmit}
            >
              Login
            </button>
            <div
              className="forgot-password"
              style={{ marginTop: "5px", width: "100%" }}
            >
              <a href="#" onClick={() => setShowForgotPasswordModal(true)}>
                forgot password?
              </a>
            </div>
            <p>{showForgotPasswordModal}</p>
            <div className="switch-to-login-signup">
              <Link to="/signup">Create new account</Link>
            </div>
          </form>
        </FormCard>
      )}
      {showForgotPasswordModal && (
        <ForgotPasswordModal
          onClose={() => setShowForgotPasswordModal(false)}
        />
      )}
    </>
  );
};

export default LoginForm;
