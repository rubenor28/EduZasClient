import { QuestionTypes, type AnyQuestion } from "@domain";
import { OpenQuestionBlock } from "./OpenQuestionBlock";
import { MultipleChoiceQuestionBlock } from "./MultipleChoiceQuestionBlock";
import { InternalServerError } from "@application";
import { MultipleSelectionQuestionBlock } from "./MultipleSelectionQuestionBlock";
import { OrderingQuestionBlock } from "./OrderingQuestionBlock";
import { ConceptRelationQuestionBlock } from "./ConceptRelationQuestionBlock";
import type { AnyQuestionBlockProps } from "./QuestionBlock";

export type QuestionRendererProps = {
  id: string;
  question: AnyQuestion;
  onChange: (question: AnyQuestion) => void;
  onDelete: () => void;
};

type QuestionComponent = React.ComponentType<AnyQuestionBlockProps<any>>;

const QUESTION_COMPONENTS: Partial<Record<QuestionTypes, QuestionComponent>> = {
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
      onChange={onChange}
      onDelete={onDelete}
    />
  );
}
