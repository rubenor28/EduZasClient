import type { QuestionTypes } from "@domain";
import {
  QuestionAnswerBlock,
  type QuestionAnswerBlockProps,
} from "./QuestionAnswerBlock";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";

type BlockProps = QuestionAnswerBlockProps<QuestionTypes.MultipleSelection>;

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
    onChange((prev) => ({ ...prev, selectedOptions: newSelectedOptions }));
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
