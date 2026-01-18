import { AUTOMATED_FETCHS_ALLOWED, defaultQuestionAnswer } from "@domain";
import { SimpleTimer, useAnswer } from "@presentation";
import { QuestionAnswerRenderer } from "./QuestionAnswerRenderer";
import { useEffect, useState } from "react";
import { apiPut, InputError, type AnswerUpdateStudent } from "@application";
import { Alert, Snackbar, Box, Typography, Button } from "@mui/material"; // Added Box and Typography

type Snackbar =
  | { open: false }
  | { open: true; message: string; severity: "error" | "success" };

export function AnswerEditor() {
  const [snackbar, setSnackbar] = useState<Snackbar>({ open: false });

  const {
    answer,
    test,
    setAnswerQuestion,
    fieldErrors,
    setFieldErrors,
    isLoading,
    setLoading,
    setContent,
  } = useAnswer();

  useEffect(() => {
    const newContent = { ...answer.content };
    let changed = false;
    test.content.forEach((q) => {
      if (newContent[q.id] === undefined) {
        newContent[q.id] = defaultQuestionAnswer(q);
        changed = true;
      }
    });

    if (changed) {
      setContent(newContent);
    }
  }, [test.content, answer.content, setContent]);

  const handleSave = async (manual: boolean) => {
    if (!manual && !AUTOMATED_FETCHS_ALLOWED) return;

    try {
      setLoading(true);
      var update: AnswerUpdateStudent = { ...answer };
      await apiPut("/answers", update);
      if (manual)
        setSnackbar({
          open: true,
          severity: "success",
          message: "Se ha guardado con éxito",
        });
    } catch (e) {
      if (e instanceof InputError) {
        setFieldErrors(e.errors);
        setSnackbar({
          open: true,
          severity: "error",
          message: "No se pudo guardar, favor de revisar respuestas",
        });
      } else {
        setSnackbar({
          open: true,
          severity: "error",
          message: "Ocurrió un error inesperado",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleSave(false);
    }, 60_000); // Cada minuto

    return () => clearInterval(intervalId);
  }, [handleSave]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          bgcolor: "background.paper",
          p: 2, // Padding header
          boxShadow: 1,
        }}
      >
        <Typography variant="h4">{test.title}</Typography>
        {test.deadline && <SimpleTimer endTime={new Date(test.deadline)} />}
        <Button disabled={isLoading} onClick={() => handleSave(true)}>
          Guardar
        </Button>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        {" "}
        {/* Scrollable content area */}
        {test.content.map((q) => {
          const { id } = q;

          const questionAnswer = answer.content[id];
          if (questionAnswer === undefined) return null;

          return (
            <QuestionAnswerRenderer
              key={id}
              answer={questionAnswer}
              question={q}
              onChange={(q) => setAnswerQuestion(id, q)}
            />
          );
        })}
      </Box>

      {snackbar.open && (
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbar({ open: false })}
            severity="success"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}
