"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}

const PixelButton = forwardRef<HTMLButtonElement, Props>(
  ({ variant = "primary", className = "", children, ...rest }, ref) => {
    const base = "pixel-btn pixel-border-soft";
    const v = variant === "ghost" ? "pixel-btn-ghost" : "";
    return (
      <button ref={ref} className={`${base} ${v} ${className}`} {...rest}>
        {children}
      </button>
    );
  },
);
PixelButton.displayName = "PixelButton";

export default PixelButton;
