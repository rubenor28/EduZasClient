import type { OpenQuestion } from "@domain";
import { QuestionBlock } from "./QuestionBlock";

/**
 * Props para el componente {@link OpenQuestionBlock}.
 */
type OpenQuestionBlockProps = {
  /** El estado inicial completo de la pregunta abierta. */
  initialState: OpenQuestion;
  /** Callback que se invoca cuando cualquier propiedad de la pregunta cambia. */
  onChange: (value: OpenQuestion) => void;
  /** Callback que se invoca para eliminar la pregunta. */
  onDelete: () => void;
};

/**
 * Componente para renderizar una pregunta de tipo "Pregunta Abierta".
 *
 * Utiliza el componente {@link QuestionBlock} para los campos base (título, imagen)
 * y le pasa los callbacks correspondientes. No tiene campos adicionales,
 * por lo que su `children` está vacío.
 * @param props - Las propiedades del componente.
 */
export function OpenQuestionBlock({
  initialState: { type, title, imageUrl },
  onChange,
  onDelete,
}: OpenQuestionBlockProps) {
  return (
    <QuestionBlock
      initialState={{
        title,
        imageUrl,
      }}
      onChange={({ title, imageUrl }) => onChange({ type, title, imageUrl })}
      onDelete={onDelete}
    >
      <></>
    </QuestionBlock>
  );
}
