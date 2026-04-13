import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ResetPassword } from "../Api.js";
import toast from "react-hot-toast";

const ResetPasswordPage = ({ darkMode = false }) => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focused, setFocused] = useState({ password: false, confirmPassword: false });

  useEffect(() => {
    if (!token) {
      toast.error("Invalid reset link");
      navigate("/forgot-password");
    }
  }, [token, navigate]);

  const handleFocus = (field) => {
    setFocused({ ...focused, [field]: true });
  };

  const handleBlur = (field) => {
    setFocused({ ...focused, [field]: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password) {
      toast.error("Please enter a password");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await ResetPassword(token, password);
      setSuccess(true);
      toast.success("Password reset successful!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh]">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden h-[100dvh]">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary-container/60 to-primary/40"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full h-full px-6">
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

        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/20 to-transparent rounded-tr-full"></div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-secondary/10 to-transparent rounded-bl-full"></div>
      </div>

      <div className="w-full lg:w-1/2 flex justify-center items-center overflow-y-auto px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <span className="text-secondary font-label text-xs tracking-[0.2em] uppercase">
              Reset Password
            </span>
            <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tighter text-primary mt-3">
              New Password
            </h1>
          </div>

          {success ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary-container rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-4xl text-secondary">check_circle</span>
              </div>
              <p className="text-on-surface font-body text-sm mb-2">
                Your password has been reset successfully!
              </p>
              <p className="text-on-surface-variant font-body text-sm mb-4">
                Redirecting to login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative group">
                <label
                  htmlFor="password"
                  className="block mb-2 font-label text-sm text-on-surface-variant"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => handleFocus("password")}
                  onBlur={() => handleBlur("password")}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 rounded-lg bg-surface-container-highest font-body text-on-surface transition-all duration-300 focus:bg-surface-container-lowest text-sm outline outline-1 outline-primary/15 focus:outline-none"
                  placeholder="Enter new password"
                />
                <div className={`absolute right-3 top-[38px] transition-opacity duration-300 ${
                  focused.password ? "opacity-100" : "opacity-0"
                }`}>
                  <span className="material-symbols-outlined text-secondary">lock</span>
                </div>
              </div>

              <div className="relative group">
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 font-label text-sm text-on-surface-variant"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => handleFocus("confirmPassword")}
                  onBlur={() => handleBlur("confirmPassword")}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 rounded-lg bg-surface-container-highest font-body text-on-surface transition-all duration-300 focus:bg-surface-container-lowest text-sm outline outline-1 outline-primary/15 focus:outline-none"
                  placeholder="Confirm new password"
                />
                <div className={`absolute right-3 top-[38px] transition-opacity duration-300 ${
                  focused.confirmPassword ? "opacity-100" : "opacity-0"
                }`}>
                  <span className="material-symbols-outlined text-secondary">lock</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg text-white font-label text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 ${
                  loading
                    ? "bg-surface-container-high text-on-surface-variant cursor-not-allowed"
                    : "btn-gradient hover:opacity-90 hover:-translate-y-0.5"
                }`}
              >
                {loading ? (
                  <div className="inline-flex justify-center items-center gap-1">
                    <span className="dot-bounce bg-current"></span>
                    <span className="dot-bounce delay-150 bg-current"></span>
                    <span className="dot-bounce delay-300 bg-current"></span>
                  </div>
                ) : (
                  "Reset Password"
                )}
              </button>

              <div className="text-center">
                <Link to="/login" className="text-on-surface-variant font-body hover:text-secondary transition-colors">
                  Back to Login
                </Link>
              </div>
            </form>
          )}

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

export default ResetPasswordPage;