import type {
  QuestionTypes,
  PublicQuestionVariant,
  QuestionAnswerVariant,
} from "@domain";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";

type AnswerUpdater<T extends QuestionTypes> = (
  updater: (prev: QuestionAnswerVariant<T>) => QuestionAnswerVariant<T>,
) => void;

export type QuestionAnswerBlockProps<T extends QuestionTypes> = {
  question: PublicQuestionVariant<T>;
  answer: QuestionAnswerVariant<T>;
  onChange: AnswerUpdater<T>;
};

type GenericQuestionAnswerBlockProps = Omit<
  QuestionAnswerBlockProps<any>,
  "answer" | "onChange"
> & {
  children: ReactNode;
};

export function QuestionAnswerBlock({
  question,
  children,
}: GenericQuestionAnswerBlockProps) {
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
          <Typography variant="h5">{title}</Typography>
          {children}
        </Box>
      </CardContent>
    </Card>
  );
}
