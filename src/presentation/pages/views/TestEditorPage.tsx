import {
  Paper,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Snackbar,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { OutputData } from "@editorjs/editorjs";
import type { Test } from "@domain";
import {
  apiGet,
  apiPut,
  InputError,
  type FieldErrorDTO,
  type TestUpdate,
} from "@application";
import { useUser, TestEditor } from "@presentation";

/**
 * Crea una estructura de contenido por defecto para una nueva evaluación.
 * @returns Un objeto `OutputData` para Editor.js.
 */
const createDefaultContent = (): OutputData => ({
  time: Date.now(),
  blocks: [
    {
      id: crypto.randomUUID(),
      type: "header",
      data: {
        text: "Título de la Pregunta",
        level: 2,
      },
    },
    {
      id: crypto.randomUUID(),
      type: "paragraph",
      data: {
        text: "Escribe aquí la descripción o el enunciado de la pregunta.",
      },
    },
  ],
  version: "2.31.0",
});

/**
 * Página de edición para evaluaciones.
 * Permite a los profesores editar el título y el contenido de una evaluación existente.
 */
/**
 * Página de edición de evaluaciones.
 *
 * Funcionalidades:
 * 1. Cargar la evaluación existente.
 * 2. Gestionar el estado del editor (título, bloques de preguntas, tiempo límite).
 * 3. Guardar los cambios en el backend.
 *
 * Nota: A diferencia de los recursos, las evaluaciones no se asignan directamente desde aquí
 * (aunque podría implementarse en el futuro), sino que se gestionan desde la vista de lista o detalles.
 */
export const TestEditorPage = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();

  const [initialContent, setInitialContent] = useState<OutputData>(
    createDefaultContent(),
  );
  const [title, setTitle] = useState("");
  const [color, setColor] = useState<string>("#1976d2");
  const [content, setContent] = useState<OutputData>(createDefaultContent());
  const [active, setActive] = useState(true); // Default to active, fetched later
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number | undefined>(undefined);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrorDTO[]>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: "" });

  useEffect(() => {
    if (!testId) return;

    const fetchTest = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedTest = await apiGet<Test>(`/tests/${testId}`);
        setTitle(fetchedTest.title);
        setInitialContent(fetchedTest.content);
        setContent(fetchedTest.content);
        setActive(fetchedTest.active);
        setTimeLimitMinutes(fetchedTest.timeLimitMinutes);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al cargar la evaluación.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTest();
  }, [testId]);

  const handleSave = async () => {
    if (!testId) return;

    setIsSubmitting(true);
    setError(null);
    setFieldErrors([]);

    try {
      const payload: TestUpdate = {
        id: testId,
        title,
        content: content,
        active: active,
        professorId: user.id,
        timeLimitMinutes: timeLimitMinutes,
      };
      await apiPut("/test", payload, { parseResponse: "void" });
      setSnackbar({ open: true, message: "Evaluación guardada exitosamente." });
    } catch (e) {
      if (e instanceof InputError) {
        setFieldErrors(e.errors);
      } else {
        setError(e instanceof Error ? e.message : "Error al guardar.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const titleError = fieldErrors.find((fe) => fe.field === "Title")?.message;
  const colorError = fieldErrors.find((fe) => fe.field === "Color")?.message;

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4">Editar Evaluación</Typography>
        <Box>
          <Button onClick={() => navigate("/professor/tests")} sx={{ mr: 2 }}>
            Volver
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Guardar"}
          </Button>
        </Box>
      </Box>

      <TestEditor
        initialTitle={title}
        initialContent={initialContent}
        initialColor={color}
        onTitleChange={setTitle}
        onColorChange={setColor}
        onContentChange={setContent}
        onAssociationChange={() => setSnackbar({ open: true, message: "Asociaciones actualizadas." })}
        titleError={titleError}
        disabled={isSubmitting}
        colorError={colorError}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Paper>
  );
};
