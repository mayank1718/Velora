import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import GoogleAuthButton from "../components/GoogleAuthButton";
import { useAuth } from "../hooks/useAuth";
import { Eye, EyeOff, Loader2, Check, Sparkles } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      errs.password = "Password is required";
    }
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await handleLogin({
      email: formData.email.trim(),
      password: formData.password,
    });

    if (result.role == "seller") {
      navigate("/seller/products");
    } else if (result.role == "buyer") {
      navigate("/");
    }

    setFormData({
      email: "",
      password: "",
    });
  };

  if (loading) {
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>

        {/* Text */}
        <p className="text-sm font-medium text-gray-500">Loading...</p>
      </div>
    </div>;
  }

  return (
    <AuthLayout backTo="/register" backLabel="Register">
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-[10px] uppercase tracking-[0.16em] font-medium text-[var(--text-secondary)]">
              Email Address
            </label>
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@domain.com"
            autoComplete="email"
            className="w-full h-12 px-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/60 transition-colors focus:border-[var(--border-strong)] focus:ring-1 focus:ring-[var(--accent-gold)]/10"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-[10px] uppercase tracking-[0.16em] font-medium text-[var(--text-secondary)]">
              Password
            </label>
            <a
              href="#forgot"
              onClick={(e) => e.preventDefault()}
              className="text-[10px] uppercase tracking-[0.12em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Forgot Password?
            </a>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="w-full h-12 pl-3.5 pr-10 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/60 transition-colors focus:border-[var(--border-strong)] focus:ring-1 focus:ring-[var(--accent-gold)]/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1 cursor-pointer"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? (
                <EyeOff className="w-4 h-4" strokeWidth={1.5} />
              ) : (
                <Eye className="w-4 h-4" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
        {/* Submit Action */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[var(--btn-primary)] hover:bg-[var(--text-primary)] active:bg-[var(--btn-primary)] text-[var(--btn-text)] text-xs font-medium tracking-[0.18em] uppercase transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-none">
            {loading ? (
              <>
                <Loader2
                  className="w-4 h-4 animate-spin text-white"
                  strokeWidth={2}
                />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </div>
      </form>

      <div className="pt-5">
        <GoogleAuthButton />
      </div>

      {/* Switcher to Register */}
      <div className="text-center pt-2 border-t border-[var(--border-subtle)]/60">
        <p className="text-xs text-[var(--text-secondary)]">
          New to Snitch{" "}
          <Link
            to="/register"
            className="text-[var(--text-primary)] font-medium underline underline-offset-4 hover:text-[var(--accent-gold)] transition-colors tracking-wide ml-1">
            Create an account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
