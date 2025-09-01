import { RegisterForm } from "./components/RegisterForm";
import { ImageCard } from "components";
import "./Register.css";

export function RegisterPage() {
  const background = "/images/jellyfish.jpg";

  return (
    <div className="register-view">
      {/* Mitad izquierda: Formulario */}
      <div className="register-form-section">
        <RegisterForm />
      </div>

      {/* Mitad derecha: Imagen con cuadro */}
      <div className="register-image-section">
        <ImageCard imageUrl={background}>
          <h2 className="image-card-title">Bienvenido a Edu-zas</h2>
          <p className="image-card-subtitle">
            La plataforma para impulsar tu aprendizaje 🚀
          </p>
        </ImageCard>
      </div>
    </div>
  );
}
