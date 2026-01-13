import type { QuestionTypes } from "@domain";
import {
  QuestionAnswerBlock,
  type QuestionAnswerBlockProps,
} from "./QuestionAnswerBlock";
import { Typography } from "@mui/material";

type BlockProps = QuestionAnswerBlockProps<QuestionTypes.ConceptRelation>;

export function ConceptRelationQuestionAnswerBlock({ question }: BlockProps) {
  return (
    <QuestionAnswerBlock question={question}>
      <Typography>
        Concept relation question answer UI not implemented yet.
      </Typography>
    </QuestionAnswerBlock>
  );
}
