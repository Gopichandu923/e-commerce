import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../redux/auth/authActions.js";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const {
    user,
    loading: isLoading,
    error,
    successMessage,
  } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(register(formData, navigate));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-5 font-sans">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-10 transition-all">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-600 text-base">
            Start your journey with us today
          </p>
        </div>

        {successMessage && (
          <div className="bg-green-500 text-white p-3 rounded-lg text-center mb-5 text-sm">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-400 text-white p-3 rounded-lg text-center mb-5 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } text-gray-700 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition`}
              placeholder="John Doe"
            />
            {errors.name && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.name}
              </span>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } text-gray-700 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition`}
              placeholder="john@example.com"
            />
            {errors.email && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.email}
              </span>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } text-gray-700 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition`}
              placeholder="Create a password"
            />
            {errors.password && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.password}
              </span>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } text-gray-700 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition`}
              placeholder="Re-enter your password"
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 rounded-lg text-white font-semibold text-base mt-4 transition ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isLoading ? (
              <div className="inline-flex justify-center items-center w-20">
                <span className="dot-bounce"></span>
                <span className="dot-bounce delay-150"></span>
                <span className="dot-bounce delay-300"></span>
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="text-center mt-6 text-gray-600 text-base">
          <p>
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-500 font-medium hover:underline"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>

      <style jsx>{`
        .dot-bounce {
          width: 10px;
          height: 10px;
          background-color: white;
          border-radius: 50%;
          display: inline-block;
          animation: bounce 1.4s infinite ease-in-out both;
          margin: 0 3px;
        }
        .delay-150 {
          animation-delay: -0.16s;
        }
        .delay-300 {
          animation-delay: -0.32s;
        }
        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default Register;
