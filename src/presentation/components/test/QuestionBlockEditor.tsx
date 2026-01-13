import { Box, Button, Menu, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { QuestionTypes, type Question } from "@domain";
import { useTest } from "@presentation";
import { QuestionRenderer } from "./questions/QuestionRenderer";
import { QuestionFabric } from "@application";
import { v4 as uuidv4 } from "uuid";

/**
 * Editor principal para el contenido de un examen.
 *
 * Orquesta la adición, eliminación, actualización y reordenación de preguntas,
 * obteniendo el estado y las acciones desde el store de Zustand.
 */
export function QuestionBlockEditor() {
  const { test, orderedIds, setContent } = useTest();

  const onChange = (id: string, question: Question) => {
    setContent((prevContent) => ({ ...prevContent, [id]: question }));
  };

  const onDelete = (id: string) => {
    setContent((prevContent) => {
      const newContent = { ...prevContent };
      delete newContent[id];
      return newContent;
    });
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleAddQuestion = (type: QuestionTypes) => {
    const id = uuidv4();
    const question = QuestionFabric(type);
    setContent((prevContent) => ({ ...prevContent, [id]: question }));
    handleCloseMenu();
  };

  return (
    <Box>
      {orderedIds.length !== 0 &&
        orderedIds.map((id) => (
          <QuestionRenderer
            key={id}
            id={id}
            question={test.content[id]}
            onChange={(q) => onChange(id, q)}
            onDelete={() => onDelete(id)}
          />
        ))}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button
          startIcon={<AddIcon />}
          variant="outlined"
          onClick={handleOpenMenu}
        >
          Añadir Pregunta
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={() => handleAddQuestion(QuestionTypes.Open)}>
            Pregunta Abierta
          </MenuItem>
          <MenuItem
            onClick={() => handleAddQuestion(QuestionTypes.MultipleChoise)}
          >
            Opción Múltiple
          </MenuItem>
          <MenuItem
            onClick={() => handleAddQuestion(QuestionTypes.MultipleSelection)}
          >
            Selección Múltiple
          </MenuItem>
          <MenuItem onClick={() => handleAddQuestion(QuestionTypes.Ordering)}>
            Ordenar Secuencia
          </MenuItem>
          <MenuItem
            onClick={() => handleAddQuestion(QuestionTypes.ConceptRelation)}
          >
            Relacionar Conceptos
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
