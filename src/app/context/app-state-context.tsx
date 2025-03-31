"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

// Define the types for our view parameters
interface ViewParams {
  id?: number;
  type?: string;
  key: string; // Allow for additional parameters
}

// Define the context type
interface AppStateContextType {
  currentView: string;
  navigateTo: (view: string, params?: ViewParams) => void;
}

// Create the context
const AppStateContext = createContext<AppStateContextType | undefined>(
  undefined
);

// Provider component
export function AppStateProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<string>("home");

  // Function to navigate between views
  const navigateTo = (view: string) => {
    setCurrentView(view);

    // Scroll to top when changing views
    window.scrollTo(0, 0);
  };

  return (
    <AppStateContext.Provider value={{ currentView, navigateTo }}>
      {children}
    </AppStateContext.Provider>
  );
}

// Hook to use the app state
export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
}
