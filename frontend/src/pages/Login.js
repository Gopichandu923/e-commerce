import React, { useState } from "react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      // Simulate API call
      console.log("Form submitted:", formData);
      setTimeout(() => {
        setIsSubmitting(false);
        alert("Login successful!");
      }, 1000);
    }
  };

  return (
    <div className="login-container">
      <div className="form-wrapper">
        <div>
          <h2>Sign in to your account</h2>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "input error" : "input"}
                placeholder="Email address"
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "input error" : "input"}
                placeholder="Password"
              />
              {errors.password && (
                <p className="error-text">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="form-options">
            <div className="checkbox-group">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="checkbox"
              />
              <label htmlFor="remember-me" className="checkbox-label">
                Remember me
              </label>
            </div>
            {/*
            <div className="link">
              <a href="/register" className="link-text">
                Forgot your password?
              </a>
            </div> */}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={isSubmitting ? "button submitting" : "button"}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="spinner"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="spinner-circle"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="spinner-path"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>
        <div className="signup-link">
          <p>
            Don't have an account?{" "}
            <a href="/register" className="link-text">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
