import React from "react";

export const LoaderThree = () => {
  return (
    <div className="flex space-x-2 justify-center items-center">
      <span className="sr-only">Loading...</span>
      <div className="h-3 w-3 bg-[#34656D] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-3 w-3 bg-[#34656D] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-3 w-3 bg-[#34656D] rounded-full animate-bounce"></div>
    </div>
  );
};

export const LoaderThreeWithSize = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4"
  };

  return (
    <div className="flex space-x-2 justify-center items-center">
      <span className="sr-only">Loading...</span>
      <div className={`${sizeClasses[size]} bg-[#34656D] rounded-full animate-bounce [animation-delay:-0.3s]`}></div>
      <div className={`${sizeClasses[size]} bg-[#34656D] rounded-full animate-bounce [animation-delay:-0.15s]`}></div>
      <div className={`${sizeClasses[size]} bg-[#34656D] rounded-full animate-bounce`}></div>
    </div>
  );
};

