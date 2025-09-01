import { FieldWrapper } from "components";
import { RegisterInput } from "./components/Input";
import "./Register.css";

// Register.tsx
export function Register() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // luego colocas tu lógica aquí
  };

  return (
    <form
      className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
      aria-labelledby="register-legend"
      onSubmit={handleSubmit}
    >
      <legend id="register-legend" className="text-xl font-semibold mb-4">
        Registrarse
      </legend>

      {/* matrícula */}
      <FieldWrapper>
        <RegisterInput name="tuition" placeholder="Matrícula" required />
      </FieldWrapper>

      {/* correo */}
      <FieldWrapper>
        <RegisterInput
          type="email"
          name="email"
          placeholder="Correo"
          required
        />
      </FieldWrapper>

      {/* primer nombre */}
      <FieldWrapper>
        <RegisterInput name="firstName" placeholder="Primer nombre" required />
      </FieldWrapper>

      {/* segundo nombre */}
      <FieldWrapper>
        <RegisterInput name="secondName" placeholder="Segundo nombre" />
      </FieldWrapper>

      {/* apellido paterno */}
      <FieldWrapper>
        <RegisterInput
          name="fatherLastname"
          placeholder="Apellido paterno"
          required
        />
      </FieldWrapper>

      {/* apellido materno */}
      <FieldWrapper>
        <RegisterInput name="motherLastname" placeholder="Apellido materno" />
      </FieldWrapper>

      {/* género */}
      <FieldWrapper>
        <select
          name="gender"
          className="input-base"
          defaultValue=""
          aria-label="Género"
        >
          <option value="prefer-not">Prefiero no decirlo</option>
          <option value="male">Hombre</option>
          <option value="female">Mujer</option>
          <option value="other">Otro</option>
        </select>
      </FieldWrapper>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Registrar
        </button>
      </div>
    </form>
  );
}
