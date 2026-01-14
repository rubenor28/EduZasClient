import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Paper, Typography } from "@mui/material";
import {
  QuestionAnswerBlock,
  type QuestionAnswerBlockProps,
} from "./QuestionAnswerBlock";
import type { QuestionTypes, QuestionAnswerVariant } from "@domain";

type BlockProps = QuestionAnswerBlockProps<QuestionTypes.Ordering>;

type Answer = QuestionAnswerVariant<QuestionTypes.Ordering>;

function SortableItem({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{ p: 2, mb: 1 }}
    >
      <Typography>{id}</Typography>
    </Paper>
  );
}

export function OrderingQuestionAnswerBlock({
  question,
  answer,
  onChange,
}: BlockProps) {
  const { sequence } = answer as Answer;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sequence.indexOf(active.id as string);
      const newIndex = sequence.indexOf(over.id as string);
      onChange((prev) => ({
        ...prev,
        sequence: arrayMove(sequence, oldIndex, newIndex),
      }));
    }
  };

  return (
    <QuestionAnswerBlock question={question}>
      <Box>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sequence}
            strategy={verticalListSortingStrategy}
          >
            {sequence.map((item) => (
              <SortableItem key={item} id={item} />
            ))}
          </SortableContext>
        </DndContext>
      </Box>
    </QuestionAnswerBlock>
  );
}

