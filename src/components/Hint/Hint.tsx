import React, { useState, useRef, useEffect, useCallback } from "react";
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
  /** Posición preferida del tooltip (auto para detección automática) */
  preferredPosition?: "top" | "bottom" | "left" | "right" | "auto";
  /** Desplazamiento personalizado del tooltip respecto al activador */
  offset?: number;
}

/**
 * Componente Hint - Muestra un tooltip de información al hacer hover o focus
 *
 * @remarks
 * Este componente implementa accesibilidad ARIA siguiendo las mejores prácticas
 * para tooltips, incluyendo soporte para navegación por teclado y lectores de pantalla.
 * Incluye posicionamiento inteligente para evitar que el tooltip se salga de la ventana.
 *
 * @param {HintProps} props - Propiedades del componente
 * @returns Componente de tooltip accesible
 */
export function Hint({
  text,
  id,
  className = "",
  children,
  preferredPosition = "auto",
  offset = 8,
}: HintProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<"top" | "bottom" | "left" | "right">(
    "top",
  );
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipId = id ?? `hint-${Math.random().toString(36).slice(2, 9)}`;

  // Función para determinar la mejor posición del tooltip
  const calculatePosition = useCallback(() => {
    if (!tooltipRef.current || !triggerRef.current) return "top";

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    const spaceAbove = triggerRect.top;
    const spaceBelow = window.innerHeight - triggerRect.bottom;
    const spaceLeft = triggerRect.left;
    const spaceRight = window.innerWidth - triggerRect.right;

    // Si se especifica una posición preferida y hay espacio, usarla
    if (preferredPosition !== "auto") {
      const hasSpace =
        (preferredPosition === "top" &&
          spaceAbove >= tooltipRect.height + offset) ||
        (preferredPosition === "bottom" &&
          spaceBelow >= tooltipRect.height + offset) ||
        (preferredPosition === "left" &&
          spaceLeft >= tooltipRect.width + offset) ||
        (preferredPosition === "right" &&
          spaceRight >= tooltipRect.width + offset);

      if (hasSpace) return preferredPosition;
    }

    // Verificar si hay espacio suficiente en cada dirección
    const canShowOnTop = spaceAbove >= tooltipRect.height + offset;
    const canShowOnBottom = spaceBelow >= tooltipRect.height + offset;
    const canShowOnLeft = spaceLeft >= tooltipRect.width + offset;
    const canShowOnRight = spaceRight >= tooltipRect.width + offset;

    // Priorizar top o bottom, luego left/right si es necesario
    if (canShowOnTop) return "top";
    if (canShowOnBottom) return "bottom";
    if (canShowOnLeft) return "left";
    if (canShowOnRight) return "right";

    // Si no hay espacio en ninguna dirección, forzar top o bottom
    return spaceAbove > spaceBelow ? "top" : "bottom";
  }, [preferredPosition, offset]);

  // Efecto para calcular y ajustar la posición cuando el tooltip se muestra
  useEffect(() => {
    if (isVisible) {
      const newPosition = calculatePosition();
      setPosition(newPosition);

      // Añadir event listeners para reposicionar en scroll y resize
      const handleReposition = () => {
        setPosition(calculatePosition());
      };

      window.addEventListener("scroll", handleReposition, true);
      window.addEventListener("resize", handleReposition);

      return () => {
        window.removeEventListener("scroll", handleReposition, true);
        window.removeEventListener("resize", handleReposition);
      };
    }
  }, [isVisible, calculatePosition]);

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  return (
    <div className={`hint-wrapper ${className}`}>
      {/* Elemento activador del tooltip (icono por defecto o children personalizado) */}
      <span
        ref={triggerRef}
        className="hint-icon"
        tabIndex={0}
        role="button"
        aria-haspopup="true"
        aria-describedby={tooltipId}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children ?? "ℹ️"}
      </span>

      {/* Tooltip que se muestra al interactuar con el activador */}
      <div
        id={tooltipId}
        ref={tooltipRef}
        role="tooltip"
        className={`hint-tooltip ${position} ${isVisible ? "visible" : ""}`}
      >
        {text}
        <div className="hint-arrow"></div>
      </div>
    </div>
  );
}
