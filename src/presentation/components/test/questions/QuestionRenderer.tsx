import { QuestionTypes, type QuestionVariant } from "@domain";
import { OpenQuestionBlock } from "./OpenQuestionBlock";
import { MultipleChoiceQuestionBlock } from "./MultipleChoiceQuestionBlock";
import { InternalServerError } from "@application";
import { MultipleSelectionQuestionBlock } from "./MultipleSelectionQuestionBlock";
import { OrderingQuestionBlock } from "./OrderingQuestionBlock";
import { ConceptRelationQuestionBlock } from "./ConceptRelationQuestionBlock";
import type { QuestionBlockProps } from "./QuestionBlock";

export type QuestionRendererProps = {
  id: string;
  question: QuestionVariant<any>;
  onChange: (question: QuestionVariant<any>) => void;
  onDelete: () => void;
};

type QuestionComponent = React.ComponentType<QuestionBlockProps<any>>;

const QUESTION_COMPONENTS: Record<QuestionTypes, QuestionComponent> = {
  [QuestionTypes.Open]: OpenQuestionBlock,
  [QuestionTypes.MultipleChoise]: MultipleChoiceQuestionBlock,
  [QuestionTypes.MultipleSelection]: MultipleSelectionQuestionBlock,
  [QuestionTypes.Ordering]: OrderingQuestionBlock,
  [QuestionTypes.ConceptRelation]: ConceptRelationQuestionBlock,
};

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
