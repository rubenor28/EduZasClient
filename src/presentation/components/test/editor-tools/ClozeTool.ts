import type { BlockToolConstructorOptions, ToolboxConfig } from '@editorjs/editorjs';
import { BaseQuestionTool, type BaseQuestionData } from './BaseQuestionTool';

/**
 * Estructura de datos para la pregunta de Rellenar Huecos (Cloze).
 */
export interface ClozeData extends BaseQuestionData {
  textWithBlanks: string;
}

/**
 * Herramienta para crear preguntas de Rellenar Huecos (Cloze).
 */
export class ClozeTool extends BaseQuestionTool<ClozeData> {

  private textarea: HTMLTextAreaElement | null = null;

  constructor(options: BlockToolConstructorOptions<ClozeData>) {
    super(options);
    this.data.textWithBlanks = options.data?.textWithBlanks || '';
  }

  static get toolbox(): ToolboxConfig {
    return {
      title: 'Rellenar Huecos',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>',
    };
  }

  protected getProfessorHint(): string {
    return 'Escribe un párrafo y usa {{respuesta}} para un hueco de texto o {{correcta|opción2}} para un menú desplegable.';
  }

  /**
   * Renderiza un textarea para que el profesor escriba el texto con la sintaxis de huecos.
   */
  protected renderToolBody(): HTMLElement {
    const container = this._createElement('div', ['flex', 'flex-col', 'gap-2', 'mt-2']);

    this.textarea = this._createElement('textarea', [
        'w-full', 'p-3', 'border', 'border-gray-300', 
        'rounded-lg', 'bg-white', 'h-32', 'resize-y',
        'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500'
    ]) as HTMLTextAreaElement;
    
    this.textarea.placeholder = 'Escribe tu texto aquí. Ejemplo: La capital de Francia es {{París|Londres|Berlín}}.';
    this.textarea.value = this.data.textWithBlanks;
    this.textarea.oninput = () => {
      if (this.textarea) {
        this.data.textWithBlanks = this.textarea.value;
      }
    };
    
    const syntaxHint = this._createElement('div', ['text-xs', 'text-gray-500', 'pl-1']);
    syntaxHint.innerHTML = `<b>Sintaxis:</b> <code>{{respuesta_correcta}}</code> para texto libre. <code>{{correcta|opción2|opción3}}</code> para menú desplegable.`;

    container.appendChild(this.textarea);
    container.appendChild(syntaxHint);

    return container;
  }
  
  /**
   * Guarda los datos del bloque.
   */
  save(): ClozeData {
    // Los datos ya se actualizan en tiempo real gracias al evento oninput
    return this.data;
  }
}
