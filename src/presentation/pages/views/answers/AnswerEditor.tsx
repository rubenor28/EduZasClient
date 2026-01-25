import { AUTOMATED_FETCHS_ALLOWED, defaultQuestionAnswer } from "@domain";
import { SimpleTimer, useAnswer } from "@presentation";
import { QuestionAnswerRenderer } from "./QuestionAnswerRenderer";
import { useEffect, useState, useCallback } from "react";
import { apiPut, InputError, type AnswerUpdateStudent } from "@application";
import { Alert, Snackbar, Box, Typography, Button } from "@mui/material";
import { WaitingGradeProps } from "./WaitingGrade";

type SnackbarState =
  | { open: false }
  | { open: true; message: string; severity: "error" | "success" };

export function AnswerEditor() {
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    open: false,
  });

  const {
    answer,
    test,
    setAnswer,
    setAnswerQuestion,
    setFieldErrors,
    isLoading,
    setLoading,
    setContent,
  } = useAnswer();

  if (answer.tryFinished && !answer.graded) return <WaitingGradeProps />;
  else if (answer.tryFinished && answer.graded)
    return <h1>Reporte calificaicones</h1>;
  else if (answer.tryFinished && !answer.graded) throw Error("Estado inválido");

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

  const handleFinishTry = useCallback(async () => {
    if (
      !window.confirm(
        "¿Seguro que quieres finalizar tu exámen? Esta acción no puede deshacerse",
      )
    )
      return;

    await handleSave(false);

    setLoading(true);
    const { userId, classId, testId } = answer;
    await apiPut(`/answers/${userId}/${classId}/${testId}/try`, {});
    setAnswer((prev) =>
      prev !== null ? { ...prev, tryFinished: true } : null,
    );
  }, [answer, setLoading]);

  const handleSave = useCallback(
    async (manual: boolean) => {
      if (!manual && !AUTOMATED_FETCHS_ALLOWED) return;

      try {
        setLoading(true);
        const update: AnswerUpdateStudent = { ...answer };
        await apiPut("/answers", update);
        console.log(`Ok. Manual: ${manual}`);
        if (manual) {
          setSnackbarState({
            open: true,
            severity: "success",
            message: "Se ha guardado con éxito",
          });
        }
      } catch (e) {
        console.error("Error", e);

        if (e instanceof InputError) {
          setFieldErrors(e.errors);
          setSnackbarState({
            open: true,
            severity: "error",
            message: "No se pudo guardar, favor de revisar respuestas",
          });
        } else {
          setSnackbarState({
            open: true,
            severity: "error",
            message: "Ocurrió un error inesperado",
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [answer, setLoading, setFieldErrors],
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleSave(false);
    }, 60_000);

    return () => clearInterval(intervalId);
  }, [handleSave]);

  const handleCloseSnackbar = () => {
    setSnackbarState({ open: false });
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            bgcolor: "background.paper",
            p: 2,
            boxShadow: 1,
          }}
        >
          <Typography variant="h4">{test.title}</Typography>
          {test.deadline && (
            <SimpleTimer
              endTime={new Date(test.deadline)}
              onFinish={window.location.reload}
            />
          )}
          <Button disabled={isLoading} onClick={() => handleSave(true)}>
            Guardar
          </Button>
          <Button disabled={isLoading} onClick={handleFinishTry}>
            Finalizar intento
          </Button>
        </Box>

        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
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
      </Box>

      <Snackbar
        open={snackbarState.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ zIndex: 9999 }}
      >
        {snackbarState.open ? (
          <Alert
            severity={snackbarState.severity}
            sx={{ width: "100%" }}
            onClose={handleCloseSnackbar}
          >
            {snackbarState.message}
          </Alert>
        ) : (
          <div />
        )}
      </Snackbar>
    </>
  );
}
