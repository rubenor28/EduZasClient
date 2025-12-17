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
import { QuestionBlock } from "./QuestionBlock";
import { useControlledState } from "@presentation";

/**
 * Props para el componente {@link MultipleChoiceQuestionBlock}.
 */
type MultipleChoiceQuestionBlockProps = {
  /** El estado inicial completo de la pregunta de opción múltiple. */
  initialState: MultipleChoiseQuestion;
  /**  Callback que se invoca cuando cualquier propiedad de la pregunta cambia. */
  onChange: (value: MultipleChoiseQuestion) => void;
  /** Callback que se invoca para eliminar la pregunta. */
  onDelete: () => void;
};

/**
 * Componente para renderizar una pregunta de tipo "Opción Múltiple".
 *
 * Utiliza el componente {@link QuestionBlock} para los campos base (título, imagen)
 * y renderiza los controles para añadir, editar y eliminar las opciones de
 * respuesta como `children`. Es un componente totalmente controlado que delega
 * la gestión del estado al componente padre a través del callback `onChange`.
 * @param props - Las propiedades del componente.
 */
export function MultipleChoiceQuestionBlock({
  initialState,
  onChange,
  onDelete,
}: MultipleChoiceQuestionBlockProps) {
  const [{ title, imageUrl, options, correctOption, type }, setState] =
    useControlledState<MultipleChoiseQuestion>(initialState, onChange);

  const setBase = (base: Question) => setState((q) => ({ ...q, ...base }));

  const setOptions = (options: Record<string, string>) =>
    setState((q) => ({ ...q, options }));

  const setCorrectOption = (correctOption: string) =>
    setState((q) => ({ ...q, correctOption }));

  const handleAddOption = () => {
    const newId = uuidv4();
    const newOptions = { ...options, [newId]: "Nueva opción" };

    // Si es la primera opción, la marcamos como correcta por defecto
    if (Object.keys(options).length === 0) {
      setOptions(newOptions);
      setCorrectOption(newId);
    } else {
      setOptions(newOptions);
    }
  };

  const handleRemoveOption = (id: string) => {
    const newOptions = { ...options };
    delete newOptions[id];

    // Si la opción eliminada era la correcta, resetearla a la primera disponible
    if (correctOption === id) {
      const firstOptionId = Object.keys(newOptions)[0] ?? "";
      setOptions(newOptions);
      setCorrectOption(firstOptionId);
    } else {
      setOptions(newOptions);
    }
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
                <Radio
                  checked={correctOption === id}
                  onChange={() => setCorrectOption(id)}
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
