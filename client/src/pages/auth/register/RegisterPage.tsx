import { RegisterForm } from "./components/RegisterForm";
import { ImageCard } from "components";
import "./Register.css";

export function RegisterPage() {
  const background = "/images/jellyfish.jpg";

  return (
    <div className="split-layout-container">
      {/* Mitad izquierda: Formulario */}
      <div className="centered-panel">
        <RegisterForm />
      </div>

      {/* Mitad derecha: Imagen con cuadro */}
      <ImageCard
        imageUrl={background}
        className="half-horizontal-media-container"
      >
        <h2 className="image-card-title">Bienvenido a Edu-zas</h2>
        <p className="image-card-subtitle">
          La plataforma para impulsar tu aprendizaje 🚀
        </p>
      </ImageCard>
    </div>
  );
}
