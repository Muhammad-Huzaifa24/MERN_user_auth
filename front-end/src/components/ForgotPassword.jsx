import React, { useState } from "react";
import { sendForgotPasswordEmail } from "../services/userService";
import Loader from "./Loader";
import { toast } from "react-hot-toast";

const ForgotPasswordModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendForgotPasswordEmail(email);
      toast.success("New password sent to your email");
      onClose();
    } catch (error) {
      console.error("Error sending forgot password email:", error.message);
      toast.error("Failed to send new password: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-pass-modal">
      <div className="forgot-pass-modal-content">
        <span className="forgot-pass-close-button" onClick={onClose}>
          &times;
        </span>

        <h3>Forgot Password</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            {loading ? <Loader /> : "Submit"}
          </button>
          <p>Check your email and reset your password</p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
