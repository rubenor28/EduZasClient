import { v4 as uuidv4 } from "uuid";
import type { BlockToolConstructorOptions, ToolboxConfig } from '@editorjs/editorjs';
import { BaseQuestionTool, type BaseQuestionData } from './BaseQuestionTool';

/**
 * Representa una respuesta aceptable para una pregunta corta.
 */
interface AcceptableAnswer {
  id: string;
  text: string;
}

/**
 * Estructura de datos para la pregunta de Respuesta Corta.
 */
export interface ShortAnswerData extends BaseQuestionData {
  acceptableAnswers: AcceptableAnswer[];
}

/**
 * Herramienta para crear preguntas de Respuesta Corta con múltiples respuestas aceptables.
 * Permite una calificación automática básica.
 */
export class ShortAnswerTool extends BaseQuestionTool<ShortAnswerData> {

  constructor(options: BlockToolConstructorOptions<ShortAnswerData>) {
    super(options);
    const defaultAnswers = [{ id: uuidv4(), text: '' }];
    this.data.acceptableAnswers = options.data?.acceptableAnswers && options.data.acceptableAnswers.length > 0 ? options.data.acceptableAnswers : defaultAnswers;
  }

  static get toolbox(): ToolboxConfig {
    return {
      title: 'Respuesta Corta',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 14V10L14 7L10 11L7 8L3 12V16H17V14ZM17 14H20V16H17V14Z" fill="white"></path><rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor"></rect></svg>'
    };
  }

  protected getProfessorHint(): string {
    return 'Escribe una o más respuestas cortas que serán aceptadas como correctas. La comparación no distinguirá entre mayúsculas y minúsculas.';
  }

  /**
   * Renderiza el cuerpo de la herramienta: una lista de campos de entrada para respuestas aceptables.
   */
  protected renderToolBody(): HTMLElement {
    const container = this._createElement('div', ['flex', 'flex-col', 'gap-2', 'mt-4', 'pl-2']);

    this.data.acceptableAnswers.forEach(answer => {
      const answerElement = this._createAnswerElement(answer, container);
      container.appendChild(answerElement);
    });

    if (!this.readOnly) {
      const addButton = this._createButton("Añadir Respuesta", () => {
        const newAnswer = { id: uuidv4(), text: "" };
        this.data.acceptableAnswers.push(newAnswer);
        const newAnswerElement = this._createAnswerElement(newAnswer, container);
        container.appendChild(newAnswerElement);
      });
      addButton.classList.add('self-start', 'mt-4');
      this.wrapper.appendChild(addButton);
    }
    
    return container;
  }

  private _createAnswerElement(answer: AcceptableAnswer, container: HTMLElement): HTMLElement {
    const row = this._createElement('div', ['flex', 'items-center', 'gap-3', 'w-full']);

    const answerInput = this._createInput({
      value: answer.text,
      placeholder: "Respuesta aceptada...",
      classes: [this.api.styles.input, 'flex-1', '!m-0'],
      onInput: (e) => {
        answer.text = (e.target as HTMLInputElement).value;
      },
    });

    row.appendChild(answerInput);

    if (!this.readOnly) {
      const deleteButton = this._createButton("×", () => {
        if (this.data.acceptableAnswers.length <= 1) return;
        this.data.acceptableAnswers = this.data.acceptableAnswers.filter(a => a.id !== answer.id);
        container.removeChild(row);
      }, ['!bg-transparent', 'text-gray-400', 'hover:text-red-600', 'hover:!bg-red-100', 'rounded-full', 'w-8', 'h-8', 'flex', 'items-center', 'justify-center', 'text-2xl', 'font-bold', 'flex-shrink-0', 'transition-colors']);
      row.appendChild(deleteButton);
    }

    return row;
  }
}
