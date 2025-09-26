import type { ReactNode } from "react";
import "./CardGrid.css";

interface CardGridProps {
  /** Elementos hijos (normalmente componentes Card) */
  children: ReactNode;
  /** Título de la sección */
  title?: string;
}

export function CardGrid({ children, title }: CardGridProps) {
  return (
    <section className="card-grid-section">
      {title && <h1 className="card-grid-title">{title}</h1>}
      <div className="card-grid">{children}</div>
    </section>
  );
}
