import { v4 as uuidv4 } from "uuid";
import type {
  BlockToolConstructorOptions,
  ToolboxConfig,
} from "@editorjs/editorjs";
import { BaseQuestionTool, type BaseQuestionData } from "./BaseQuestionTool";

/**
 * Representa un único par en una pregunta de relación.
 */
interface MatchPair {
  id: string;
  prompt: string;
  answer: string;
}

/**
 * Estructura de datos para la pregunta de relación de conceptos.
 */
export interface MatchingData extends BaseQuestionData {
  pairs: MatchPair[];
}

/**
 * Herramienta para crear preguntas de Relación de Conceptos.
 */
export class MatchingTool extends BaseQuestionTool<MatchingData> {
  constructor(options: BlockToolConstructorOptions<MatchingData>) {
    super(options);
    const defaultPairs = [{ id: uuidv4(), prompt: "", answer: "" }];
    this.data.pairs =
      options.data?.pairs && options.data.pairs.length > 0
        ? options.data.pairs
        : defaultPairs;
  }

  static get toolbox(): ToolboxConfig {
    return {
      title: "Relación de Conceptos",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>',
    };
  }

  protected getProfessorHint(): string {
    return "Añade pares de conceptos. La segunda columna se desordenará para que el alumno deba unirlos correctamente.";
  }

  protected renderToolBody(): HTMLElement {
    const container = this._createElement("div", [
      "flex",
      "flex-col",
      "gap-3",
      "mt-2",
    ]);

    // Encabezados de las columnas
    const headerRow = this._createElement("div", ["flex", "items-center", "gap-3", "w-full"]);
    const promptHeader = this._createElement("div", ["flex-1", "font-semibold", "text-gray-500", "text-sm", "pl-10"]);
    promptHeader.textContent = "Concepto / Pregunta";
    const answerHeader = this._createElement("div", ["flex-1", "font-semibold", "text-gray-500", "text-sm"]);
    answerHeader.textContent = "Definición / Respuesta";
    headerRow.appendChild(promptHeader);
    headerRow.appendChild(answerHeader);
    // Eliminar marcador de posición para el botón de eliminar para alinear columnas
    headerRow.appendChild(this._createElement('div', ['w-8', 'flex-shrink-0']));
    container.appendChild(headerRow);

    // Filas de pares
    this.data.pairs.forEach((pair) => {
      const pairElement = this._createPairElement(pair, container);
      container.appendChild(pairElement);
    });

    if (!this.readOnly) {
      const addButton = this._createButton("Añadir Par", () => {
        const newPair = { id: uuidv4(), prompt: "", answer: "" };
        this.data.pairs.push(newPair);
        const newPairElement = this._createPairElement(newPair, container);
        container.appendChild(newPairElement);
      });
      addButton.classList.add("self-start", "mt-4");
      this.wrapper.appendChild(addButton);
    }

    return container;
  }

  private _createPairElement(
    pair: MatchPair,
    container: HTMLElement,
  ): HTMLElement {
    const row = this._createElement("div", ["flex", "items-center", "gap-3", "w-full"]);

    const promptInput = this._createInput({
      value: pair.prompt,
      placeholder: "Concepto...",
      classes: [this.api.styles.input, "flex-1", "!m-0"],
      onInput: (e) => {
        pair.prompt = (e.target as HTMLInputElement).value;
      },
    });

    const answerInput = this._createInput({
      value: pair.answer,
      placeholder: "Definición...",
      classes: [this.api.styles.input, "flex-1", "!m-0"],
      onInput: (e) => {
        pair.answer = (e.target as HTMLInputElement).value;
      },
    });

    row.appendChild(promptInput);
    row.appendChild(answerInput);

    if (!this.readOnly) {
      const deleteButton = this._createButton("×", () => {
        if (this.data.pairs.length <= 1) return;
        this.data.pairs = this.data.pairs.filter((p) => p.id !== pair.id);
        container.removeChild(row);
      }, ['!bg-transparent', 'text-gray-400', 'hover:text-red-600', 'hover:!bg-red-100', 'rounded-full', 'w-8', 'h-8', 'flex', 'items-center', 'justify-center', 'text-2xl', 'font-bold', 'flex-shrink-0', 'transition-colors']);
      row.appendChild(deleteButton);
    }

    return row;
  }
}
