import {
  Box,
  IconButton,
  Checkbox,
  FormControlLabel,
  Button,
  TextField,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuidv4 } from "uuid";
import type { MultipleSelectionQuestion } from "@domain";
import {
  QuestionBlock,
  useTest,
  type AnyQuestionBlockProps,
} from "@presentation";
import { getFieldError } from "@application";

/**
 * Componente para renderizar una pregunta de tipo "Selección Múltiple".
 *
 * Se suscribe al store de Zustand para obtener los datos de su pregunta
 * y las acciones para modificarla y eliminarla.
 * @param props - Las propiedades del componente.
 */
export function MultipleSelectionQuestionBlock({
  id,
  question,
  onChange,
  onDelete,
}: AnyQuestionBlockProps<MultipleSelectionQuestion>) {
  const { options, correctOptions } = question;

  const { fieldErrors } = useTest();
  const optionsError = getFieldError(
    `content[${id}].options`,
    fieldErrors,
  )?.message;
  const correctOptionsError = getFieldError(
    `content[${id}].correctOptions`,
    fieldErrors,
  )?.message;

  const handleUpdate = (newProps: Partial<MultipleSelectionQuestion>) =>
    onChange((prev) => ({ ...prev, ...newProps }));

  const handleCorrectOptionsChange = (optionId: string) => {
    const newCorrectOptions = correctOptions.includes(optionId)
      ? correctOptions.filter((id) => id !== optionId) // Uncheck
      : [...correctOptions, optionId]; // Check
    handleUpdate({ correctOptions: newCorrectOptions });
  };

  const handleAddOption = () => {
    const newId = uuidv4();
    const newOptions = { ...options, [newId]: "Nueva opción" };
    handleUpdate({ options: newOptions });
  };

  const handleRemoveOption = (id: string) => {
    const newOptions = { ...options };
    delete newOptions[id];

    const newCorrectOptions = correctOptions.filter(
      (correctId) => correctId !== id,
    );
    handleUpdate({ options: newOptions, correctOptions: newCorrectOptions });
  };

  const handleOptionTextChange = (id: string, text: string) => {
    handleUpdate({ options: { ...options, [id]: text } });
  };

  return (
    <QuestionBlock
      id={id}
      question={question}
      onChange={onChange}
      onDelete={onDelete}
    >
      {optionsError && (
        <Alert severity="error">{`Error en opciones: ${optionsError}`}</Alert>
      )}

      {correctOptionsError && (
        <Alert
          severity="error"
        >{`Error en opciones correctas: ${correctOptionsError}`}</Alert>
      )}

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

