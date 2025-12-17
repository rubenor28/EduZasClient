import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  CardMedia,
  Box,
  TextField,
} from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import DeleteIcon from "@mui/icons-material/Delete";
import type { ReactNode } from "react";
import type { Question } from "@domain";
import { useControlledState } from "@presentation";

/**
 * Props para el componente {@link QuestionBlock}.
 */
type QuestionBlockWrapperProps = {
  /** El estado inicial de la pregunta base (título, URL de imagen). */
  initialState: Question;
  /** Los campos de entrada específicos del tipo de pregunta (p. ej., opciones de selección). */
  children: ReactNode;
  /** Callback que se invoca cuando las propiedades de la pregunta base cambian. */
  onChange: (q: Question) => void;
  /** Callback que se invoca para eliminar la pregunta. */
  onDelete: () => void;
};

/**
 * Componente base para la edición de cualquier tipo de pregunta.
 *
 * Proporciona los campos comunes para editar el título y la URL de la imagen,
 * así como los controles para arrastrar y eliminar. Delega la renderización
 * de los campos específicos del tipo de pregunta a sus `children`.
 * @param props - Las propiedades del componente.
 */
export function QuestionBlock({
  initialState,
  children,
  onChange,
  onDelete,
}: QuestionBlockWrapperProps) {
  const [state, setState] = useControlledState<Question>(
    initialState,
    onChange,
  );

  const setTitle = (title: string) => setState((prev) => ({ ...prev, title }));
  const setImage = (imageUrl: string) =>
    setState((prev) => ({ ...prev, imageUrl }));

  return (
    <Card sx={{ mb: 2, border: "1px solid #eee", overflow: "visible" }}>
      <CardHeader
        avatar={
          <IconButton sx={{ cursor: "grab" }} aria-label="drag-handle">
            <DragIndicatorIcon />
          </IconButton>
        }
        action={
          <IconButton onClick={onDelete} aria-label="delete-question">
            <DeleteIcon />
          </IconButton>
        }
        title={
          state.imageUrl && (
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
                image={state.imageUrl}
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
            value={state.title ?? ""}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="URL de la Imagen (Opcional)"
            value={state.imageUrl ?? ""}
            onChange={(e) => setImage(e.target.value)}
            fullWidth
            variant="outlined"
          />
          {children}
        </Box>
      </CardContent>
    </Card>
  );
}
