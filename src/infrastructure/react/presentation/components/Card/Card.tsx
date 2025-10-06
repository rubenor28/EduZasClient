import React, { useEffect, useRef, useState } from "react";
import "./Card.css";

export interface CardAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export interface CardProps {
  headerColor?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  actions?: CardAction[];
  showActions?: boolean;
}

export function Card({
  headerColor = "#007bff",
  title,
  subtitle,
  children,
  className = "",
  onClick,
  actions = [],
  showActions = false,
}: CardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [menuTop, setMenuTop] = useState<number>(0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedOnMenu = menuRef.current?.contains(target);
      const clickedOnButton = buttonRef.current?.contains(target);
      if (!clickedOnMenu && !clickedOnButton) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      const headerH = headerRef.current?.offsetHeight ?? 0;
      setMenuTop(headerH + 8);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleActionClick = (action: CardAction) => {
    if (!action.disabled) {
      action.onClick();
      setShowMenu(false);
    }
  };

  return (
    <article
      className={`card relative ${className}`}
      onClick={onClick}
      role={onClick ? "button" : "article"}
    >
      <div
        ref={headerRef}
        className={`card-header flex items-start justify-between`}
        style={{ backgroundColor: headerColor }}
      >
        <div className="flex-1 min-w-0 pr-3">
          <h2 className="card-title truncate" title={title}>
            {title}
          </h2>
          {subtitle && (
            <p className="card-subtitle truncate" title={subtitle}>
              {subtitle}
            </p>
          )}
        </div>

        {showActions && actions.length > 0 && (
          <div className="flex-shrink-0">
            <button
              ref={buttonRef}
              className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu((s) => !s);
              }}
              aria-label="Opciones"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {showActions && actions.length > 0 && (
        <div
          ref={menuRef}
          className="absolute right-4 z-10"
          style={{ top: `${menuTop}px` }}
        >
          {showMenu && (
            <div className="w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 text-black">
              {actions.map((action, index) => (
                <button
                  key={index}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    action.disabled
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-black hover:bg-gray-200"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActionClick(action);
                  }}
                  disabled={action.disabled}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="card-body">
        <div
          className="card-content truncate"
          title={typeof children === "string" ? children : undefined}
        >
          {children}
        </div>
      </div>
    </article>
  );
}
