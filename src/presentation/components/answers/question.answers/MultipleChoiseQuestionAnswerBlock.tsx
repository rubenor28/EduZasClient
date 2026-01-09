import type {
  PublicMultipleChoiseQuestion,
  MultipleChoiseQuestionAnswer,
} from "@domain";
import {
  QuestionAnswerBlock,
  type AnyQuestionAnswerBlockProps,
} from "./QuestionAnswerBlock";
import { useState } from "react";
import { Box, FormControlLabel, Radio, TextField } from "@mui/material";

type BlockProps = AnyQuestionAnswerBlockProps<
  MultipleChoiseQuestionAnswer,
  PublicMultipleChoiseQuestion
>;

type SelectedOption = {
  id: string;
  index: number;
};

export function MultipleChoiseQuestionAnswerBlock({ question }: BlockProps) {
  const [selectedOption, setSelectedOption] = useState<SelectedOption>();

  return (
    <QuestionAnswerBlock question={question}>
      {question.options.map((option, index) => (
        <Box
          key={question.id}
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <FormControlLabel
            control={
              <Radio
                checked={selectedOption && selectedOption.index === index}
                onChange={() => setSelectedOption({ index, id: option.id })}
                name={`correct-option`}
              />
            }
            label=""
          />
          <TextField
            disabled
            value={option.text}
            fullWidth
            variant="standard"
          />
        </Box>
      ))}
    </QuestionAnswerBlock>
  );
}
