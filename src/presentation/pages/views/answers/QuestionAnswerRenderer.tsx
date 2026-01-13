import {
  ConceptRelationQuestionAnswerBlock,
  MultipleChoiseQuestionAnswerBlock,
  MultipleSelectionQuestionAnswerBlock,
  OpenQuestionAnswerBlock,
  OrderingQuestionAnswerBlock,
  type QuestionAnswerBlockProps,
} from "@presentation";
import {
  QuestionTypes,
  type PublicQuestionVariant,
  type QuestionAnswerVariant,
} from "@domain";
import { InternalServerError } from "@application";
import type { FunctionComponent } from "react";

export type QuestionAnswerRendererProps = {
  question: PublicQuestionVariant<any>;
  answer: QuestionAnswerVariant<any>;
  onChange: (answer: QuestionAnswerVariant<any>) => void;
};

const ANSWER_COMPONENTS: Record<
  QuestionTypes,
  FunctionComponent<QuestionAnswerBlockProps<any>>
> = {
  [QuestionTypes.Open]: OpenQuestionAnswerBlock,
  [QuestionTypes.MultipleChoise]: MultipleChoiseQuestionAnswerBlock,
  [QuestionTypes.MultipleSelection]: MultipleSelectionQuestionAnswerBlock,
  [QuestionTypes.Ordering]: OrderingQuestionAnswerBlock,
  [QuestionTypes.ConceptRelation]: ConceptRelationQuestionAnswerBlock,
};

export function QuestionAnswerRenderer({
  question,
  answer,
  onChange,
}: QuestionAnswerRendererProps) {
  const ComponentToRender = ANSWER_COMPONENTS[question.type];

  if (!ComponentToRender) {
    throw new InternalServerError(
      `Tipo de pregunta no soportada: ${question.type}`,
    );
  }

  return (
    <ComponentToRender
      question={question}
      answer={answer}
      onChange={(updater) => onChange(updater(answer))}
    />
  );
}
