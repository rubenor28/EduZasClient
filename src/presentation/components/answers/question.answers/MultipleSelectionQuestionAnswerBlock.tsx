import type {
  MultipleSelectionQuestionAnswer,
  PublicMultipleSelectionQuestion,
} from "@domain";
import {
  QuestionAnswerBlock,
  type AnyQuestionAnswerBlockProps,
} from "./QuestionAnswerBlock";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";

type BlockProps = AnyQuestionAnswerBlockProps<
  MultipleSelectionQuestionAnswer,
  PublicMultipleSelectionQuestion
>;

export function MultipleSelectionQuestionAnswerBlock({
  question,
  answer,
  onChange,
}: BlockProps) {
  const selectedOptions = new Set(answer.selectedOptions);

  const handleSelectedOptionsChange = (optionId: string) => {
    const newSelectedOptions = selectedOptions.has(optionId)
      ? answer.selectedOptions.filter((id) => id !== optionId) // Uncheck
      : [...answer.selectedOptions, optionId]; // Check
    onChange((_) => ({ selectedOptions: newSelectedOptions }));
  };

  return (
    <QuestionAnswerBlock question={question}>
      {question.options.map(({ id, text }) => (
        <Box key={id} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedOptions.has(id)}
                onChange={() => handleSelectedOptionsChange(id)}
              />
            }
            label=""
          />
          <Typography variant="h6">{text}</Typography>
        </Box>
      ))}
    </QuestionAnswerBlock>
  );
}
