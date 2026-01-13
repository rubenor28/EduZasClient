import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  CardMedia,
  Box,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { ReactNode } from "react";
import type { Question, QuestionTypes } from "@domain";
import { getFieldError } from "@application";
import { useTest } from "@presentation";

type QVariant<T extends QuestionTypes> = Extract<Question, { type: T }>;

export type QuestionBlockProps<T extends QuestionTypes> = {
  id: string;
  /** El estado inicial de la pregunta base (título, URL de imagen). */
  question: QVariant<T>;
  /** Callback que se invoca cuando las propiedades de la pregunta base cambian. */
  onChange: (updater: (q: QVariant<T>) => QVariant<T>) => void;
  /** Callback que se invoca para eliminar la pregunta. */
  onDelete: () => void;
};

type BaseQuestionBlockProps<T extends QuestionTypes> = QuestionBlockProps<T> & {
  children: ReactNode;
};

export function QuestionBlock<T extends QuestionTypes>({
  id,
  question,
  children,
  onChange,
  onDelete,
}: BaseQuestionBlockProps<T>) {
  const { title, imageUrl } = question;

  const setTitle = (title: string) => onChange((prev) => ({ ...prev, title }));

  const setImage = (url: string) =>
    onChange((prev) => ({ ...prev, imageUrl: url === "" ? undefined : url }));

  const { fieldErrors } = useTest();

  const titleError = getFieldError(
    `content[${id}].title`,
    fieldErrors,
  )?.message;

  const imageError = getFieldError(
    `content[${id}].imageUrl`,
    fieldErrors,
  )?.message;

  return (
    <Card sx={{ mb: 2, border: "1px solid #eee", overflow: "visible" }}>
      <CardHeader
        action={
          <IconButton onClick={onDelete} aria-label="delete-question">
            <DeleteIcon />
          </IconButton>
        }
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
            sx={{ mt: 2 }}
            label="Título de la Pregunta"
            value={title ?? ""}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            variant="outlined"
            error={!!titleError}
            helperText={titleError}
          />
          <TextField
            label="URL de la Imagen (Opcional)"
            value={imageUrl ?? ""}
            onChange={(e) => setImage(e.target.value)}
            fullWidth
            variant="outlined"
            error={!!imageError}
            helperText={imageError}
          />
          {children}
        </Box>
      </CardContent>
    </Card>
  );
}
