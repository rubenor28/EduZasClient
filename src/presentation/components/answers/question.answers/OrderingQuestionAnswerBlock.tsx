import type { QuestionTypes } from "@domain";
import {
  QuestionAnswerBlock,
  type QuestionAnswerBlockProps,
} from "./QuestionAnswerBlock";
import { Typography } from "@mui/material";

type BlockProps = QuestionAnswerBlockProps<QuestionTypes.Ordering>;

export function OrderingQuestionAnswerBlock({ question }: BlockProps) {
  return (
    <QuestionAnswerBlock question={question}>
      <Typography>Ordering question answer UI not implemented yet.</Typography>
    </QuestionAnswerBlock>
  );
}
