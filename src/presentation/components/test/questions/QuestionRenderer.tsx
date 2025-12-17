import { type AnyQuestion, QuestionTypes } from "@domain";
import { OpenQuestionBlock } from "./OpenQuestionBlock";
import { MultipleChoiceQuestionBlock } from "./MultipleChoiceQuestionBlock";

/**
 * Props para el componente {@link QuestionRenderer}.
 */
export type QuestionRendererProps = {
  /** El estado inicial de cualquier tipo de pregunta. */
  initialState: AnyQuestion;
  /** Callback que se invoca cuando cualquier propiedad de la pregunta cambia. */
  onChange: (value: AnyQuestion) => void;
  /** Callback que se invoca para eliminar la pregunta. */
  onDelete: () => void;
};

/**
 * Componente encargado de renderizar dinámicamente el editor adecuado
 * para cada tipo de pregunta.
 *
 * Actúa como un *switch* que, basándose en la propiedad `type` de `initialState`,
 * renderiza el componente específico (`OpenQuestionBlock`, `MultipleChoiceQuestionBlock`, etc.)
 * y le pasa las props necesarias.
 * @param props - Las propiedades del componente.
 */
export function QuestionRenderer({
  initialState,
  onChange,
  onDelete,
}: QuestionRendererProps) {
  if (initialState.type === QuestionTypes.Open)
    return (
      <OpenQuestionBlock
        initialState={initialState}
        onChange={onChange}
        onDelete={onDelete}
      />
    );

  if (initialState.type === QuestionTypes.MultipleChoise)
    return (
      <MultipleChoiceQuestionBlock
        initialState={initialState}
        onChange={onChange}
        onDelete={onDelete}
      />
    );

  throw Error("Tipo de pregunta no soportada");
}
