import type { QuestionTypes } from "@domain";
import {
  QuestionAnswerBlock,
  type QuestionAnswerBlockProps,
} from "./QuestionAnswerBlock";
import { TextField } from "@mui/material";

type BlockProps = QuestionAnswerBlockProps<QuestionTypes.Open>;

export function OpenQuestionAnswerBlock({
  question,
  answer,
  onChange,
}: BlockProps) {
  const handleChange = (text: string) => {
    console.log(`Valor pregunta abierta: ${text}`);

    onChange(() => ({
      ...answer,
      text: text === "" ? null : text,
    }));
  };

  return (
    <QuestionAnswerBlock question={question}>
      <TextField
        label="Tu respuesta"
        value={answer.text}
        onChange={(e) => handleChange(e.target.value)}
        fullWidth
        multiline
        rows={4}
        variant="outlined"
      />
    </QuestionAnswerBlock>
  );
}
