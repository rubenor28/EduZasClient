import type { OpenQuestion, Question } from "@domain";
import { QuestionBlock, type AnyQuestionBlockProps } from "@presentation";

/**
 * Componente para renderizar una pregunta de tipo "Pregunta Abierta".
 *
 * Se suscribe al store de Zustand para obtener los datos de su pregunta
 * y las acciones para modificarla y eliminarla.
 * @param props - Las propiedades del componente.
 */
export function OpenQuestionBlock({
  id,
  question,
  onChange,
  onDelete,
}: AnyQuestionBlockProps<OpenQuestion>) {
  const handleBaseChange = (base: Question) =>
    onChange({ ...question, ...base });

  return (
    <QuestionBlock
      id={id}
      question={question}
      onChange={handleBaseChange}
      onDelete={onDelete}
    >
      <></>
    </QuestionBlock>
  );
}
