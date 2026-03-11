import { QuestionTypes, type QuestionVariant } from "@domain";
import { OpenQuestionBlock } from "./OpenQuestionBlock";
import { MultipleChoiceQuestionBlock } from "./MultipleChoiceQuestionBlock";
import { InternalServerError } from "@application";
import { MultipleSelectionQuestionBlock } from "./MultipleSelectionQuestionBlock";
import { OrderingQuestionBlock } from "./OrderingQuestionBlock";
import { ConceptRelationQuestionBlock } from "./ConceptRelationQuestionBlock";
import type { QuestionBlockProps } from "./QuestionBlock";

/**
 * Propiedades para el componente QuestionRenderer.
 */
export type QuestionRendererProps = {
  /** ID único de la pregunta. */
  id: string;
  /** Entidad de la pregunta a renderizar. */
  question: QuestionVariant<any>;
  /** Callback invocado cuando cambian los datos de la pregunta. */
  onChange: (question: QuestionVariant<any>) => void;
  /** Callback invocado para solicitar la eliminación de la pregunta. */
  onDelete: () => void;
};

/**
 * Tipo que representa un componente de bloque de pregunta.
 */
type QuestionComponent = React.ComponentType<QuestionBlockProps<any>>;

/**
 * Mapa que asocia cada tipo de pregunta con su componente editor correspondiente.
 */
const QUESTION_COMPONENTS: Record<QuestionTypes, QuestionComponent> = {
  [QuestionTypes.Open]: OpenQuestionBlock,
  [QuestionTypes.MultipleChoise]: MultipleChoiceQuestionBlock,
  [QuestionTypes.MultipleSelection]: MultipleSelectionQuestionBlock,
  [QuestionTypes.Ordering]: OrderingQuestionBlock,
  [QuestionTypes.ConceptRelation]: ConceptRelationQuestionBlock,
};

/**
 * Renderizador dinámico de preguntas para el editor de evaluaciones.
 * 
 * Basándose en el tipo de la pregunta proporcionada, selecciona y renderiza
 * el componente de bloque adecuado (opción múltiple, abierta, etc.).
 */
export function QuestionRenderer({
  id,
  question,
  onChange,
  onDelete,
}: QuestionRendererProps) {
  const ComponentToRender = QUESTION_COMPONENTS[question.type];

  if (!ComponentToRender) {
    throw new InternalServerError(
      `Tipo de pregunta no soportada: ${question.type}`,
    );
  }

  return (
    <ComponentToRender
      id={id}
      question={question}
      onChange={(updater) => onChange(updater(question))}
      onDelete={onDelete}
    />
  );
}
