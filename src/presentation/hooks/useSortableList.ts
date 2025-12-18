import { useState, useEffect } from "react";
import {
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";

export function useSortableList(initialIds: string[]) {
  const [orderedIds, setOrderedIds] = useState<string[]>(initialIds);

  // Sincronizar estado si los IDs iniciales cambian
  useEffect(() => {
    setOrderedIds(initialIds);
  }, [initialIds]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Evita que el arrastre se active en elementos interactivos
      activationConstraint: {
        distance: 5, // Requiere mover 5px para iniciar el arrastre
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setOrderedIds((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return {
    orderedIds,
    setOrderedIds,
    sensors,
    handleDragEnd,
  };
}
