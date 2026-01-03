import {
  Box,
  IconButton,
  Radio,
  FormControlLabel,
  Button,
  TextField,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuidv4 } from "uuid";
import type { MultipleChoiseQuestion } from "@domain";
import {
  QuestionBlock,
  useTest,
  type AnyQuestionBlockProps,
} from "@presentation";
import { getFieldError } from "@application";

/**
 * Componente para renderizar una pregunta de tipo "Opción Múltiple".
 *
 * Se suscribe al store de Zustand para obtener los datos de su pregunta
 * y las acciones para modificarla y eliminarla.
 * @param props - Las propiedades del componente.
 */
export function MultipleChoiceQuestionBlock({
  id,
  question,
  onChange,
  onDelete,
}: AnyQuestionBlockProps<MultipleChoiseQuestion>) {
  const { options, correctOption, type } = question;

  const { fieldErrors } = useTest();
  const optionsError = getFieldError(
    `content[${id}].options`,
    fieldErrors,
  )?.message;
  const correctOptionError = getFieldError(
    `content[${id}].correctOption`,
    fieldErrors,
  )?.message;

  const handleUpdate = (newProps: Partial<MultipleChoiseQuestion>) =>
    onChange((prev) => ({ ...prev, ...newProps }));

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
      id={id}
      question={question}
      onChange={onChange}
      onDelete={onDelete}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
        {optionsError && (
          <Alert severity="error">{`Error en opciones: ${optionsError}`}</Alert>
        )}
        {Object.entries(options).map(([id, text]) => (
          <>
            {id === correctOption && correctOptionError && (
              <Alert
                key={id}
                severity="error"
              >{`Error en opción correcta: ${correctOptionError}`}</Alert>
            )}
            <Box
              key={id}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
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
          </>
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
