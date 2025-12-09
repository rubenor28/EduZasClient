import type { BlockToolConstructorOptions, ToolboxConfig } from '@editorjs/editorjs';
import { BaseQuestionTool, type BaseQuestionData } from './BaseQuestionTool';

/**
 * Herramienta de Editor.js para crear preguntas de respuesta abierta.
 * Este bloque no tiene una respuesta correcta configurable en el editor
 * y está diseñado para calificación manual.
 */
export class OpenQuestionTool extends BaseQuestionTool<BaseQuestionData> {

  constructor(options: BlockToolConstructorOptions<BaseQuestionData>) {
    super(options);
  }

  /**
   * Define el ícono y título para la caja de herramientas de Editor.js.
   */
  static get toolbox(): ToolboxConfig {
    return {
      title: 'Pregunta Abierta',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
    };
  }

  /**
   * Renderiza el cuerpo de la herramienta en el editor, que en este caso
   * es un marcador de posición visual para el área de respuesta del alumno.
   */
  protected renderToolBody(): HTMLElement {
    const container = this._createElement('div');
    const placeholder = this._createElement('textarea', [
        'w-full', 'p-3', 'border', 'border-dashed', 'border-gray-300', 
        'rounded-lg', 'bg-gray-50', 'text-gray-500', 'text-sm', 'h-24', 'resize-none'
    ]) as HTMLTextAreaElement;
    
    placeholder.textContent = 'Los estudiantes escribirán su respuesta de texto libre aquí...';
    placeholder.readOnly = true;

    container.appendChild(placeholder);
    return container;
  }

  /**
   * Proporciona la indicación específica para el profesor en el modo de edición.
   */
  protected getProfessorHint(): string {
    return 'Este bloque permite una respuesta de texto libre que requiere calificación manual.';
  }

  /**
   * Guarda los datos del bloque. Para una pregunta abierta, solo es el enunciado.
   */
  save(): BaseQuestionData {
    // La data (el enunciado) se actualiza automáticamente en la clase base.
    return this.data;
  }
}
