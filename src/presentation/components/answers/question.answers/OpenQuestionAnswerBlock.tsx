import type { QuestionTypes } from "@domain";
import {
  QuestionAnswerBlock,
  type QuestionAnswerBlockProps,
} from "./QuestionAnswerBlock";
import { TextField } from "@mui/material";

type BlockProps = QuestionAnswerBlockProps<QuestionTypes.Open>;

export function OpenQuestionAnswerBlock({ question, answer, onChange }: BlockProps) {
  return (
    <QuestionAnswerBlock question={question}>
      <TextField
        label="Tu respuesta"
        value={answer.text}
        onChange={(e) => onChange(() => ({ ...answer, text: e.target.value }))}
        fullWidth
        multiline
        rows={4}
        variant="outlined"
      />
    </QuestionAnswerBlock>
  );
}
