import {
  apiPut,
  getFieldError,
  InputError,
  type TestUpdate,
} from "@application";
import { ColorSelector, QuestionBlockEditor, useTest } from "@presentation";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Snackbar,
  Alert,
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { TestClassAssociationManager } from "./TestClassAssociationManager";

export type Params = {
  testId: string;
};

export type SnackbarState =
  | { open: false }
  | { open: true; severity: "success" | "error"; message: string };

export function TestEditor() {
  const navigate = useNavigate();
  const { test, setTitle, setColor, setTimeLimit } = useTest();
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
  });

  const { fieldErrors, setFieldErrors } = useTest();
  const titleError = getFieldError("title", fieldErrors)?.message;
  const colorError = getFieldError("color", fieldErrors)?.message;
  const contentError = getFieldError("content", fieldErrors)?.message;
  const timeLimitError = getFieldError(
    "timeLimitMinutes",
    fieldErrors,
  )?.message;

  const handleSave = useCallback(
    async (isManual: boolean = false) => {
      try {
        setFieldErrors([]);
        const payload: TestUpdate = { ...test };

        setSubmitting(true);
        await apiPut("/test/", payload);

        if (isManual) {
          setSnackbar({
            open: true,
            severity: "success",
            message: "Test actualizado correctamente",
          });
        }
      } catch (e) {
        if (e instanceof InputError) {
          setFieldErrors(e.errors);
          setSnackbar({
            open: true,
            severity: "error",
            message:
              "No se pudo guardar la evaluación. Verifique las preguntas.",
          });
        } else {
          setSnackbar({
            open: true,
            severity: "error",
            message: "Ocurrió un error al actualizar el test",
          });
        }
      } finally {
        setSubmitting(false);
      }
    },
    [test, setFieldErrors],
  );

  const handleTimeLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (newValue === "") return setTimeLimit(undefined);

    const isNumber = /^\d*$/.test(newValue);

    if (!isNumber) return;

    try {
      const parsedValue = parseInt(newValue, 10);
      setTimeLimit(parsedValue);
    } catch (e) {
      const errors = fieldErrors;
      errors.push({
        field: "timeLimitMinutes",
        message: "El valor no es un número",
      });
      setFieldErrors(errors);
    }
  };

  // AUTOGUARDADO
  useEffect(() => {
    const intervalId = setInterval(() => {
      handleSave();
    }, 60_000); // Cada minuto

    return () => clearInterval(intervalId);
  }, [handleSave]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4">Editar evaluación</Typography>
        <Box>
          <Button
            onClick={() => setModalOpen(true)}
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Asignar a Clases
          </Button>
          <Button onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            Volver
          </Button>
          <Button
            onClick={() => handleSave(true)}
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Guardar"}
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 1,
          mb: 1,
        }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="title"
          label="Nombre de la evaluacion"
          name="title"
          autoFocus
          value={test.title}
          onChange={(e) => setTitle(e.target.value)}
          error={!!titleError}
          helperText={titleError}
          disabled={isSubmitting}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="timeLimitMinutes"
          label="Límite de tiempo (minutos)"
          name="timeLimitMinutes"
          autoFocus
          value={test.timeLimitMinutes || ""}
          onChange={handleTimeLimitChange}
          error={!!timeLimitError}
          helperText={timeLimitError}
          disabled={isSubmitting}
        />
      </Box>
      <Box sx={{ mt: 2 }}>
        <ColorSelector initialColor={test.color} onColorChange={setColor} />
        {colorError && (
          <Typography color="error" variant="caption" sx={{ mt: 1 }}>
            {colorError}
          </Typography>
        )}
      </Box>

      {snackbar.open && (
        <Snackbar
          open
          autoHideDuration={4000}
          onClose={() => setSnackbar({ open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      )}

      <TestClassAssociationManager
        onClose={() => setModalOpen(false)}
        onSuccess={() => setModalOpen(false)}
        open={modalOpen}
        testId={test.id}
      />

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Preguntas
        </Typography>
        {contentError && <Alert severity="error">{contentError}</Alert>}
        <QuestionBlockEditor />
      </Box>
    </>
  );
}
