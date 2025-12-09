/**
 * URL del backend establecida en las variables de entorno.
 * Si no se define se utiliza http://localhost:5018
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5018";


/**
 * Colores predefinidos para selectores de colores
 */
export const PREDEFINED_COLORS = [
  "#2E7D32", "#1565C0", "#C62828", "#4527A0",
  "#D84315", "#00695C", "#AD1457", "#6A1B9A",
];

/**
 * Configuracion I18N para español
 */
export const EDITOR_I18N = {
  messages: {
    toolNames: {
      "Text": "Párrafo",
      "Heading": "Encabezado",
      "MultipleChoice": "Opción Múltiple",
      "OpenQuestion": "Pregunta Abierta",
      "MultipleSelection": "Selección Múltiple",
      "Matching": "Relación de Conceptos",
      "Ordering": "Ordenamiento",
      "TrueFalse": "Verdadero/Falso",
      "ShortAnswer": "Respuesta Corta",
      "Cloze": "Rellenar Huecos",
    },
    tools: {
      "warning": {
        "Title": "Título",
        "Message": "Mensaje",
      },
    },
    blockTunes: {
      "delete": {
        "Delete": "Eliminar",
        "Click to delete": "Confirmar eliminación"
      },
      "moveUp": {
        "Move up": "Mover arriba"
      },
      "moveDown": {
        "Move down": "Mover abajo"
      }
    },
  }
};
