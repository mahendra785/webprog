"use client";
import { useState } from "react";
import Navbar from "./components/navbar";
import HomePage from "./components/home";
import LoginSection from "./components/auth/login";
import RegistrationSection from "./components/auth/registration";
import MoviesSection from "./components/content/movies";
import TVShowsSection from "./components/content/tv-shows";
import ProfileSection from "./components/profile";
import { ToastContainer, Toast } from "./components/ui/toast";

// Types
export type User = {
  email: string;
  name: string;
};

export type ViewParams = {
  id: number;
  type: string;
};

export type ToastType = {
  id: string;
  title: string;
  message: string;
  type: "success" | "error" | "info";
};

// Main App Component
export default function App() {
  if (typeof window !== "undefined") {
    // Safe to use `window` here
    console.log(window.innerWidth);
  }

  // Authentication state
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Navigation state
  const [currentView, setCurrentView] = useState("home");

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastType[]>([]);

  // Auth functions with toast feedback
  const login = (email: string, name = "User") => {
    setUser({ email, name });
    setIsAuthenticated(true);
    showToast("Login Successful", `Welcome, ${name}!`, "success");
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    showToast("Logged Out", "You have been logged out.", "info");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
      showToast("Profile Updated", "Your profile has been updated.", "success");
    }
  };

  // Navigation function
  const navigateTo = (view: string) => {
    setCurrentView(view);
  };

  // Toast function
  const showToast = (
    title: string,
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, title, message, type }]);

    // Auto-remove toast after 5 seconds for a smoother UX
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Render content based on current view with smooth transitions (to be defined in CSS)
  const renderContent = () => {
    switch (currentView) {
      case "login":
        return (
          <LoginSection
            login={login}
            navigateTo={navigateTo}
            showToast={showToast}
          />
        );
      case "register":
        return (
          <RegistrationSection
            login={login}
            navigateTo={navigateTo}
            showToast={showToast}
          />
        );
      case "movies":
        return (
          <MoviesSection
            isAuthenticated={isAuthenticated}
            navigateTo={navigateTo}
          />
        );
      case "tvshows":
        return (
          <TVShowsSection
            isAuthenticated={isAuthenticated}
            navigateTo={navigateTo}
          />
        );
      case "profile":
        return (
          <ProfileSection
            user={user}
            logout={logout}
            updateUser={updateUser}
            navigateTo={navigateTo}
            showToast={showToast}
          />
        );
      case "home":
      default:
        return (
          <HomePage isAuthenticated={isAuthenticated} navigateTo={navigateTo} />
        );
    }
  };

  return (
    <div className="min-h-screen  bg-gradient-to-b from-gray-900 to-black text-white flex flex-col">
      {/* Navigation */}
      <Navbar
        isAuthenticated={isAuthenticated}
        logout={logout}
        navigateTo={navigateTo}
      />
      {/* Main content area */}

      <main className="pt-16">{renderContent()}</main>
      {/* Toast notifications */}
      <ToastContainer>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            title={toast.title}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </ToastContainer>
    </div>
  );
}
