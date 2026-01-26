import {
  Chip,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import type { GradeVariant } from "@domain";
import { QuestionTypes } from "@domain";
import { Check, Clear } from "@mui/icons-material";

export function MultipleChoiceGradeDetails({
  grade,
}: {
  grade: GradeVariant<QuestionTypes.MultipleChoise>;
}) {
  const isCorrect = grade.selectedOption === grade.correctOption;
  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {grade.title}
      </Typography>
      {Object.entries(grade.options || {}).map(([id, text]) => {
        const isSelected = grade.selectedOption === id;
        const isCorrectAnswer = grade.correctOption === id;
        let icon = null;
        let color: "success" | "error" | "inherit" = "inherit";

        if (isSelected) {
          if (isCorrectAnswer) {
            icon = <Check />;
            color = "success";
          } else {
            icon = <Clear />;
            color = "error";
          }
        } else if (isCorrectAnswer) {
          icon = <Check />;
          color = "success";
        }

        return (
          <ListItem key={id} dense>
            {icon && (
              <ListItemIcon sx={{ color: `${color}.main` }}>
                {icon}
              </ListItemIcon>
            )}
            <ListItemText
              primary={text}
              sx={{
                color: color === "inherit" ? "text.primary" : `${color}.main`,
              }}
            />
          </ListItem>
        );
      })}
      <Chip
        sx={{ mt: 1 }}
        icon={isCorrect ? <Check /> : <Clear />}
        label={isCorrect ? `Correcto (+${grade.points} points)` : `Incorrecto`}
        color={isCorrect ? "success" : "error"}
        variant="outlined"
      />
    </Paper>
  );
}
