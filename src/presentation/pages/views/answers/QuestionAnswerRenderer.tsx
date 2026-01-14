import {
  ConceptRelationQuestionAnswerBlock,
  MultipleChoiseQuestionAnswerBlock,
  MultipleSelectionQuestionAnswerBlock,
  OpenQuestionAnswerBlock,
  OrderingQuestionAnswerBlock,
} from "@presentation";

import {
  QuestionTypes,
  type PublicQuestion,
  type QuestionAnswer,
} from "@domain";

export type QuestionAnswerRendererProps = {
  question: PublicQuestion;
  answer: QuestionAnswer;
  onChange: (answer: QuestionAnswer) => void;
};

export function QuestionAnswerRenderer({
  question: q,
  answer: a,
  onChange,
}: QuestionAnswerRendererProps) {
  if (q.type === QuestionTypes.Open && a.type === QuestionTypes.Open)
    return (
      <OpenQuestionAnswerBlock
        question={q}
        answer={a}
        onChange={(updater) => onChange(updater(a))}
      />
    );

  if (
    q.type === QuestionTypes.MultipleSelection &&
    a.type === QuestionTypes.MultipleSelection
  )
    return (
      <MultipleSelectionQuestionAnswerBlock
        question={q}
        answer={a}
        onChange={(updater) => onChange(updater(a))}
      />
    );

  if (
    q.type === QuestionTypes.ConceptRelation &&
    a.type === QuestionTypes.ConceptRelation
  )
    return (
      <ConceptRelationQuestionAnswerBlock
        answer={a}
        question={q}
        onChange={(updater) => onChange(updater(a))}
      />
    );

  if (
    a.type === QuestionTypes.MultipleChoise &&
    q.type === QuestionTypes.MultipleChoise
  )
    return (
      <MultipleChoiseQuestionAnswerBlock
        answer={a}
        question={q}
        onChange={(updater) => onChange(updater(a))}
      />
    );

  if (a.type === QuestionTypes.Ordering && q.type === QuestionTypes.Ordering)
    return (
      <OrderingQuestionAnswerBlock
        answer={a}
        question={q}
        onChange={(updater) => onChange(updater(a))}
      />
    );

  throw Error(
    `Not supported question type ${q.type} and answer type ${a.type}`,
  );
}
