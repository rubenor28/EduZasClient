import type { QuestionTypes } from "@domain";
import {
  QuestionAnswerBlock,
  type QuestionAnswerBlockProps,
} from "./QuestionAnswerBlock";
import { Box, FormControlLabel, Radio, Typography } from "@mui/material";

type BlockProps = QuestionAnswerBlockProps<QuestionTypes.MultipleChoise>;

export function MultipleChoiseQuestionAnswerBlock({
  question,
  answer,
  onChange,
}: BlockProps) {
  const updateAnswer = (id: string) => {
    onChange((prev) => ({ ...prev, selectedOption: id }));
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
