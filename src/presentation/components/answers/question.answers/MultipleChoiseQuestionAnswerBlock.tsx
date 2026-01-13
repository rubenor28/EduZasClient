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
  onChange,
}: BlockProps) {
  const updateAnswer = (id: string) => {
    onChange((_) => ({ selectedOption: id }));
  };

  return (
    <QuestionAnswerBlock question={question}>
      {question.options.map(({ id, text }) => (
        <Box key={id} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FormControlLabel
            control={
              <Radio
                checked={answer.selectedOption === id}
                onChange={() => updateAnswer(id)}
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
