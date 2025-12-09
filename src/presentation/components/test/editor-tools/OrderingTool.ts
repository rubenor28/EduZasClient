import { v4 as uuidv4 } from "uuid";
import type {
  BlockToolConstructorOptions,
  ToolboxConfig,
} from "@editorjs/editorjs";
import { BaseQuestionTool, type BaseQuestionData } from "./BaseQuestionTool";

/**
 * Representa un único ítem en una pregunta de ordenamiento.
 */
interface OrderableItem {
  id: string;
  text: string;
}

/**
 * Estructura de datos para la pregunta de ordenamiento. El orden del array `items` es la respuesta correcta.
 */
export interface OrderingData extends BaseQuestionData {
  items: OrderableItem[];
}

/**
 * Herramienta para crear preguntas de Ordenamiento de Secuencias.
 */
export class OrderingTool extends BaseQuestionTool<OrderingData> {
  private draggedItemId: string | null = null;

  constructor(options: BlockToolConstructorOptions<OrderingData>) {
    super(options);
    const defaultItems = [{ id: uuidv4(), text: "" }];
    this.data.items =
      options.data?.items && options.data.items.length > 0
        ? options.data.items
        : defaultItems;
  }

  static get toolbox(): ToolboxConfig {
    return {
      title: "Ordenamiento",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 15 11"></polyline><polyline points="9 17 12 20 15 17"></polyline><path d="M3 6h18M3 12h18"></path></svg>',
    };
  }

  protected getProfessorHint(): string {
    return "Añade los elementos en el orden correcto. Puedes usar el ícono de arrastre (⠿) para reordenar la secuencia.";
  }

  protected renderToolBody(): HTMLElement {
    const container = this._createElement("div", ["flex", "flex-col", "gap-2", "mt-2"]);
    this._renderAllItems(container);

    if (!this.readOnly) {
      const addButton = this._createButton("Añadir Ítem", () => {
        const newItem = { id: uuidv4(), text: "" };
        this.data.items.push(newItem);
        this._renderAllItems(container); // Re-renderizar para añadir el nuevo ítem
      });
      addButton.classList.add("self-start", "mt-4");
      this.wrapper.appendChild(addButton);
    }

    return container;
  }

  private _renderAllItems(container: HTMLElement) {
    // Limpiar ítems anteriores
    container.innerHTML = '';
    // Renderizar nueva lista
    this.data.items.forEach(item => {
      const itemElement = this._createItemElement(item, container);
      container.appendChild(itemElement);
    });
  }

  private _createItemElement(
    item: OrderableItem,
    container: HTMLElement,
  ): HTMLElement {
    const row = this._createElement("div", ["flex", "items-center", "gap-3", "w-full", "p-1", "rounded-lg"]);
    row.draggable = true;
    row.dataset.id = item.id;

    // Listeners de eventos Drag and Drop
    row.addEventListener('dragstart', (e) => this._handleDragStart(e, item));
    row.addEventListener('dragover', this._handleDragOver);
    row.addEventListener('dragleave', this._handleDragLeave);
    row.addEventListener('drop', (e) => this._handleDrop(e, item, container));
    row.addEventListener('dragend', this._handleDragEnd);

    const dragHandle = this._createElement('div', ['text-gray-500', 'cursor-grab', 'w-8', 'text-center']);
    dragHandle.innerHTML = '⠿';

    const itemInput = this._createInput({
      value: item.text,
      placeholder: "Texto del ítem...",
      classes: [this.api.styles.input, "flex-1", "!m-0"],
      onInput: (e) => {
        item.text = (e.target as HTMLInputElement).value;
      },
    });

    row.appendChild(dragHandle);
    row.appendChild(itemInput);

    if (!this.readOnly) {
      const deleteButton = this._createButton("×", () => {
        if (this.data.items.length <= 1) return;
        this.data.items = this.data.items.filter((i) => i.id !== item.id);
        this._renderAllItems(container); // Re-renderizar la lista
      }, ['!bg-transparent', 'text-gray-400', 'hover:text-red-600', 'hover:!bg-red-100', 'rounded-full', 'w-8', 'h-8', 'flex', 'items-center', 'justify-center', 'text-2xl', 'font-bold', 'flex-shrink-0', 'transition-colors']);
      row.appendChild(deleteButton);
    }

    return row;
  }

  // --- Manejadores de Drag and Drop ---

  private _handleDragStart(e: DragEvent, item: OrderableItem) {
    this.draggedItemId = item.id;
    const target = e.target as HTMLElement;
    target.classList.add('opacity-50');
  }

  private _handleDragOver(e: DragEvent) {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    target.classList.add('border-t-2', 'border-blue-500');
  }

  private _handleDragLeave(e: DragEvent) {
    const target = e.currentTarget as HTMLElement;
    target.classList.remove('border-t-2', 'border-blue-500');
  }

  private _handleDrop(e: DragEvent, targetItem: OrderableItem, container: HTMLElement) {
    e.preventDefault();
    if (this.draggedItemId === null || this.draggedItemId === targetItem.id) {
      return;
    }

    const draggedIndex = this.data.items.findIndex(i => i.id === this.draggedItemId);
    const targetIndex = this.data.items.findIndex(i => i.id === targetItem.id);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Eliminar el ítem arrastrado de su posición original
    const [draggedItem] = this.data.items.splice(draggedIndex, 1);

    // Insertarlo en la nueva posición
    this.data.items.splice(targetIndex, 0, draggedItem);

    // Re-renderizar toda la lista para reflejar el nuevo orden
    this._renderAllItems(container);
  }

  private _handleDragEnd(e: DragEvent) {
    this.draggedItemId = null;
    const target = e.target as HTMLElement;
    target.classList.remove('opacity-50');
    // Limpiar todos los indicadores de drop
    document.querySelectorAll('.border-t-2.border-blue-500').forEach(el => el.classList.remove('border-t-2', 'border-blue-500'));
  }
}
