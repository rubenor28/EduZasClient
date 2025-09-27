import React from "react";

interface ImageCardProps {
  /**
   * URL de la imagen de fondo a mostrar en la tarjeta.
   */
  imageUrl: string;

  /**
   * Contenido que se renderizará dentro de la tarjeta.
   * Puede ser texto, botones u otros elementos React.
   */
  children: React.ReactNode;

  /**
   * Clases CSS adicionales para personalizar el contenedor externo.
   *
   * @default ""
   */
  className?: string;
}

/**
 * Un componente de tarjeta con imagen de fondo.
 *
 * Renderiza un contenedor con una imagen de fondo y un área
 * central con contenido personalizado (hijos).
 *
 * @param props - Propiedades del componente.
 *
 * @example
 * ```tsx
 * <ImageCard imageUrl="/images/bg.jpg">
 *   <h2 className="text-xl font-bold">Bienvenido</h2>
 *   <p>Este es un ejemplo de tarjeta con imagen de fondo.</p>
 * </ImageCard>
 * ```
 */
export function ImageCard({
  imageUrl,
  children,
  className = "",
}: ImageCardProps) {
  return (
    <div
      className={`relative bg-cover bg-center flex items-center justify-center ${className}`}
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
        {children}
      </div>
    </div>
  );
}
