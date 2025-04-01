"use client";

import type React from "react";
import { useState, useEffect } from "react";

interface LoginSectionProps {
  login: (email: string) => void;
  navigateTo: (view: string) => void;
  showToast: (
    title: string,
    message: string,
    type: "success" | "error" | "info"
  ) => void;
}

export default function LoginSection({
  login,
  navigateTo,
  showToast,
}: LoginSectionProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validation states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  // Validate email using regex pattern
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(email);

    if (!email) {
      setEmailError("Email is required");
    } else if (!isValid) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }

    return isValid && email !== "";
  };

  // Validate password with strong requirements
  const validatePassword = (password: string): boolean => {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      password
    );

    if (!password) {
      setPasswordError("Password is required");
    } else if (!hasMinLength) {
      setPasswordError("Password must be at least 8 characters long");
    } else if (!hasUppercase) {
      setPasswordError("Password must include at least one uppercase letter");
    } else if (!hasLowercase) {
      setPasswordError("Password must include at least one lowercase letter");
    } else if (!hasNumber) {
      setPasswordError("Password must include at least one number");
    } else if (!hasSpecialChar) {
      setPasswordError("Password must include at least one special character");
    } else {
      setPasswordError("");
    }

    return (
      hasMinLength &&
      hasUppercase &&
      hasLowercase &&
      hasNumber &&
      hasSpecialChar
    );
  };

  // Check form validity whenever inputs change
  useEffect(() => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    setIsFormValid(isEmailValid && isPasswordValid);
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form on submission
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      login(email);
      navigateTo("home");

      showToast("Success", "You have successfully logged in", "success");
    } catch (error) {
      showToast("Error", "Invalid email or password", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    navigateTo("register");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 p-8 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => validateEmail(email)}
                aria-invalid={!!emailError}
                aria-describedby="email-error"
                className={`w-full px-3 py-2 bg-gray-800 border ${
                  emailError ? "border-red-500" : "border-gray-700"
                } rounded-md text-white`}
              />
              {emailError && (
                <p id="email-error" className="text-red-500 text-xs mt-1">
                  {emailError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => validatePassword(password)}
                aria-invalid={!!passwordError}
                aria-describedby="password-error"
                className={`w-full px-3 py-2 bg-gray-800 border ${
                  passwordError ? "border-red-500" : "border-gray-700"
                } rounded-md text-white`}
              />
              {passwordError && (
                <p id="password-error" className="text-red-500 text-xs mt-1">
                  {passwordError}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-red-600 bg-gray-800 border-gray-700 rounded"
              />
              <label htmlFor="remember" className="text-sm cursor-pointer">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              className={`w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors ${
                isLoading || !isFormValid ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              New to StreamIt?{" "}
              <button
                onClick={handleSignUp}
                className="text-red-500 hover:underline"
              >
                Sign up now
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
