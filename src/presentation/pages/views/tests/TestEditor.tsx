import { getFieldError, type FieldErrorDTO } from "@application";
import { Box, TextField, Typography } from "@mui/material";
import { ColorSelector, QuestionBlockEditor, useTest } from "@presentation";

// Internal component to consume the store
export const TestEditor = ({ fieldErrors }: { fieldErrors: FieldErrorDTO[] }) => {
  const { test, setTitle, setColor, setTimeLimit } = useTest();

  const titleError = getFieldError("title", fieldErrors)?.message;
  const colorError = getFieldError("color", fieldErrors)?.message;
  const timeLimitError = getFieldError(
    "timeLimitMinutes",
    fieldErrors,
  )?.message;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          alignItems: "center",
          mt: 1,
          mb: 1,
        }}
      >
        <TextField
          inputProps={{ maxLength: 59 }}
          label="Título"
          value={test.title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
          error={!!titleError}
          helperText={titleError}
          sx={{ flexGrow: 1 }}
        />
        <TextField
          label="Límite de Tiempo (minutos)"
          type="number"
          value={test.timeLimitMinutes ?? ""}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            setTimeLimit(isNaN(value) || value < 0 ? undefined : value);
          }}
          margin="normal"
          error={!!timeLimitError}
          helperText={timeLimitError}
          sx={{ minWidth: "200px" }}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <ColorSelector initialColor={test.color} onColorChange={setColor} />

        {colorError && (
          <Typography color="error" variant="caption" sx={{ mt: 1 }}>
            {colorError}
          </Typography>
        )}
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Preguntas
        </Typography>
        <QuestionBlockEditor />
      </Box>
    </>
  );
};
