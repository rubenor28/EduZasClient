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
        Your answer: {grade.answer}
      </Typography>
      {grade.manualGrade !== null && (
        <Chip
          label={
            grade.manualGrade
              ? `Graded as correct (+${grade.points} points)`
              : `Graded as incorrect`
          }
          color={grade.manualGrade ? "success" : "error"}
          variant="outlined"
        />
      )}
      {grade.feedback && (
        <Typography sx={{ mt: 1 }} variant="body2">
          Feedback: {grade.feedback}
        </Typography>
      )}
    </Paper>
  );
}
