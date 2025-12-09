import type { BlockToolConstructorOptions, ToolboxConfig } from '@editorjs/editorjs';
import { BaseQuestionTool, type BaseQuestionData } from './BaseQuestionTool';

/**
 * Estructura de datos para la pregunta de Verdadero/Falso.
 */
export interface TrueFalseData extends BaseQuestionData {
  correctAnswer: boolean;
}

/**
 * Herramienta para crear preguntas de tipo Verdadero/Falso.
 */
export class TrueFalseTool extends BaseQuestionTool<TrueFalseData> {

  constructor(options: BlockToolConstructorOptions<TrueFalseData>) {
    super(options);
    // Por defecto, la respuesta correcta es 'Verdadero' si no se especifica.
    this.data.correctAnswer = options.data?.correctAnswer ?? true;
  }

  static get toolbox(): ToolboxConfig {
    return {
      title: 'Verdadero/Falso',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>',
    };
  }

  protected getProfessorHint(): string {
    return 'Elige si la afirmación es verdadera o falsa.';
  }

  /**
   * Renderiza el cuerpo de la herramienta: los botones de Verdadero y Falso.
   */
  protected renderToolBody(): HTMLElement {
    const container = this._createElement('div', ['flex', 'items-center', 'gap-4', 'mt-4', 'pl-2']);

    const trueOption = this._createChoice('Verdadero', true, container);
    const falseOption = this._createChoice('Falso', false, container);

    container.appendChild(trueOption);
    container.appendChild(falseOption);

    return container;
  }
  
  /**
   * Crea una de las dos opciones (Verdadero o Falso).
   */
  private _createChoice(text: string, value: boolean, container: HTMLElement): HTMLElement {
    const wrapper = this._createElement('div', ['flex', 'items-center', 'gap-2', 'p-3', 'rounded-lg', 'transition-colors', 'duration-200', 'cursor-pointer', 'border-2', 'border-transparent']);

    // Aplica el estilo si es la respuesta correcta seleccionada
    if (this.data.correctAnswer === value) {
      wrapper.classList.add('bg-green-100', '!border-green-300');
    }

    const radio = this._createElement('input', ['w-5', 'h-5', 'cursor-pointer']) as HTMLInputElement;
    radio.type = 'radio';
    radio.name = `tf-correct-${this.block.id}`; // Nombre único por bloque
    radio.checked = this.data.correctAnswer === value;
    
    const label = this._createElement('label', ['font-semibold', 'cursor-pointer', 'select-none']);
    label.textContent = text;
    
    // El evento onchange se pone en el contenedor para que toda el área sea clickeable
    const changeHandler = () => {
      this.data.correctAnswer = value;
      radio.checked = true;

      // Actualiza los estilos de ambos contenedores
      container.childNodes.forEach(child => {
        (child as HTMLElement).classList.remove('bg-green-100', '!border-green-300');
      });
      wrapper.classList.add('bg-green-100', '!border-green-300');
    };

    wrapper.onclick = changeHandler;
    radio.onchange = changeHandler;

    wrapper.appendChild(radio);
    wrapper.appendChild(label);
    
    return wrapper;
  }
}
