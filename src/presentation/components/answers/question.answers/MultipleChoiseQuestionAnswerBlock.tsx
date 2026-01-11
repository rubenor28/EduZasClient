import type {
  PublicMultipleChoiseQuestion,
  MultipleChoiseQuestionAnswer,
} from "@domain";
import {
  QuestionAnswerBlock,
  type AnyQuestionAnswerBlockProps,
} from "./QuestionAnswerBlock";
import { Box, FormControlLabel, Radio, Typography } from "@mui/material";

type BlockProps = AnyQuestionAnswerBlockProps<
  MultipleChoiseQuestionAnswer,
  PublicMultipleChoiseQuestion
>;

export function MultipleChoiseQuestionAnswerBlock({
  question,
  answer,
}: BlockProps) {
  const handleOptionChange = (id: string) => {};

  return (
    <QuestionAnswerBlock question={question}>
      {question.options.map(({ id, text }) => (
        <Box key={id} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FormControlLabel
            control={
              <Radio
                checked={answer.selectedOption === id}
                onChange={() => handleOptionChange(id)}
                name={`question-${question.id}`}
              />
            }
            label=""
          />
          <Typography variant="h6"> {text}</Typography>
        </Box>
      ))}
    </QuestionAnswerBlock>
  );
}
