import React from "react";
import "./Hint.css";

interface HintProps {
  /** Texto del tooltip que se mostrará al usuario */
  text: string;
  /** ID opcional para el tooltip (se genera automáticamente si no se proporciona) */
  id?: string;
  /** Clases CSS adicionales para personalizar el componente */
  className?: string;
  /** Contenido personalizado para reemplazar el icono por defecto */
  children?: React.ReactNode;
}

/**
 * Componente Hint - Muestra un tooltip de información al hacer hover o focus
 *
 * @remarks
 * Este componente implementa accesibilidad ARIA siguiendo las mejores prácticas
 * para tooltips, incluyendo soporte para navegación por teclado y lectores de pantalla.
 *
 * @param {HintProps} props - Propiedades del componente
 * @returns Componente de tooltip accesible
 */
export function Hint({ text, id, className = "", children }: HintProps) {
  // Genera un ID único para el tooltip si no se proporciona uno
  const tooltipId = id ?? `hint-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className={`hint-wrapper group ${className}`}>
      {/* Elemento activador del tooltip (icono por defecto o children personalizado) */}
      <span
        className="hint-icon"
        tabIndex={0}
        role="button"
        aria-haspopup="true"
        aria-describedby={tooltipId}
      >
        {children ?? "ℹ️"}
      </span>

      {/* Tooltip que se muestra al interactuar con el activador */}
      <div id={tooltipId} role="tooltip" className="hint-tooltip">
        {text}
      </div>
    </div>
  );
}
