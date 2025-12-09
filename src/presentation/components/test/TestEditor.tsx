import { useEffect, useRef, useState } from "react";
import EditorJS, { type OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Paragraph from "@editorjs/paragraph";
import { MultipleChoiceTool, OpenQuestionTool, MultipleSelectionTool, MatchingTool, OrderingTool, TrueFalseTool, ShortAnswerTool, ClozeTool } from "./editor-tools";
import { Box, TextField, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import { TestClassAssociationManager } from './TestClassAssociationManager';

/**
 * Props para el componente TestEditor.
 */
type TestEditorProps = {
  /** Título inicial de la evaluación. */
  initialTitle: string;
  /** Contenido inicial de la evaluación en formato OutputData de Editor.js. */
  initialContent?: OutputData;
  /** Callback para cuando el título cambia. */
  onTitleChange: (title: string) => void;
  /** Callback para cuando el contenido cambia. */
  onContentChange: (content: OutputData) => void;
  /** Callback para cuando las asociaciones a clases cambian. */
  onAssociationChange: () => void;
  /** Mensaje de error para el título. */
  titleError?: string;
  /** Indica si el editor debe estar deshabilitado. */
  disabled?: boolean;
};

/**
 * Componente editor para crear y modificar el contenido de una evaluación
 * utilizando Editor.js.
 */

// i18n configuration for Spanish
const EDITOR_I18N = {
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

export const TestEditor = ({
  initialTitle,
  initialContent,
  onTitleChange,
  onContentChange,
  onAssociationChange,
  titleError,
  disabled = false,
}: TestEditorProps) => {
  const { testId } = useParams<{ testId: string }>();
  const [isAssociationModalOpen, setIsAssociationModalOpen] = useState(false);
  const editorInstance = useRef<EditorJS | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const holderId = `editorjs-container-${testId || "new"}`;

  // Effect for initializing and destroying the editor
  useEffect(() => {
    if (!editorInstance.current) {
      const editor = new EditorJS({
        holder: holderId,
        readOnly: disabled,
        data: initialContent || { blocks: [] },
        i18n: EDITOR_I18N,
        tools: {
            header: {
              class: Header as any,
              config: {
                placeholder: "Encabezado",
                levels: [2, 3, 4],
                defaultLevel: 2,
              },
            },
            paragraph: {
              class: Paragraph as any,
              inlineToolbar: true,
            },
            multipleChoice: {
              class: MultipleChoiceTool as any,
            },
            openQuestion: {
              class: OpenQuestionTool as any,
            },
            multipleSelection: {
                class: MultipleSelectionTool as any,
            },
            matching: {
                class: MatchingTool as any,
            },
            ordering: {
                class: OrderingTool as any,
            },
            trueFalse: {
                class: TrueFalseTool as any,
            },
            shortAnswer: {
                class: ShortAnswerTool as any,
            },
            cloze: {
                class: ClozeTool as any,
            },
          },
        onChange: async () => {
          if (editorInstance.current) {
            const content = await editorInstance.current.save();
            onContentChange(content);
          }
        },
      });
      editorInstance.current = editor;
    }

    const readyPromise = editorInstance.current.isReady;

    readyPromise
      .then(() => {
        setIsEditorReady(true);
      })
      .catch((reason) => {
        console.error(`Editor.js initialization failed: ${reason}`);
      });

    return () => {
      if (editorInstance.current?.destroy) {
        editorInstance.current.destroy();
        editorInstance.current = null;
        setIsEditorReady(false);
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount and cleanup on unmount

  // Effect to toggle read-only state
  useEffect(() => {
    if (isEditorReady && editorInstance.current?.readOnly) {
      editorInstance.current.readOnly.toggle(disabled);
    }
  }, [disabled, isEditorReady]);

  // Effect to update content from external changes
  useEffect(() => {
    if (isEditorReady && initialContent && editorInstance.current?.render) {
        editorInstance.current.render(initialContent);
    }
  }, [initialContent, isEditorReady]);
  
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 1,
          mb: 1,
        }}
      >
        <TextField
          label="Título"
          value={initialTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          fullWidth
          margin="normal"
          error={!!titleError}
          helperText={titleError}
          disabled={disabled}
          sx={{ flexGrow: 1, mr: 2 }}
        />
        {testId && (
          <Button
            variant="outlined"
            onClick={() => setIsAssociationModalOpen(true)}
          >
            Asignar a Clases
          </Button>
        )}
      </Box>

      <Box sx={{ mt: 2, border: '1px solid #ccc', borderRadius: '4px', p: 1, minHeight: '300px' }}>
        <div id={holderId}></div>
      </Box>

      {testId && (
        <TestClassAssociationManager
          open={isAssociationModalOpen}
          onClose={() => setIsAssociationModalOpen(false)}
          testId={testId}
          onSuccess={() => {
            onAssociationChange();
          }}
        />
      )}
    </>
  );
};
