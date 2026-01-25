import {
  Chip,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import type { GradeVariant } from "@domain";
import { QuestionTypes } from "@domain";
import { Check, Clear, DragHandle } from "@mui/icons-material";

export function OrderingGradeDetails({
  grade,
}: {
  grade: GradeVariant<QuestionTypes.Ordering>;
}) {
  const isCorrect = grade.points === grade.totalPoints;
  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {grade.title}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="subtitle1">Your Answer</Typography>
          <List dense>
            {(grade.answeredSequence || []).map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  {(grade.sequence || [])[index] === item ? (
                    <Check color="success" />
                  ) : (
                    <Clear color="error" />
                  )}
                </ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle1">Correct Order</Typography>
          <List dense>
            {(grade.sequence || []).map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <DragHandle />
                </ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
      <Chip
        sx={{ mt: 1 }}
        icon={isCorrect ? <Check /> : <Clear />}
        label={
          isCorrect
            ? `Correct (+${grade.points} points)`
            : `Partially correct (+${grade.points} points)`
        }
        color={isCorrect ? "success" : "warning"}
        variant="outlined"
      />
    </Paper>
  );
}
