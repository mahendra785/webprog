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
  // Authentication state
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Navigation state
  const [currentView, setCurrentView] = useState("home");

  // Toast notifications
  const [toasts, setToasts] = useState<ToastType[]>([]);

  // Auth functions
  const login = (email: string, name = "User") => {
    setUser({ email, name });
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  // Navigation function
  const navigateTo = (view: string) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  // Toast function
  const showToast = (
    title: string,
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, title, message, type }]);

    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Render the appropriate component based on the current view state
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar
        isAuthenticated={isAuthenticated}
        logout={logout}
        navigateTo={navigateTo}
      />
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
