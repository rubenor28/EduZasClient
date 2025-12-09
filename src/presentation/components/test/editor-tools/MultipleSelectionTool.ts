import type {
  BlockToolConstructorOptions,
  ToolboxConfig,
} from "@editorjs/editorjs";
import { BaseChoiceTool, type BaseChoiceData, type ChoiceOption } from "./BaseChoiceTool";

/**
 * Estructura de datos para la pregunta de selección múltiple, guardando un array de IDs de respuestas correctas.
 */
export interface MultipleSelectionData extends BaseChoiceData {
  correctAnswerIds: string[];
}

/**
 * Herramienta para crear preguntas de Selección Múltiple (una o más respuestas correctas).
 */
export class MultipleSelectionTool extends BaseChoiceTool<MultipleSelectionData> {

  constructor(options: BlockToolConstructorOptions<MultipleSelectionData>) {
    super(options);
    this.data.correctAnswerIds = options.data?.correctAnswerIds || [];
  }

  static get toolbox(): ToolboxConfig {
    return {
      title: "Selección Múltiple",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 16v-4M16 8v4m0 0H8m8 0h4M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"></path></svg>',
    };
  }

  protected getProfessorHint(): string {
    return 'Selecciona los recuadros a la izquierda de las opciones para marcarlas como respuestas correctas.';
  }

  /**
   * Crea la fila de una opción, incluyendo un checkbox para la selección múltiple.
   */
  protected _createOptionElement(
    option: ChoiceOption,
    container: HTMLElement,
  ): HTMLElement {
    const optionWrapper = this._createElement("div", ['flex', 'items-center', 'gap-3', 'w-full', 'p-2', 'rounded-lg', 'transition-colors', 'duration-200']);
    
    const isCorrect = this.data.correctAnswerIds.includes(option.id);
    if (isCorrect) {
      optionWrapper.classList.add('bg-green-100');
    }

    const checkbox = this._createElement("input", ['w-5', 'h-5', 'cursor-pointer', 'flex-shrink-0', 'rounded']) as HTMLInputElement;
    checkbox.type = "checkbox";
    checkbox.checked = isCorrect;
    checkbox.onchange = () => {
      if (checkbox.checked) {
        this.data.correctAnswerIds.push(option.id);
        optionWrapper.classList.add('bg-green-100');
      } else {
        this.data.correctAnswerIds = this.data.correctAnswerIds.filter(id => id !== option.id);
        optionWrapper.classList.remove('bg-green-100');
      }
    };

    const optionInput = this._createInput({
      value: option.text,
      placeholder: "Texto de la opción...",
      classes: [this.api.styles.input, 'flex-grow', '!m-0'],
      onInput: (e) => {
        const opt = this.data.options.find((o) => o.id === option.id);
        if (opt) {
          opt.text = (e.target as HTMLInputElement).value;
        }
      },
    });

    optionWrapper.appendChild(checkbox);
    optionWrapper.appendChild(optionInput);

    if (!this.readOnly) {
      const deleteButton = this._createButton("×", () => {
        if (this.data.options.length <= 1) return;
        this.data.options = this.data.options.filter((o) => o.id !== option.id);
        container.removeChild(optionWrapper);
        this.data.correctAnswerIds = this.data.correctAnswerIds.filter(id => id !== option.id);
      }, ['!bg-transparent', 'text-gray-400', 'hover:text-red-600', 'hover:!bg-red-100', 'rounded-full', 'w-8', 'h-8', 'flex', 'items-center', 'justify-center', 'text-2xl', 'font-bold', 'flex-shrink-0', 'transition-colors']);
      optionWrapper.appendChild(deleteButton);
    }

    return optionWrapper;
  }
}
