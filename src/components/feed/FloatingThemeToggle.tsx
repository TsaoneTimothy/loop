
import React from "react";
import { ThemeToggle } from "@/context/ThemeContext";

const FloatingThemeToggle = () => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-card shadow-lg rounded-full p-3 border border-border">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default FloatingThemeToggle;
