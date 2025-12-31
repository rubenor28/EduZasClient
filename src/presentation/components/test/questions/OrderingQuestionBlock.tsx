import {
  Box,
  IconButton,
  Button,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import type { OrderingQuestion, Question } from "@domain";
import {
  QuestionBlock,
  useTest,
  type AnyQuestionBlockProps,
} from "@presentation";
import { getFieldError } from "@application";

/**
 * Componente para renderizar una pregunta de tipo "Ordenar Secuencia".
 *
 * Se suscribe al store de Zustand para obtener los datos de su pregunta
 * y las acciones para modificarla y eliminarla.
 * @param props - Las propiedades del componente.
 */
export function OrderingQuestionBlock({
  id,
  question,
  onChange,
  onDelete,
}: AnyQuestionBlockProps<OrderingQuestion>) {
  const { sequence } = question;

  const { fieldErrors } = useTest();
  const sequenceError = getFieldError(`content[${id}].sequence`, fieldErrors)?.message;

  const handleBaseChange = (base: Question) =>
    onChange({ ...question, ...base });

  const handleUpdate = (newProps: Partial<OrderingQuestion>) =>
    onChange({ ...question, ...newProps });

  const handleMoveItem = (fromIndex: number, toIndex: number) => {
    if (
      fromIndex < 0 ||
      fromIndex >= sequence.length ||
      toIndex < 0 ||
      toIndex >= sequence.length
    ) {
      return;
    }
    const newSequence = [...sequence];
    const [item] = newSequence.splice(fromIndex, 1);
    newSequence.splice(toIndex, 0, item);
    handleUpdate({ sequence: newSequence });
  };

  const handleAddItem = () => {
    const newSequence = [...sequence, `Elemento ${sequence.length + 1}`];
    handleUpdate({ sequence: newSequence });
  };

  const handleRemoveItem = (index: number) => {
    const newSequence = [...sequence];
    newSequence.splice(index, 1);
    handleUpdate({ sequence: newSequence });
  };

  const handleItemTextChange = (index: number, text: string) => {
    const newSequence = [...sequence];
    newSequence[index] = text;
    handleUpdate({ sequence: newSequence });
  };

  return (
    <QuestionBlock
      id={id}
      question={question}
      onChange={handleBaseChange}
      onDelete={onDelete}
    >
      <Typography variant="subtitle1" sx={{ mb: 1, mt: 1 }}>
        Secuencia a ordenar
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
        {sequenceError && <Alert severity="error">{sequenceError}</Alert>}
        {sequence.map((text, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <IconButton
                aria-label="move-up"
                size="small"
                onClick={() => handleMoveItem(index, index - 1)}
                disabled={index === 0}
              >
                <ArrowUpwardIcon fontSize="inherit" />
              </IconButton>
              <IconButton
                aria-label="move-down"
                size="small"
                onClick={() => handleMoveItem(index, index + 1)}
                disabled={index === sequence.length - 1}
              >
                <ArrowDownwardIcon fontSize="inherit" />
              </IconButton>
            </Box>
            <TextField
              value={text}
              onChange={(e) => handleItemTextChange(index, e.target.value)}
              fullWidth
              variant="standard"
            />
            <IconButton
              aria-label="delete-item"
              onClick={() => handleRemoveItem(index)}
              disabled={sequence.length <= 1}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Box>
      <Button
        startIcon={<AddIcon />}
        onClick={handleAddItem}
        sx={{ alignSelf: "flex-start", mt: 2 }}
      >
        Añadir Elemento
      </Button>
    </QuestionBlock>
  );
}
