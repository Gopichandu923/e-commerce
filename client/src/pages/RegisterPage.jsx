import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../redux/auth/authActions.js";

const Register = ({ darkMode = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState({ name: false, email: false, password: false, confirmPassword: false });
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
    <div className="flex min-h-[100dvh]">
      {/* Left Side - Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden h-[100dvh]">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1616486338812-953d86f1d5e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary-container/60 to-primary/40"></div>
        </div>
        
        <div className={`relative z-10 flex flex-col justify-center items-center w-full h-full px-8 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-white tracking-tighter text-center mb-4">
            THE ATELIER
          </h2>
          <p className="text-white/80 font-body text-base text-center max-w-sm leading-relaxed">
            Join our exclusive community of collectors. Begin your journey to refined living.
          </p>
          <div className="mt-8 flex gap-2">
            <div className="w-6 h-1 bg-white/30 rounded-full"></div>
            <div className="w-10 h-1 bg-secondary-fixed rounded-full"></div>
            <div className="w-6 h-1 bg-white/30 rounded-full"></div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-secondary/20 to-transparent rounded-br-full"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-secondary/10 to-transparent rounded-tl-full"></div>
      </div>

      {/* Right Side - Form Panel */}
      <div className="w-full lg:w-1/2 flex justify-center items-center overflow-y-auto px-3 py-4">
        <div className={`w-full max-w-md transition-all duration-700 delay-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <div className="text-center mb-6">
            <span className="text-secondary font-label text-xs tracking-[0.2em] uppercase">
              Join the Atelier
            </span>
            <h1 className="text-3xl md:text-4xl font-headline font-extrabold tracking-tighter text-primary mt-2">
              Create Account
            </h1>
            <p className="text-on-surface-variant font-body mt-1 text-xs">
              Begin your journey with us today
            </p>
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

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <label
                htmlFor="name"
                className="block mb-1.5 font-label text-xs text-on-surface-variant"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => handleFocus("name")}
                onBlur={() => handleBlur("name")}
                autoComplete="off"
                className={`w-full px-3 py-2.5 rounded-lg bg-surface-container-highest font-body text-on-surface transition-all duration-300 focus:bg-surface-container-lowest text-xs ${
                  errors.name 
                    ? "outline outline-2 outline-error/50" 
                    : focused.name 
                      ? "outline outline-1 outline-primary/15" 
                      : "outline-0"
                } focus:outline-none`}
                placeholder="John Doe"
              />
              <div className={`absolute right-3 top-[33px] transition-opacity duration-300 ${
                focused.name ? "opacity-100" : "opacity-0"
              }`}>
                <span className="material-symbols-outlined text-secondary text-sm">person</span>
              </div>
              {errors.name && (
                <span className="text-error text-sm mt-1 block font-label animate-pulse">
                  {errors.name}
                </span>
              )}
            </div>

            <div className="relative">
              <label
                htmlFor="email"
                className="block mb-1.5 font-label text-xs text-on-surface-variant"
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
                className={`w-full px-3 py-2.5 rounded-lg bg-surface-container-highest font-body text-on-surface transition-all duration-300 focus:bg-surface-container-lowest text-xs ${
                  errors.email 
                    ? "outline outline-2 outline-error/50" 
                    : focused.email 
                      ? "outline outline-1 outline-primary/15" 
                      : "outline-0"
                } focus:outline-none`}
                placeholder="john@example.com"
              />
              <div className={`absolute right-3 top-[33px] transition-opacity duration-300 ${
                focused.email ? "opacity-100" : "opacity-0"
              }`}>
                <span className="material-symbols-outlined text-secondary text-sm">mail</span>
              </div>
              {errors.email && (
                <span className="text-error text-sm mt-1 block font-label animate-pulse">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="block mb-1.5 font-label text-xs text-on-surface-variant"
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
                className={`w-full px-3 py-2.5 rounded-lg bg-surface-container-highest font-body text-on-surface transition-all duration-300 focus:bg-surface-container-lowest text-xs ${
                  errors.password 
                    ? "outline outline-2 outline-error/50" 
                    : focused.password 
                      ? "outline outline-1 outline-primary/15" 
                      : "outline-0"
                } focus:outline-none`}
                placeholder="Create a password"
              />
<div className={`absolute right-3 top-[33px] transition-opacity duration-300 ${
                focused.password ? "opacity-100" : "opacity-0"
              }`}>
                <span className="material-symbols-outlined text-secondary text-sm">lock</span>
              </div>
              {errors.password && (
                <span className="text-error text-sm mt-1 block font-label animate-pulse">
                  {errors.password}
                </span>
              )}
            </div>

            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="block mb-1.5 font-label text-xs text-on-surface-variant"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onFocus={() => handleFocus("confirmPassword")}
                onBlur={() => handleBlur("confirmPassword")}
                autoComplete="new-password"
                className={`w-full px-3 py-2.5 rounded-lg bg-surface-container-highest font-body text-on-surface transition-all duration-300 focus:bg-surface-container-lowest text-xs ${
                  errors.confirmPassword 
                    ? "outline outline-2 outline-error/50" 
                    : focused.confirmPassword 
                      ? "outline outline-1 outline-primary/15" 
                      : "outline-0"
                } focus:outline-none`}
                placeholder="Re-enter your password"
              />
<div className={`absolute right-3 top-[33px] transition-opacity duration-300 ${
                focused.confirmPassword ? "opacity-100" : "opacity-0"
              }`}>
                <span className="material-symbols-outlined text-secondary text-sm">lock</span>
              </div>
              {errors.confirmPassword && (
                <span className="text-error text-sm mt-1 block font-label animate-pulse">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 rounded-lg text-white font-label text-xs tracking-[0.15em] uppercase transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 ${
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
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center mt-10">
            <span className="text-on-surface-variant font-body">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-secondary font-bold hover:text-on-secondary transition-colors hover:underline"
              >
                Sign In
              </Link>
            </span>
          </div>

          {/* Mobile Image Badge */}
          <div className="lg:hidden mt-6 relative h-32 rounded-xl overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1616486338812-953d86f1d5e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
            </div>
            <div className="absolute bottom-3 left-4">
              <p className="text-white font-headline font-bold text-sm">THE ATELIER</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;