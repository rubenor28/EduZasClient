import {
  Box,
  IconButton,
  Radio,
  FormControlLabel,
  Button,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuidv4 } from "uuid";
import type { MultipleChoiseQuestion, Question } from "@domain";
import { QuestionBlock, type AnyQuestionBlockProps } from "@presentation";

/**
 * Componente para renderizar una pregunta de tipo "Opción Múltiple".
 *
 * Se suscribe al store de Zustand para obtener los datos de su pregunta
 * y las acciones para modificarla y eliminarla.
 * @param props - Las propiedades del componente.
 */
export function MultipleChoiceQuestionBlock({
  question,
  onChange,
  onDelete,
}: AnyQuestionBlockProps<MultipleChoiseQuestion>) {
  const { options, correctOption, type } = question;

  const handleBaseChange = (base: Question) =>
    onChange({ ...question, ...base });

  const handleUpdate = (newProps: Partial<MultipleChoiseQuestion>) =>
    onChange({ ...question, ...newProps });

  const handleAddOption = () => {
    const newId = uuidv4();
    const newOptions = { ...options, [newId]: "Nueva opción" };

    if (Object.keys(options).length === 0) {
      handleUpdate({ options: newOptions, correctOption: newId });
    } else {
      handleUpdate({ options: newOptions });
    }
  };

  const handleRemoveOption = (id: string) => {
    const newOptions = { ...options };
    delete newOptions[id];

    if (correctOption === id) {
      const firstOptionId = Object.keys(newOptions)[0] ?? "";
      handleUpdate({ options: newOptions, correctOption: firstOptionId });
    } else {
      handleUpdate({ options: newOptions });
    }
  };

  const handleOptionTextChange = (id: string, text: string) => {
    handleUpdate({ options: { ...options, [id]: text } });
  };

  return (
    <QuestionBlock
      question={question}
      onChange={handleBaseChange}
      onDelete={onDelete}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
        {Object.entries(options).map(([id, text]) => (
          <Box key={id} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FormControlLabel
              control={
                <Radio
                  checked={correctOption === id}
                  onChange={() => handleUpdate({ correctOption: id })}
                  name={`correct-option-${type}`}
                />
              }
              label=""
            />
            <TextField
              value={text}
              onChange={(e) => handleOptionTextChange(id, e.target.value)}
              fullWidth
              variant="standard"
            />
            <IconButton
              aria-label="delete-option"
              onClick={() => handleRemoveOption(id)}
              disabled={Object.keys(options).length <= 1}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Box>
      <Button
        startIcon={<AddIcon />}
        onClick={handleAddOption}
        sx={{ alignSelf: "flex-start", mt: 1 }}
      >
        Añadir Opción
      </Button>
    </QuestionBlock>
  );
}
