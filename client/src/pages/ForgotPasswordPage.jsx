import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ForgotPassword } from "../Api.js";
import toast from "react-hot-toast";

const ForgotPasswordPage = ({ darkMode = false }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      await ForgotPassword(email);
      setEmailSent(true);
      toast.success("Password reset link sent to your email!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className={`max-w-md w-full rounded-lg shadow-lg p-8 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="text-center mb-6">
          <Link to="/login" className="text-2xl font-bold text-blue-600">ShopEase</Link>
          <h2 className={`text-xl font-semibold mt-4 ${darkMode ? "text-white" : "text-gray-800"}`}>Forgot Password</h2>
          <p className={`text-sm mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Enter your email to receive a password reset link
          </p>
        </div>

        {emailSent ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✓</span>
            </div>
            <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Check your email for the reset link. The link expires in 30 minutes.
            </p>
            <Link to="/login" className="inline-block mt-4 text-blue-500 hover:underline">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                }`}
                placeholder="Enter your email"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="text-center">
              <Link to="/login" className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} hover:text-blue-500`}>
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;