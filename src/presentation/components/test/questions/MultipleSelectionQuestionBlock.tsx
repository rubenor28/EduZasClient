import {
  Box,
  IconButton,
  Checkbox,
  FormControlLabel,
  Button,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuidv4 } from "uuid";
import type { MultipleSelectionQuestion, Question } from "@domain";
import { QuestionBlock } from "./QuestionBlock";

/**
 * Props para el componente {@link MultipleSelectionQuestionBlock}.
 */
type MultipleSelectionQuestionBlockProps = {
  /** El estado inicial completo de la pregunta de selección múltiple. */
  initialState: MultipleSelectionQuestion;
  /** Callback que se invoca cuando cualquier propiedad de la pregunta cambia. */
  onChange: (value: MultipleSelectionQuestion) => void;
  /** Callback que se invoca para eliminar la pregunta. */
  onDelete: () => void;
};

/**
 * Componente para renderizar una pregunta de tipo "Selección Múltiple".
 *
 * Utiliza el componente {@link QuestionBlock} para los campos base (título, imagen)
 * y renderiza los controles para las opciones de respuesta con `Checkbox`,
 * permitiendo seleccionar varias respuestas correctas.
 * @param props - Las propiedades del componente.
 */
export function MultipleSelectionQuestionBlock({
  initialState,
  onChange,
  onDelete,
}: MultipleSelectionQuestionBlockProps) {
  const { title, imageUrl, options, correctOptions } = initialState;

  const handleBaseChange = (base: Question) => {
    onChange({
      ...initialState,
      ...base,
    });
  };

  const handleOptionsChange = (newOptions: Record<string, string>) => {
    onChange({
      ...initialState,
      options: newOptions,
    });
  };

  const handleCorrectOptionsChange = (optionId: string) => {
    const newCorrectOptions = correctOptions.includes(optionId)
      ? correctOptions.filter((id) => id !== optionId) // Uncheck
      : [...correctOptions, optionId]; // Check
    onChange({
      ...initialState,
      correctOptions: newCorrectOptions,
    });
  };

  const handleAddOption = () => {
    const newId = uuidv4();
    const newOptions = { ...options, [newId]: "Nueva opción" };
    onChange({
      ...initialState,
      options: newOptions,
    });
  };

  const handleRemoveOption = (id: string) => {
    const newOptions = { ...options };
    delete newOptions[id];

    const newCorrectOptions = correctOptions.filter(
      (correctId) => correctId !== id,
    );

    onChange({
      ...initialState,
      options: newOptions,
      correctOptions: newCorrectOptions,
    });
  };

  const handleOptionTextChange = (id: string, text: string) => {
    handleOptionsChange({ ...options, [id]: text });
  };

  return (
    <QuestionBlock
      initialState={{ title, imageUrl }}
      onChange={handleBaseChange}
      onDelete={onDelete}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
        {Object.entries(options).map(([id, text]) => (
          <Box key={id} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={correctOptions.includes(id)}
                  onChange={() => handleCorrectOptionsChange(id)}
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
