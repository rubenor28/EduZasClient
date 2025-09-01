import React from "react";
import "./Hint.css";

type HintProps = {
  text: string;
  id?: string;
  placement?: "top" | "bottom";
  className?: string;
  children?: React.ReactNode;
};

export function Hint({
  text,
  id,
  placement = "top",
  className = "",
  children,
}: HintProps) {
  const tooltipId = id ?? `hint-${Math.random().toString(36).slice(2, 9)}`;
  return (
    <div className={`hint-wrapper group ${className}`}>
      <span
        className="hint-icon"
        tabIndex={0}
        role="button"
        aria-haspopup="true"
        aria-describedby={tooltipId}
      >
        {children ?? "ℹ️"}
      </span>

      <div
        id={tooltipId}
        role="tooltip"
        className={`hint-tooltip hint-tooltip--${placement}`}
      >
        {text}
      </div>
    </div>
  );
}
