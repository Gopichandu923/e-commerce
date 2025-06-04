// src/components/Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:4040/api/user",
        formData
      );

      if (response.status === 201) {
        const user = response.data;
        localStorage.setItem("token", user.token);
        setSuccessMessage(
          "Account created successfully! Redirecting to login..."
        );
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      setErrors({
        general:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Create an Account
          </h1>
          <p className="text-gray-600">
            Join us today to unlock exclusive features
          </p>
        </div>

        {successMessage && (
          <div className="bg-green-500 text-white p-3 rounded-lg mb-6 text-center">
            {successMessage}
          </div>
        )}

        {errors.general && (
          <div className="bg-red-500 text-white p-3 rounded-lg mb-6 text-center">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              autoComplete="off"
              value={formData.name}
              onChange={handleChange}
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.name
                  ? "border-red-500"
                  : focusedField === "name"
                  ? "border-blue-500"
                  : "border-gray-300"
              } focus:outline-none bg-gray-50`}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="off"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.email
                  ? "border-red-500"
                  : focusedField === "email"
                  ? "border-blue-500"
                  : "border-gray-300"
              } focus:outline-none bg-gray-50`}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.password
                  ? "border-red-500"
                  : focusedField === "password"
                  ? "border-blue-500"
                  : "border-gray-300"
              } focus:outline-none bg-gray-50`}
              placeholder="At least 6 characters"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onFocus={() => setFocusedField("confirmPassword")}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.confirmPassword
                  ? "border-red-500"
                  : focusedField === "confirmPassword"
                  ? "border-blue-500"
                  : "border-gray-300"
              } focus:outline-none bg-gray-50`}
              placeholder="Re-enter your password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || successMessage}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
              isLoading || successMessage
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
