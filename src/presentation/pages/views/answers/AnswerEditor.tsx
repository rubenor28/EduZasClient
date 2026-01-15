import { defaultQuestionAnswer } from "@domain";
import { SimpleTimer, useAnswer } from "@presentation";
import { QuestionAnswerRenderer } from "./QuestionAnswerRenderer";
import { useEffect, useState } from "react";
import { apiPut, InputError } from "@application";
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
  } = useAnswer();

  const handleSave = async (manual: boolean) => {
    try {
      setLoading(true);
      console.log(answer);
      await apiPut("/answers", JSON.stringify(answer));
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

          let questionAnswer = answer.content[id];

          if (questionAnswer === undefined) {
            questionAnswer = defaultQuestionAnswer(q);
            setAnswerQuestion(id, questionAnswer);
          }

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
