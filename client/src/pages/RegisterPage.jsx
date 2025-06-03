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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user types
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
    var response;
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      response = await axios.post("http://localhost:4040/api/user", formData);

      if (response.status === 201) {
        const user = response.data;
        localStorage.setItem("token", user.token);
      }
      setSuccessMessage(
        "Account created successfully! Redirecting to login..."
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.log(error);
      setErrors({
        general: error.response.data.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Styles defined as objects
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#f5f7fa",
      padding: "20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    card: {
      width: "100%",
      maxWidth: "450px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      padding: "40px",
      transition: "all 0.3s ease",
    },
    header: {
      textAlign: "center",
      marginBottom: "30px",
    },
    title: {
      fontSize: "28px",
      fontWeight: "600",
      color: "#2d3748",
      marginBottom: "8px",
    },
    subtitle: {
      fontSize: "16px",
      color: "#718096",
      fontWeight: "400",
    },
    formGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "500",
      color: "#4a5568",
      fontSize: "14px",
    },
    input: {
      width: "100%",
      padding: "12px 15px",
      borderRadius: "8px",
      border: "1px solid #e2e8f0",
      fontSize: "16px",
      color: "#2d3748",
      backgroundColor: "#f8fafc",
      transition: "border-color 0.3s, box-shadow 0.3s",
    },
    inputFocus: {
      borderColor: "#4299e1",
      boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.2)",
      outline: "none",
    },
    errorText: {
      color: "#e53e3e",
      fontSize: "14px",
      marginTop: "5px",
      display: "block",
    },
    button: {
      width: "100%",
      padding: "14px",
      backgroundColor: "#4299e1",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background-color 0.3s, transform 0.2s",
      marginTop: "10px",
    },
    buttonHover: {
      backgroundColor: "#3182ce",
    },
    buttonDisabled: {
      backgroundColor: "#a0aec0",
      cursor: "not-allowed",
    },
    footer: {
      textAlign: "center",
      marginTop: "25px",
      color: "#718096",
      fontSize: "15px",
    },
    link: {
      color: "#4299e1",
      textDecoration: "none",
      fontWeight: "500",
    },
    successMessage: {
      backgroundColor: "#48bb78",
      color: "white",
      padding: "12px",
      borderRadius: "8px",
      textAlign: "center",
      marginBottom: "20px",
      fontSize: "14px",
    },
    errorMessage: {
      backgroundColor: "#fc8181",
      color: "white",
      padding: "12px",
      borderRadius: "8px",
      textAlign: "center",
      marginBottom: "20px",
      fontSize: "14px",
    },
    loadingDots: {
      display: "inline-block",
      width: "80px",
      textAlign: "center",
    },
    dot: {
      display: "inline-block",
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      backgroundColor: "white",
      margin: "0 3px",
      animation: "bounce 1.4s infinite ease-in-out both",
    },
    dot1: { animationDelay: "-0.32s" },
    dot2: { animationDelay: "-0.16s" },
    keyframes: `@keyframes bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1.0); }
    }`,
  };

  return (
    <div style={styles.container}>
      <style>{styles.keyframes}</style>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Create an Account</h1>
          <p style={styles.subtitle}>
            Join us today to unlock exclusive features
          </p>
        </div>

        {successMessage && (
          <div style={styles.successMessage}>{successMessage}</div>
        )}

        {errors.general && (
          <div style={styles.errorMessage}>{errors.general}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="name" style={styles.label}>
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.name ? { borderColor: "#e53e3e" } : {}),
                ...(document.activeElement ===
                  document.getElementById("name") && !errors.name
                  ? styles.inputFocus
                  : {}),
              }}
              placeholder="John Doe"
            />
            {errors.name && <span style={styles.errorText}>{errors.name}</span>}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.email ? { borderColor: "#e53e3e" } : {}),
                ...(document.activeElement ===
                  document.getElementById("email") && !errors.email
                  ? styles.inputFocus
                  : {}),
              }}
              placeholder="john@example.com"
            />
            {errors.email && (
              <span style={styles.errorText}>{errors.email}</span>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.password ? { borderColor: "#e53e3e" } : {}),
                ...(document.activeElement ===
                  document.getElementById("password") && !errors.password
                  ? styles.inputFocus
                  : {}),
              }}
              placeholder="At least 6 characters"
            />
            {errors.password && (
              <span style={styles.errorText}>{errors.password}</span>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.confirmPassword ? { borderColor: "#e53e3e" } : {}),
                ...(document.activeElement ===
                  document.getElementById("confirmPassword") &&
                !errors.confirmPassword
                  ? styles.inputFocus
                  : {}),
              }}
              placeholder="Re-enter your password"
            />
            {errors.confirmPassword && (
              <span style={styles.errorText}>{errors.confirmPassword}</span>
            )}
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              ...(isLoading ? styles.buttonDisabled : {}),
              ...(!isLoading && !successMessage
                ? { ":hover": styles.buttonHover }
                : {}),
            }}
            disabled={isLoading || successMessage}
          >
            {isLoading ? (
              <div style={styles.loadingDots}>
                <span style={{ ...styles.dot, ...styles.dot1 }}></span>
                <span style={{ ...styles.dot, ...styles.dot2 }}></span>
                <span style={styles.dot}></span>
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div style={styles.footer}>
          Already have an account?{" "}
          <a
            href="/login"
            style={styles.link}
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
          >
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
