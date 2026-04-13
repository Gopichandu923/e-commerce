import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { VerifyEmail } from "../Api.js";
import toast from "react-hot-toast";

const VerifyEmailPage = ({ darkMode = false }) => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        toast.error("Invalid verification link");
        setLoading(false);
        return;
      }

      try {
        await VerifyEmail(token);
        setVerified(true);
        toast.success("Email verified successfully!");
        setTimeout(() => navigate("/login"), 3000);
      } catch (err) {
        toast.error(err.response?.data?.message || "Verification failed");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className={`max-w-md w-full rounded-lg shadow-lg p-8 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>Verifying your email...</p>
          </div>
        ) : verified ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-green-600">✓</span>
            </div>
            <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>Email Verified!</h2>
            <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Your email has been verified successfully. Redirecting to login...
            </p>
            <Link to="/login" className="inline-block mt-4 text-blue-500 hover:underline">
              Go to Login
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-red-600">✕</span>
            </div>
            <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>Verification Failed</h2>
            <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              The verification link is invalid or expired.
            </p>
            <div className="mt-4 space-y-2">
              <Link to="/register" className="block text-blue-500 hover:underline">
                Register Again
              </Link>
              <Link to="/login" className="block text-blue-500 hover:underline">
                Go to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;