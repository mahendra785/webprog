"use client";

import type React from "react";

import { useState, useEffect } from "react";

interface ToastProps {
  title: string;
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

export function Toast({ title, message, type, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow animation to complete before removing
    }, 4700); // Slightly less than 5s to allow for fade out

    return () => clearTimeout(timer);
  }, [onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-600 border-green-700";
      case "error":
        return "bg-red-600 border-red-700";
      case "info":
      default:
        return "bg-blue-600 border-blue-700";
    }
  };

  return (
    <div
      className={`${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      } transition-all duration-300 ease-in-out max-w-xs w-full bg-gray-900 border-l-4 ${getTypeStyles()} rounded shadow-lg pointer-events-auto mb-3`}
    >
      <div className="flex items-start p-4">
        <div className="flex-1">
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-300 mt-1">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-gray-400 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

interface ToastContainerProps {
  children: React.ReactNode;
}

export function ToastContainer({ children }: ToastContainerProps) {
  return (
    <div className="fixed bottom-0 right-0 p-4 z-50 flex flex-col items-end">
      {children}
    </div>
  );
}
