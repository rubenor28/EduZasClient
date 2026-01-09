import type { QuestionAnswer, PublicQuestion } from "@domain";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  TextField,
} from "@mui/material";
import type { ReactNode } from "react";

export type AnyQuestionAnswerBlockProps<
  A extends QuestionAnswer,
  Q extends PublicQuestion,
> = {
  question: Q;
  answer: A;
};

type QuestionAnswerBlockProps<
  A extends QuestionAnswer,
  Q extends PublicQuestion,
> = Omit<AnyQuestionAnswerBlockProps<A, Q>, "id" | "answer"> & {
  children: ReactNode;
};

export function QuestionAnswerBlock<
  A extends QuestionAnswer,
  Q extends PublicQuestion,
>({ question, children }: QuestionAnswerBlockProps<A, Q>) {
  const { imageUrl, title } = question;

  return (
    <Card sx={{ mb: 2, border: "1px solid #eee", overflow: "visible" }}>
      <CardHeader
        title={
          imageUrl && (
            <Box
              sx={{
                mb: 2,
                maxWidth: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CardMedia
                component="img"
                image={imageUrl}
                alt="No se encontró la imagen"
                sx={{ maxHeight: 200, objectFit: "contain", width: "auto" }}
              />
            </Box>
          )
        }
        sx={{ backgroundColor: "#f9f9f9", py: 1 }}
      />
      <CardContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            disabled
            sx={{ mt: 2 }}
            label="Título de la Pregunta"
            value={title ?? ""}
            fullWidth
            variant="outlined"
          />
          {children}
        </Box>
      </CardContent>
    </Card>
  );
}
