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
import type { Question } from "@domain";
import { getFieldError } from "@application";
import { useTest } from "@presentation";

export type AnyQuestionBlockProps<T extends Question> = {
  id: string;
  /** El estado inicial de la pregunta base (título, URL de imagen). */
  question: T;
  /** Callback que se invoca cuando las propiedades de la pregunta base cambian. */
  onChange: (updater: (q: T) => T) => void;
  /** Callback que se invoca para eliminar la pregunta. */
  onDelete: () => void;
};

/**
 * Props para el componente {@link QuestionBlock}.
 */
type QuestionBlockProps<T extends Question> = AnyQuestionBlockProps<T> & {
  /** Los campos de entrada específicos del tipo de pregunta (p. ej., opciones de selección). */
  children: ReactNode;
};

/**
 * Componente base para la edición de cualquier tipo de pregunta.
 *
 * Proporciona los campos comunes para editar el título y la URL de la imagen,
 * así como los controles para arrastrar y eliminar. Delega la renderización
 * de los campos específicos del tipo de pregunta a sus `children`.
 * @param props - Las propiedades del componente.
 */
export function QuestionBlock<T extends Question>({
  id,
  question,
  children,
  onChange,
  onDelete,
}: QuestionBlockProps<T>) {
  const { title, imageUrl } = question;
  const setTitle = (title: string) =>
    onChange((prev) => ({ ...prev, title }));
  const setImage = (imageUrl: string) =>
    onChange((prev) => ({ ...prev, imageUrl }));

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
