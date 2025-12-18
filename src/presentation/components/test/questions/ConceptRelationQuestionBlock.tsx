import {
  Box,
  IconButton,
  Button,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuidv4 } from "uuid";
import type { ConceptRelationQuestion, Question, ConceptPair } from "@domain";
import { QuestionBlock, type AnyQuestionBlockProps } from "@presentation";

/**
 * Componente para renderizar una pregunta de tipo "Relacionar Conceptos".
 *
 * Se suscribe al store de Zustand para obtener los datos de su pregunta
 * y las acciones para modificarla y eliminarla.
 * @param props - Las propiedades del componente.
 */
export function ConceptRelationQuestionBlock({
  question,
  onChange,
  onDelete,
}: AnyQuestionBlockProps<ConceptRelationQuestion>) {
  const { concepts } = question;

  const handleBaseChange = (base: Question) =>
    onChange({ ...question, ...base });

  const handleUpdate = (newProps: Partial<ConceptRelationQuestion>) =>
    onChange({ ...question, ...newProps });

  const handleAddPair = () => {
    const newId = uuidv4();
    const newConcepts = {
      ...concepts,
      [newId]: { conceptA: "Concepto A", conceptB: "Concepto B" },
    };
    handleUpdate({ concepts: newConcepts });
  };

  const handleRemovePair = (id: string) => {
    const newConcepts = { ...concepts };
    delete newConcepts[id];
    handleUpdate({ concepts: newConcepts });
  };

  const handleConceptChange = (
    id: string,
    part: keyof ConceptPair,
    text: string,
  ) => {
    const newConcepts = {
      ...concepts,
      [id]: {
        ...concepts[id],
        [part]: text,
      },
    };
    handleUpdate({ concepts: newConcepts });
  };

  return (
    <QuestionBlock
      question={question}
      onChange={handleBaseChange}
      onDelete={onDelete}
    >
      <Typography variant="subtitle1" sx={{ mb: 1, mt: 1 }}>
        Pares de Conceptos
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        {Object.entries(concepts).map(([id, pair]) => (
          <Grid container spacing={2} key={id} alignItems="center">
            <Grid item xs={5}>
              <TextField
                label="Concepto A"
                value={pair.conceptA}
                onChange={(e) =>
                  handleConceptChange(id, "conceptA", e.target.value)
                }
                fullWidth
                variant="standard"
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                label="Concepto B"
                value={pair.conceptB}
                onChange={(e) =>
                  handleConceptChange(id, "conceptB", e.target.value)
                }
                fullWidth
                variant="standard"
              />
            </Grid>
            <Grid item xs={2} sx={{ textAlign: "right" }}>
              <IconButton
                aria-label="delete-pair"
                onClick={() => handleRemovePair(id)}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
      </Box>
      <Button
        startIcon={<AddIcon />}
        onClick={handleAddPair}
        sx={{ alignSelf: "flex-start", mt: 2 }}
      >
        Añadir Par
      </Button>
    </QuestionBlock>
  );
}
