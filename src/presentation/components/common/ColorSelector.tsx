import { PREDEFINED_COLORS } from "@domain";
import { Box, Paper, Typography } from "@mui/material";

export type ColorSelectorProps = {
  title?: string;
  initialColor: string;
  onColorChange: (title: string) => void;
};

export function ColorSelector({
  title = "Color de tarjeta",
  initialColor,
  onColorChange,
}: ColorSelectorProps) {
  return (
    <>
      <Typography variant="subtitle1" gutterBottom sx={{ mt: 1 }}>
        {title}
      </Typography>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {PREDEFINED_COLORS.map((color) => (
          <Paper
            key={color}
            onClick={() => onColorChange(color)}
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              backgroundColor: color,
              cursor: "pointer",
              border:
                initialColor === color
                  ? "3px solid #90caf9" // Borde azul claro para el color seleccionado
                  : "3px solid transparent",
              transition: "border 0.2s",
            }}
          />
        ))}
      </Box>
    </>
  );
}
