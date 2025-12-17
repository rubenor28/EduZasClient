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
import { useControlledState } from "@presentation";

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
  const [{ title, imageUrl, options, correctOptions }, setState] =
    useControlledState(initialState, onChange);

  const setBase = (base: Question) => setState((q) => ({ ...q, ...base }));

  const setOptions = (options: Record<string, string>) =>
    setState((q) => ({ ...q, options }));

  const setCorrectOptions = (correctOptions: string[]) =>
    setState((q) => ({ ...q, correctOptions }));

  const handleCorrectOptionsChange = (optionId: string) => {
    const newCorrectOptions = correctOptions.includes(optionId)
      ? correctOptions.filter((id) => id !== optionId) // Uncheck
      : [...correctOptions, optionId]; // Check

    setCorrectOptions(newCorrectOptions);
  };

  const handleAddOption = () => {
    const newId = uuidv4();
    const newOptions = { ...options, [newId]: "Nueva opción" };
    setOptions(newOptions);
  };

  const handleRemoveOption = (id: string) => {
    const newOptions = { ...options };
    delete newOptions[id];

    const newCorrectOptions = correctOptions.filter(
      (correctId) => correctId !== id,
    );

    setCorrectOptions(newCorrectOptions);
  };

  const handleOptionTextChange = (id: string, text: string) =>
    setOptions({ ...options, [id]: text });

  return (
    <QuestionBlock
      initialState={{ title, imageUrl }}
      onChange={setBase}
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
