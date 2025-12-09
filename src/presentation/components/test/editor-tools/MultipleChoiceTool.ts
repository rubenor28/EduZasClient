import { v4 as uuidv4 } from "uuid";
import type {
  BlockToolConstructorOptions,
  ToolboxConfig,
} from "@editorjs/editorjs";
import { BaseChoiceTool, type BaseChoiceData, type ChoiceOption } from "./BaseChoiceTool";

/**
 * Estructura de datos para la pregunta de opción múltiple, guardando el ID de la única respuesta correcta.
 */
export interface MultipleChoiceData extends BaseChoiceData {
  correctAnswerId: string | null;
}

/**
 * Herramienta para crear preguntas de Opción Múltiple de respuesta única.
 */
export class MultipleChoiceTool extends BaseChoiceTool<MultipleChoiceData> {
  private uniqueId: string;

  constructor(options: BlockToolConstructorOptions<MultipleChoiceData>) {
    super(options);
    this.uniqueId = uuidv4();

    // Si no hay respuesta correcta definida (ej. en un bloque nuevo), se asigna la primera opción.
    if (!this.data.correctAnswerId && this.data.options.length > 0) {
      this.data.correctAnswerId = this.data.options[0].id;
    }
  }

  static get toolbox(): ToolboxConfig {
    return {
      title: "Opción Múltiple",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9h4v2h-4zm0-4h4v2h-4z"/></svg>',
    };
  }

  protected getProfessorHint(): string {
    return 'Selecciona el círculo a la izquierda de la opción para marcarla como la respuesta correcta.';
  }

  /**
   * Crea la fila de una opción, incluyendo el radio button para la selección.
   */
  protected _createOptionElement(
    option: ChoiceOption,
    container: HTMLElement,
  ): HTMLElement {
    const optionWrapper = this._createElement("div", ['flex', 'items-center', 'gap-3', 'w-full', 'p-2', 'rounded-lg', 'transition-colors', 'duration-200']);
    
    if (this.data.correctAnswerId === option.id) {
      optionWrapper.classList.add('bg-green-100');
    }

    const radio = this._createElement("input", ['w-5', 'h-5', 'cursor-pointer', 'flex-shrink-0']) as HTMLInputElement;
    radio.type = "radio";
    radio.name = `mc-correct-${this.uniqueId}`;
    radio.checked = this.data.correctAnswerId === option.id;
    radio.onchange = () => {
      this.data.correctAnswerId = option.id;
      // Actualiza los estilos de todas las opciones en este bloque
      container.childNodes.forEach(child => {
        (child as HTMLElement).classList.remove('bg-green-100');
      });
      optionWrapper.classList.add('bg-green-100');
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

    optionWrapper.appendChild(radio);
    optionWrapper.appendChild(optionInput);

    if (!this.readOnly) {
      const deleteButton = this._createButton("×", () => {
        if (this.data.options.length <= 1) return;
        this.data.options = this.data.options.filter((o) => o.id !== option.id);
        container.removeChild(optionWrapper);
        if (this.data.correctAnswerId === option.id) {
          this.data.correctAnswerId = null;
        }
      }, ['!bg-transparent', 'text-gray-400', 'hover:text-red-600', 'hover:!bg-red-100', 'rounded-full', 'w-8', 'h-8', 'flex', 'items-center', 'justify-center', 'text-2xl', 'font-bold', 'flex-shrink-0', 'transition-colors']);
      optionWrapper.appendChild(deleteButton);
    }

    return optionWrapper;
  }
}
