import React from "react";
import { LoaderThreeWithSize } from "./ui/loader";

interface PenLoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const PenLoader: React.FC<PenLoaderProps> = ({ 
  size = "md", 
  className = "" 
}) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <LoaderThreeWithSize size={size} />
    </div>
  );
};

export const FullScreenPenLoader: React.FC<{ message?: string }> = ({ 
  message = "Loading..." 
}) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <PenLoader size="lg" />
      <p className="mt-6 text-[#334443] font-medium animate-pulse">{message}</p>
    </div>
  );
};
