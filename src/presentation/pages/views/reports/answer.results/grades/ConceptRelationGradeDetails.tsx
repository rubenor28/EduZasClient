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
import { Check, Clear } from "@mui/icons-material";

export function ConceptRelationGradeDetails({
  grade,
}: {
  grade: GradeVariant<QuestionTypes.ConceptRelation>;
}) {
  const isCorrect = grade.points === grade.totalPoints;
  const correctPairsSet = new Set(
    (grade.pairs || []).map((p) => `${p.conceptA}-${p.conceptB}`),
  );

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {grade.title}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="subtitle1">Tu repuesta:</Typography>
          <List dense>
            {(grade.answeredPairs || []).map((pair, index) => {
              const isPairCorrect = correctPairsSet.has(
                `${pair.conceptA}-${pair.conceptB}`,
              );
              return (
                <ListItem key={index}>
                  <ListItemIcon>
                    {isPairCorrect ? (
                      <Check color="success" />
                    ) : (
                      <Clear color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={`${pair.conceptA} - ${pair.conceptB}`} />
                </ListItem>
              );
            })}
          </List>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle1">Pares correctos</Typography>
          <List dense>
            {(grade.pairs || []).map((pair, index) => (
              <ListItem key={index}>
                <ListItemText primary={`${pair.conceptA} - ${pair.conceptB}`} />
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
            ? `Correcto (+${grade.points} puntos)`
            : `Parcialmente correcto (+${grade.points} puntos)`
        }
        color={isCorrect ? "success" : "warning"}
        variant="outlined"
      />
    </Paper>
  );
}
