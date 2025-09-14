import type { ReactNode } from "react";
import "./Card.css";

interface CardProps {
  headerColor?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({
  headerColor = "bg-blue-500",
  title,
  subtitle,
  children,
  className = "",
  onClick,
}: CardProps) {
  return (
    <article
      className={`card ${className}`}
      onClick={onClick}
      role={onClick ? "button" : "article"}
    >
      <div className={`card-header ${headerColor}`}>
        <h2 className="card-title" title={title}>
          {title}
        </h2>
        {subtitle && (
          <p className="card-subtitle" title={subtitle}>
            {subtitle}
          </p>
        )}
      </div>
      <div className="card-body">
        <div className="card-content">{children}</div>
      </div>
    </article>
  );
}
