import type { QuestionTypes, ConceptPair } from "@domain";
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

  const handleRelationChange = (conceptA: string, conceptB: string) => {
    const existingPairIndex = answeredPairs.findIndex(
      (p) => p.conceptA === conceptA,
    );
    const newAnsweredPairs: ConceptPair[] = [...answeredPairs];

    if (existingPairIndex !== -1) {
      newAnsweredPairs[existingPairIndex] = { conceptA, conceptB };
    } else {
      newAnsweredPairs.push({ conceptA, conceptB });
    }

    onChange((prev) => ({ ...prev, answeredPairs: newAnsweredPairs }));
  };

  const getSelectedBConcepts = () => {
    return answeredPairs.map((p) => p.conceptB);
  };

  return (
    <QuestionAnswerBlock question={question}>
      <Grid container spacing={2} alignItems="center">
        {columnA.map((conceptA) => {
          const selectedB =
            answeredPairs.find((p) => p.conceptA === conceptA)?.conceptB || "";
          const selectedBConcepts = getSelectedBConcepts();

          return (
            <Grid item xs={12} container key={conceptA} spacing={2}>
              <Grid item xs={6}>
                <Typography>{conceptA}</Typography>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Relacionar con</InputLabel>
                  <Select
                    value={selectedB}
                    onChange={(e) =>
                      handleRelationChange(conceptA, e.target.value)
                    }
                  >
                    <MenuItem value="">
                      <em>Ninguno</em>
                    </MenuItem>
                    {columnB.map((conceptB) => (
                      <MenuItem
                        key={conceptB}
                        value={conceptB}
                        disabled={
                          selectedB !== conceptB &&
                          selectedBConcepts.includes(conceptB)
                        }
                      >
                        {conceptB}
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

