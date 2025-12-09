import { v4 as uuidv4 } from "uuid";
import { BaseQuestionTool, type BaseQuestionData } from "./BaseQuestionTool";
import type { BlockToolConstructorOptions } from '@editorjs/editorjs';

/**
 * Representa una única opción en una pregunta de tipo "choice".
 */
export interface ChoiceOption {
  id: string;
  text: string;
}

/**
 * Estructura de datos base para cualquier pregunta que contenga una lista de opciones.
 */
export interface BaseChoiceData extends BaseQuestionData {
  options: ChoiceOption[];
}

/**
 * Clase base abstracta para herramientas que gestionan una lista de opciones,
 * como Opción Múltiple o Selección Múltiple.
 */
export abstract class BaseChoiceTool<T extends BaseChoiceData> extends BaseQuestionTool<T> {

  constructor(options: BlockToolConstructorOptions<T>) {
    super(options);
    const defaultOptions = [{ id: uuidv4(), text: "" }];
    this.data.options = options.data?.options && options.data.options.length > 0
      ? options.data.options
      : defaultOptions;
  }

  /**
   * Renderiza el contenedor de opciones y el botón para añadir nuevas.
   * Delega la creación de cada fila de opción a la subclase.
   */
  protected renderToolBody(): HTMLElement {
    const container = this._createElement("div", ['flex', 'flex-col', 'gap-2', 'pl-2']);

    this.data.options.forEach((option) => {
      const optionElement = this._createOptionElement(option, container);
      container.appendChild(optionElement);
    });

    if (!this.readOnly) {
      const addButton = this._createButton("Añadir Opción", () => {
        const newOption = { id: uuidv4(), text: "" };
        this.data.options.push(newOption);
        const newOptionElement = this._createOptionElement(newOption, container);
        container.appendChild(newOptionElement);
      });
      addButton.classList.add("self-start", "mt-2");
      // Se añade al contenedor principal, no al de opciones
      this.wrapper.appendChild(addButton);
    }

    return container;
  }

  /**
   * Las subclases deben implementar este método para definir cómo se ve y se comporta
   * cada fila de opción (ej. con un radio button o un checkbox).
   */
  protected abstract _createOptionElement(option: ChoiceOption, container: HTMLElement): HTMLElement;
}
