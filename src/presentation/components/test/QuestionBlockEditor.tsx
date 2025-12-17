import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { QuestionTypes, type AnyQuestion, type TestContent } from "@domain";
import { useControlledState } from "@presentation";
import { v4 as uuidv4 } from "uuid";
import { QuestionFabric } from "../../../application/services/question.fabric";
import { useSortableList } from "@presentation";
import { QuestionRenderer } from "./questions/QuestionRenderer";
import { SortableItem } from "../common/DnDSortableItem";

/**
 * Props para el componente {@link QuestionBlockEditor}.
 */
type QuestionBlockEditorProps = {
  /** El objeto que contiene todas las preguntas, mapeadas por su ID. */
  initialContent: TestContent;
  /** Callback que se invoca cuando el contenido del examen (preguntas) cambia. */
  onContentChange: (newContent: TestContent) => void;
};

/**
 * Editor principal para el contenido de un examen.
 *
 * Este componente orquesta la adición, eliminación, actualización y reordenación
 * (mediante drag-and-drop) de las preguntas. Utiliza un `DndContext` para la
 * funcionalidad de arrastrar y soltar y renderiza las preguntas individuales
 * a través del componente {@link QuestionRenderer}.
 * @param props - Las propiedades del componente.
 */
export function QuestionBlockEditor({
  initialContent,
  onContentChange,
}: QuestionBlockEditorProps) {
  const [content, setContent] = useControlledState<TestContent>(
    initialContent,
    onContentChange,
  );

  // Usamos el hook extraído para manejar la lógica de la lista ordenable
  const { orderedIds, setOrderedIds, sensors, handleDragEnd } = useSortableList(
    Object.keys(initialContent),
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleUpdateQuestion = (id: string, newState: AnyQuestion) => {
    setContent((prev) => ({ ...prev, [id]: newState }));
  };

  const handleDeleteQuestion = (id: string) => {
    setContent(({ [id]: _, ...rest }) => rest);
    setOrderedIds((prev) => prev.filter((qId) => qId !== id));
  };

  const handleAddQuestion = (type: AnyQuestion["type"]) => {
    const newId = uuidv4();
    setContent((prev) => ({ ...prev, [newId]: QuestionFabric(type) }));
    setOrderedIds((prev) => [...prev, newId]);
    setAnchorEl(null);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={orderedIds}
          strategy={verticalListSortingStrategy}
        >
          {orderedIds.map((id) => (
            <SortableItem id={id} key={id}>
              <QuestionRenderer
                initialState={content[id]}
                onChange={(q) => handleUpdateQuestion(id, q)}
                onDelete={() => handleDeleteQuestion(id)}
              />
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>

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

          {/* Otras preguntas */}
        </Menu>
      </Box>
    </Box>
  );
}
