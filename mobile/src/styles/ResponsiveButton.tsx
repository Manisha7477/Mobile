import React from "react";

interface ResponsiveButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

const ResponsiveButton: React.FC<ResponsiveButtonProps> = ({
  children,
  onClick,
  type = "button",
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        px-2 py-1 text-[10px]
        sm:px-3 sm:py-1.5 sm:text-xs
        md:px-4 md:py-2 md:text-sm
        lg:px-3 lg:py-1 lg:text-base
        rounded-md 
        transition
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default ResponsiveButton;
