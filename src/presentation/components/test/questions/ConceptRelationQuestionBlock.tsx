import {
  Box,
  IconButton,
  Button,
  TextField,
  Typography,
  Grid,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import type { ConceptRelationQuestion, Question, ConceptPair } from "@domain";
import { QuestionBlock, useTest, type AnyQuestionBlockProps } from "@presentation";
import { useState } from "react";
import { getFieldError } from "@application";

const defaultInput: ConceptPair = {
  conceptA: "",
  conceptB: "",
};

/**
 * Componente para renderizar una pregunta de tipo "Relacionar Conceptos".
 *
 * Previene la creación de pares de conceptos duplicados tanto al agregar
 * nuevos pares como al editar los existentes.
 * @param props - Las propiedades del componente.
 */
export function ConceptRelationQuestionBlock({
  id,
  question,
  onChange,
  onDelete,
}: AnyQuestionBlockProps<ConceptRelationQuestion>) {
  const { concepts } = question;
  const [input, setInput] = useState<ConceptPair>(defaultInput);

  const {fieldErrors} = useTest();
  const conceptsError = getFieldError(`content[${id}].concepts`, fieldErrors)?.message;

  const handleInputChange = (value: string, field: string) =>
    setInput((prev) => ({ ...prev, [field]: value }));

  const handleBaseChange = (base: Question) =>
    onChange({ ...question, ...base });

  const handleUpdate = (newProps: Partial<ConceptRelationQuestion>) =>
    onChange({ ...question, ...newProps });

  const handleAddPair = () => {
    const trimmedA = input.conceptA.trim();
    const trimmedB = input.conceptB.trim();

    if (!trimmedA || !trimmedB) return;

    const isDuplicate = concepts.some(
      (p) => p.conceptA === trimmedA && p.conceptB === trimmedB,
    );

    if (isDuplicate) return;

    const newConcepts = [
      ...concepts,
      { conceptA: trimmedA, conceptB: trimmedB },
    ];
    handleUpdate({ concepts: newConcepts });
    setInput(defaultInput);
  };

  const handleRemovePair = (indexToRemove: number) => {
    const newConcepts = concepts.filter((_, index) => index !== indexToRemove);
    handleUpdate({ concepts: newConcepts });
  };

  const handlePairChange = (
    indexToUpdate: number,
    field: keyof ConceptPair,
    value: string,
  ) => {
    const newConcepts = concepts.map((c, i) =>
      i === indexToUpdate ? { ...c, [field]: value } : c,
    );

    const updatedPair = newConcepts[indexToUpdate];

    const isDuplicate = newConcepts.some(
      (p, i) =>
        i !== indexToUpdate &&
        p.conceptA === updatedPair.conceptA &&
        p.conceptB === updatedPair.conceptB,
    );

    if (isDuplicate) return;

    handleUpdate({ concepts: newConcepts });
  };

  return (
    <QuestionBlock
      id={id}
      question={question}
      onChange={handleBaseChange}
      onDelete={onDelete}
    >
      <Typography variant="subtitle1" sx={{ mb: 1, mt: 1 }}>
        Pares de Conceptos
      </Typography>
      {conceptsError && <Alert severity="error">{conceptsError}</Alert>}
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mt: 1 }}>
        <TextField
          label="Concepto A"
          name="conceptA"
          value={input.conceptA}
          onChange={({ target }) =>
            handleInputChange(target.value, target.name)
          }
          fullWidth
          variant="standard"
        />
        <TextField
          label="Concepto B"
          name="conceptB"
          value={input.conceptB}
          onChange={({ target }) =>
            handleInputChange(target.value, target.name)
          }
          fullWidth
          variant="standard"
        />
        <Button
          startIcon={<AddIcon />}
          onClick={handleAddPair}
          sx={{ alignSelf: "flex-end", mt: 2 }}
        >
          Añadir
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        {concepts.map((pair, index) => (
          <Grid container spacing={2} alignItems="center" key={index}>
            <Grid item xs={5}>
              <TextField
                label="Concepto A"
                value={pair.conceptA}
                onChange={({ target }) =>
                  handlePairChange(index, "conceptA", target.value)
                }
                fullWidth
                variant="standard"
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                label="Concepto B"
                value={pair.conceptB}
                onChange={({ target }) =>
                  handlePairChange(index, "conceptB", target.value)
                }
                fullWidth
                variant="standard"
              />
            </Grid>
            <Grid item xs={2} sx={{ textAlign: "right" }}>
              <IconButton
                aria-label="delete-pair"
                onClick={() => handleRemovePair(index)}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
      </Box>
    </QuestionBlock>
  );
}
