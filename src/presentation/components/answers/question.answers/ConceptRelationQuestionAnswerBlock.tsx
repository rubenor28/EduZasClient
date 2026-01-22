import type { QuestionTypes } from "@domain";
import {
  QuestionAnswerBlock,
  type QuestionAnswerBlockProps,
} from "./QuestionAnswerBlock";
import {
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

type BlockProps = QuestionAnswerBlockProps<QuestionTypes.ConceptRelation>;

export function ConceptRelationQuestionAnswerBlock({
  question,
  answer,
  onChange,
}: BlockProps) {
  const { answeredPairs } = answer;
  const { columnA, columnB } = question;

  if (columnA.length !== columnB.length)
    throw Error(
      "La pregunta " +
        question.id +
        "de tipo" +
        question.type +
        "posee tamaños irregulares de pares: " +
        `ColumnaA[${columnA.length}] ColumnaB[${columnB.length}]`,
    );

  const handleRelationChange = (conceptA: string, conceptB: string) => {
    let newAnsweredPairs = [...answeredPairs];

    if (conceptB === "") {
      newAnsweredPairs = newAnsweredPairs.filter(
        (p) => p.conceptA !== conceptA,
      );
    } else {
      const existingPairIndex = newAnsweredPairs.findIndex(
        (p) => p.conceptA === conceptA,
      );

      if (existingPairIndex !== -1) {
        newAnsweredPairs[existingPairIndex] = { conceptA, conceptB };
      } else {
        newAnsweredPairs.push({ conceptA, conceptB });
      }
    }

    onChange((prev) => ({ ...prev, answeredPairs: newAnsweredPairs }));
  };

  const selectedBConcepts = answeredPairs.map((p) => p.conceptB);

  return (
    <QuestionAnswerBlock question={question}>
      <Grid container spacing={2} alignItems="center">
        {columnA.map((conceptA) => {
          const currentSelection =
            answeredPairs.find((p) => p.conceptA === conceptA)?.conceptB || "";

          return (
            <Grid item xs={12} container key={conceptA} spacing={2}>
              <Grid item xs={6}>
                <Typography>{conceptA}</Typography>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Relacionar con</InputLabel>
                  <Select
                    value={currentSelection}
                    onChange={(e) =>
                      handleRelationChange(conceptA, e.target.value)
                    }
                  >
                    <MenuItem value="">
                      <em>Ninguno</em>
                    </MenuItem>
                    {columnB.map((conceptBItem) => (
                      <MenuItem
                        key={conceptBItem}
                        value={conceptBItem}
                        disabled={
                          selectedBConcepts.includes(conceptBItem) &&
                          conceptBItem !== currentSelection
                        }
                      >
                        {conceptBItem}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    </QuestionAnswerBlock>
  );
}
