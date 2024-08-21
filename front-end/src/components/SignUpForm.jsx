import React, { useState } from "react";
import FormCard from "./FormCard";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { signUpUser } from "../services/userService";

const SignupForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    profilePicture: null,
  });

  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]:
        type === "checkbox"
          ? e.target.checked
          : type === "file"
          ? files[0]
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match", {
        style: {
          background: "#dfd4d4",
        },
        duration: 1000,
      });
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("gender", formData.gender);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("age", String(formData.age));
    data.append("profilePicture", formData.profilePicture);

    try {
      setUploading(true);
      const response = await signUpUser(data);
      navigate("/");
      toast.success("Sign Up Successfully");
    } catch (error) {
      console.error("Error signing up", error.message);
      toast.error("Sign Up Failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <FormCard title="Sign Up">
      <form>
        <div className="form-row">
          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your Name"
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <input
              type="text"
              name="age"
              id="age"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="age"
              required
            />
          </div>
          <div className="form-group">
            <select
              name="gender"
              id="gender"
              value={formData.gender}
              onChange={handleInputChange}
            >
              <option value="">Select your gender</option>
              <option value="male">male</option>
              <option value="female">female</option>
              <option value="other">other</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              id="confirm-password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              required
            />
          </div>
        </div>
        <input
          style={{
            width: "100%",
            marginTop: "1rem",
            background: "#f2ebfd",
          }}
          type="file"
          name="profilePicture"
          accept="image/*"
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="submit-button"
          onClick={handleSubmit}
          disabled={uploading}
        >
          {uploading ? "Signing Up..." : "Sign Up"}
        </button>
        <div className="switch-to-login-signup">
          <span>Already have an account?</span>
          <Link to="/">Login</Link>
        </div>
      </form>
    </FormCard>
  );
};

export default SignupForm;
