import { Chip, Paper, Typography } from "@mui/material";
import type { GradeVariant } from "@domain";
import { QuestionTypes } from "@domain";

export function OpenGradeDetails({
  grade,
}: {
  grade: GradeVariant<QuestionTypes.Open>;
}) {
  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {grade.title}
      </Typography>
      <Typography variant="body1" paragraph>
        Respuesta: {grade.text}
      </Typography>
      {grade.manualGrade !== null && (
        <Chip
          label={
            grade.manualGrade
              ? `Calificada como correcta (+${grade.points} puntos)`
              : `Calificada como incorrecta`
          }
          color={grade.manualGrade ? "success" : "error"}
          variant="outlined"
        />
      )}
    </Paper>
  );
}
