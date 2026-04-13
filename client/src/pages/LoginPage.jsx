import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/auth/authActions.js";

const Login = ({ darkMode = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState({ email: false, password: false });
  const [isVisible, setIsVisible] = useState(false);

  const {
    user,
    loading: isLoading,
    error: authError,
    successMessage,
  } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleFocus = (field) => {
    setFocused({ ...focused, [field]: true });
  };

  const handleBlur = (field) => {
    setFocused({ ...focused, [field]: false });
  };

  const validateForm = () => {
    const newErrors = {};
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(login(formData, navigate));
    }
  };

  return (
    <div className="flex min-h-[100dvh]">
      {/* Left Side - Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden h-[100dvh]">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary-container/60 to-primary/40"></div>
        </div>
        
        <div className={`relative z-10 flex flex-col justify-center items-center w-full h-full px-6 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <h2 className="text-3xl md:text-4xl font-headline font-extrabold text-white tracking-tighter text-center mb-3">
            ShopEase
          </h2>
          <p className="text-white/70 font-body text-sm text-center max-w-xs leading-relaxed">
            Your one-stop shop for everything you need.
          </p>
          <div className="mt-6 flex gap-2">
            <div className="w-8 h-1 bg-secondary-fixed rounded-full"></div>
            <div className="w-5 h-1 bg-white/30 rounded-full"></div>
            <div className="w-5 h-1 bg-white/30 rounded-full"></div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/20 to-transparent rounded-tr-full"></div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-secondary/10 to-transparent rounded-bl-full"></div>
      </div>

      {/* Right Side - Form Panel */}
      <div className="w-full lg:w-1/2 flex justify-center items-center overflow-y-auto px-4 py-8">
        <div className={`w-full max-w-md transition-all duration-700 delay-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <div className="text-center mb-8">
            <span className="text-secondary font-label text-xs tracking-[0.2em] uppercase">
              Welcome Back
            </span>
            <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tighter text-primary mt-3">
              Sign In
            </h1>
          </div>

          {successMessage && (
            <div className="bg-secondary-container text-on-secondary-container p-4 rounded-lg text-center mb-6 font-label text-sm animate-pulse">
              {successMessage}
            </div>
          )}

          {authError && (
            <div className="bg-error-container text-on-error-container p-4 rounded-lg text-center mb-6 font-label text-sm animate-shake">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative group">
              <label
                htmlFor="email"
                className="block mb-2 font-label text-sm text-on-surface-variant"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => handleFocus("email")}
                onBlur={() => handleBlur("email")}
                autoComplete="off"
                className={`w-full px-4 py-3 rounded-lg bg-surface-container-highest font-body text-on-surface transition-all duration-300 focus:bg-surface-container-lowest text-sm ${
                  errors.email 
                    ? "outline outline-2 outline-error/50" 
                    : focused.email 
                      ? "outline outline-1 outline-primary/15" 
                      : "outline-0"
                } focus:outline-none`}
                placeholder="john@example.com"
              />
              <div className={`absolute right-3 top-[38px] transition-opacity duration-300 ${
                focused.email ? "opacity-100" : "opacity-0"
              }`}>
                <span className="material-symbols-outlined text-secondary">mail</span>
              </div>
              {errors.email && (
                <span className="text-error text-sm mt-1 block font-label animate-pulse">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="relative group">
              <label
                htmlFor="password"
                className="block mb-2 font-label text-sm text-on-surface-variant"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => handleFocus("password")}
                onBlur={() => handleBlur("password")}
                autoComplete="new-password"
                className={`w-full px-4 py-3 rounded-lg bg-surface-container-highest font-body text-on-surface transition-all duration-300 focus:bg-surface-container-lowest text-sm ${
                  errors.password 
                    ? "outline outline-2 outline-error/50" 
                    : focused.password 
                      ? "outline outline-1 outline-primary/15" 
                      : "outline-0"
                } focus:outline-none`}
                placeholder="Enter your password"
              />
              <div className={`absolute right-3 top-[38px] transition-opacity duration-300 ${
                focused.password ? "opacity-100" : "opacity-0"
              }`}>
                <span className="material-symbols-outlined text-secondary">lock</span>
              </div>
              {errors.password && (
                <span className="text-error text-sm mt-1 block font-label animate-pulse">
                  {errors.password}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 mr-3 cursor-pointer accent-secondary"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-on-surface-variant cursor-pointer font-label"
                >
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-secondary hover:text-on-secondary transition-colors font-label hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg text-white font-label text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 ${
                isLoading
                  ? "bg-surface-container-high text-on-surface-variant cursor-not-allowed"
                  : "btn-gradient hover:opacity-90 hover:-translate-y-0.5"
              }`}
            >
              {isLoading ? (
                <div className="inline-flex justify-center items-center gap-1">
                  <span className="dot-bounce bg-current"></span>
                  <span className="dot-bounce delay-150 bg-current"></span>
                  <span className="dot-bounce delay-300 bg-current"></span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="text-center mt-10">
            <span className="text-on-surface-variant font-body">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-secondary font-bold hover:text-on-secondary transition-colors hover:underline"
              >
                Sign Up
              </Link>
            </span>
          </div>
          
          {/* Mobile Image Badge */}
          <div className="lg:hidden mt-6 relative h-32 rounded-xl overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
            </div>
            <div className="absolute bottom-3 left-4">
              <p className="text-white font-headline font-bold text-sm">ShopEase</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;