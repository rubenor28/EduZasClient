import React from "react";
import { ImageCard } from "@components";
import "./Register.css";

type AuthPageProps = {
  children: React.ReactNode;
};

export function AuthPage({ children }: AuthPageProps) {
  const background = "/images/jellyfish.jpg";

  return (
    <div className="split-layout-container">
      {/* Mitad izquierda: Formulario */}
      <div className="centered-panel w-2/3">{children}</div>

      {/* Mitad derecha: Imagen con cuadro */}
      <ImageCard
        imageUrl={background}
        className="half-horizontal-media-container w-1/2"
      >
        <h2 className="image-card-title">Bienvenido a Edu-zas</h2>
        <p className="image-card-subtitle">
          La plataforma para impulsar tu aprendizaje 🚀
        </p>
      </ImageCard>
    </div>
  );
}
