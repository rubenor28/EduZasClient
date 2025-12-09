import type { BlockTool, BlockToolConstructorOptions, API, ToolboxConfig, BlockAPI } from '@editorjs/editorjs';

/**
 * Estructura de datos base que todas las herramientas de pregunta deben tener.
 */
export interface BaseQuestionData {
  question: string;
  imageUrl?: string;
}

/**
 * Clase base abstracta para todas las herramientas de pregunta de Editor.js.
 * Se encarga de renderizar las partes comunes como el enunciado y las indicaciones,
 * y delega la renderización del cuerpo específico de la pregunta a las subclases.
 */
export abstract class BaseQuestionTool<T extends BaseQuestionData> implements BlockTool {
  protected api: API;
  protected readOnly: boolean;
  protected data: T;
  protected block: BlockAPI;
  protected wrapper: HTMLElement;

  constructor({ data, api, readOnly, block }: BlockToolConstructorOptions<T>) {
    this.api = api;
    this.readOnly = readOnly;
    this.block = block;
    // Asegura que data y question siempre tengan un valor inicial
    this.data = data || {} as T;
    this.data.question = data?.question || '';
    this.data.imageUrl = data?.imageUrl || '';
    this.wrapper = this._createElement('div');
  }

  /**
   * Declara que la herramienta es compatible con el modo de solo lectura.
   */
  static get isReadOnlySupported(): boolean {
    return true;
  }

  /**
   * Las subclases DEBEN sobreescribir este método estático para aparecer en la caja de herramientas.
   */
  static get toolbox(): ToolboxConfig {
    throw new Error("La configuración de 'toolbox' debe ser implementada por la subclase.");
  }

  /**
   * Construye el DOM del bloque, combinando el enunciado común y el cuerpo específico de la pregunta.
   */
  render(): HTMLElement {
    this.wrapper = this._createElement("div", ['w-full', 'flex', 'flex-col', 'gap-3', this.api.styles.block]);

    const questionContainer = this._createElement("div", ['flex', 'items-center', 'gap-2']);

    const questionInput = this._createInput({
      value: this.data.question,
      placeholder: "Escribe la pregunta...",
      classes: ['w-full', 'text-lg', 'font-semibold', 'border-b-2', 'border-gray-200', 'focus:border-blue-500', 'focus:outline-none', 'py-2', 'bg-transparent'],
      onInput: (e) => {
        this.data.question = (e.target as HTMLInputElement).value;
      },
    });
    questionContainer.appendChild(questionInput);

    if (!this.readOnly) {
      const hintIcon = this._createElement('div', ['text-gray-500', 'cursor-help', 'flex-shrink-0']);
      hintIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
      hintIcon.title = this.getProfessorHint();
      questionContainer.appendChild(hintIcon);
    }

    this.wrapper.appendChild(questionContainer);

    // --- Contenedor de URL de Imagen ---
    const imageContainer = this._createElement('div', ['flex', 'flex-col', 'gap-2', 'mt-2']);

    const urlInputWrapper = this._createElement('div', ['flex', 'items-center', 'gap-2']);
    const urlInput = this._createInput({
      value: this.data.imageUrl || '',
      placeholder: 'Pega la URL de la imagen aquí...',
      classes: [this.api.styles.input, 'flex-grow'],
      onInput: (e) => {
        const url = (e.target as HTMLInputElement).value;
        this.data.imageUrl = url;
        const preview = imageContainer.querySelector('img.image-preview') as HTMLImageElement;
        if (preview) {
          preview.src = url;
          preview.hidden = !url;
        }
      }
    });

    const imageAddButton = this._createButton(!this.data.imageUrl ? '🖼️ Añadir Imagen' : '🖼️ Cambiar/Quitar Imagen', () => {
      urlInputWrapper.hidden = !urlInputWrapper.hidden;
    }, ['mt-2', 'w-full', 'justify-center']);

    if (!this.readOnly) {
      this.wrapper.appendChild(imageAddButton);
    }

    urlInputWrapper.appendChild(urlInput);
    urlInputWrapper.hidden = true; // Ocultar inicialmente, el usuario debe hacer clic en el botón

    const imagePreview = this._createElement('img', ['image-preview', 'max-w-sm', 'h-auto', 'rounded-lg', 'border', 'border-gray-200', 'mx-auto']) as HTMLImageElement;
    if (this.data.imageUrl) {
      imagePreview.src = this.data.imageUrl;
    } else {
      imagePreview.hidden = true;
    }

    imageContainer.appendChild(urlInputWrapper);
    imageContainer.appendChild(imagePreview);
    this.wrapper.appendChild(imageContainer);

    // --- Cuerpo específico de la herramienta ---
    const toolBody = this.renderToolBody();
    this.wrapper.appendChild(toolBody);

    return this.wrapper;
  }

  /**
   * Las subclases DEBEN implementar este método para renderizar su contenido específico.
   * @returns {HTMLElement} El contenedor del cuerpo de la pregunta.
   */
  protected abstract renderToolBody(): HTMLElement;

  /**
   * Las subclases PUEDEN sobreescribir este método para dar una indicación más específica.
   * @returns {string} El texto de la indicación para el profesor.
   */
  protected getProfessorHint(): string {
    return 'Configura las opciones y la respuesta correcta para esta pregunta.';
  }

  /**
   * Guarda los datos del bloque.
   */
  save(): T {
    return this.data;
  }

  // --- Métodos de Ayuda para crear elementos del DOM ---

  protected _createElement(tagName: string, cssClasses: string | string[] = []): HTMLElement {
    const el = document.createElement(tagName);
    if (Array.isArray(cssClasses)) {
      if (cssClasses.length > 0) el.classList.add(...cssClasses);
    } else if (cssClasses) {
      el.classList.add(cssClasses);
    }
    return el;
  }

  protected _createInput(props: {
    value: string;
    placeholder: string;
    classes: string[];
    onInput: (e: Event) => void;
  }): HTMLInputElement {
    const input = this._createElement("input", props.classes) as HTMLInputElement;
    input.value = props.value;
    input.placeholder = props.placeholder;
    input.addEventListener("input", props.onInput);
    return input;
  }

  protected _createButton(text: string, onClick: () => void, classes: string[] = []): HTMLButtonElement {
    const button = this._createElement("button", [
      this.api.styles.button,
      "ce-button",
      ...classes
    ]) as HTMLButtonElement;
    button.type = "button";
    button.innerHTML = text;
    button.addEventListener("click", onClick);
    return button;
  }
}
