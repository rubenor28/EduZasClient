import { Box, IconButton, Button, TextField, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import type { OrderingQuestion, Question } from "@domain";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import {
  QuestionBlock,
  SortableItem,
  type AnyQuestionBlockProps,
} from "@presentation";

/**
 * Componente para renderizar una pregunta de tipo "Ordenar Secuencia".
 *
 * Se suscribe al store de Zustand para obtener los datos de su pregunta
 * y las acciones para modificarla y eliminarla.
 * @param props - Las propiedades del componente.
 */
export function OrderingQuestionBlock({
  question,
  onChange,
  onDelete,
}: AnyQuestionBlockProps<OrderingQuestion>) {
  const { sequence } = question;

  const handleBaseChange = (base: Question) =>
    onChange({ ...question, ...base });

  const handleUpdate = (newProps: Partial<OrderingQuestion>) =>
    onChange({ ...question, ...newProps });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = parseInt(String(active.id).replace("item-", ""));
      const newIndex = parseInt(String(over.id).replace("item-", ""));
      handleUpdate({ sequence: arrayMove(sequence, oldIndex, newIndex) });
    }
  };

  const handleAddItem = () => {
    const newSequence = [...sequence, `Elemento ${sequence.length + 1}`];
    handleUpdate({ sequence: newSequence });
  };

  const handleRemoveItem = (index: number) => {
    const newSequence = [...sequence];
    newSequence.splice(index, 1);
    handleUpdate({ sequence: newSequence });
  };

  const handleItemTextChange = (index: number, text: string) => {
    const newSequence = [...sequence];
    newSequence[index] = text;
    handleUpdate({ sequence: newSequence });
  };

  return (
    <QuestionBlock
      question={question}
      onChange={handleBaseChange}
      onDelete={onDelete}
    >
      <Typography variant="subtitle1" sx={{ mb: 1, mt: 1 }}>
        Secuencia a ordenar
      </Typography>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sequence.map((_, index) => `item-${index}`)}
          strategy={verticalListSortingStrategy}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
            {sequence.map((text, index) => (
              <SortableItem id={`item-${index}`} key={`item-${index}`}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    width: "100%",
                  }}
                >
                  <IconButton sx={{ cursor: "grab" }} aria-label="drag-handle">
                    <DragIndicatorIcon />
                  </IconButton>
                  <TextField
                    value={text}
                    onChange={(e) =>
                      handleItemTextChange(index, e.target.value)
                    }
                    fullWidth
                    variant="standard"
                  />
                  <IconButton
                    aria-label="delete-item"
                    onClick={() => handleRemoveItem(index)}
                    disabled={sequence.length <= 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </SortableItem>
            ))}
          </Box>
        </SortableContext>
      </DndContext>
      <Button
        startIcon={<AddIcon />}
        onClick={handleAddItem}
        sx={{ alignSelf: "flex-start", mt: 2 }}
      >
        Añadir Elemento
      </Button>
    </QuestionBlock>
  );
}
