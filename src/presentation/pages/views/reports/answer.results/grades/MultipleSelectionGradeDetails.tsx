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

export function MultipleSelectionGradeDetails({
  grade,
}: {
  grade: GradeVariant<QuestionTypes.MultipleSelection>;
}) {
  const answered = new Set(grade.answeredOptions || []);
  const correct = new Set(grade.correctOptions || []);
  const isCorrect =
    answered.size === correct.size &&
    [...answered].every((x) => correct.has(x));

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {grade.title}
      </Typography>
      {Object.entries(grade.options || {}).map(([id, text]) => {
        const isSelected = answered.has(id);
        const isCorrectAnswer = correct.has(id);
        let icon = null;
        let color: "success" | "error" | "inherit" = "inherit";

        if (isSelected && isCorrectAnswer) {
          icon = <Check />;
          color = "success";
        } else if (isSelected && !isCorrectAnswer) {
          icon = <Clear />;
          color = "error";
        } else if (!isSelected && isCorrectAnswer) {
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
        label={isCorrect ? `Correct (+${grade.points} points)` : "Incorrect"}
        color={isCorrect ? "success" : "error"}
        variant="outlined"
      />
    </Paper>
  );
}
