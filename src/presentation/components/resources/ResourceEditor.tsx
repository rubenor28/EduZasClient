import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { Box, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import type { Block } from "@blocknote/core";
import { ResourceClassAssociationManager } from "./ResourceClassAssociationManager";
import { useParams } from "react-router-dom";
import { ColorSelector } from "../common";

/**
 * Helper para parsear el contenido, que puede venir como string JSON o array de bloques.
 */
const parseContent = (content?: Block[] | string): Block[] => {
  if (!content) return [];
  if (typeof content === "string") {
    try {
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }
  return content;
};

/**
 * Props para el editor de recursos.
 */
type ResourceEditorProps = {
  /** Título inicial del recurso. */
  initialTitle: string;
  /** Color inicial de la carta del recurso. */
  initialColor: string;
  /** Contenido inicial (bloques JSON o string JSON). */
  initialContent?: Block[] | string;
  /** Callback al cambiar el color. */
  onColorChange: (title: string) => void;
  /** Callback al cambiar el título. */
  onTitleChange: (title: string) => void;
  /** Callback al cambiar el contenido (auto-guardado o estado local). */
  onContentChange: (content: Block[]) => void;
  /** Callback al cambiar asociaciones (refrescar datos). */
  onAssociationChange: () => void;
  /** Error de validación del título. */
  titleError?: string;
  /** Error de validación del color. */
  colorError?: string;
  /** Si es true, el editor es de solo lectura. */
  disabled?: boolean;
};

/**
 * Wrapper alrededor del editor `BlockNote`.
 *
 * Responsabilidades:
 * 1. Inicializar el editor con el contenido proporcionado.
 * 2. Gestionar el campo de título.
 * 3. Integrar el modal de asignación a clases (`ResourceClassAssociationManager`).
 * 4. Manejar actualizaciones del contenido externo.
 */
export const ResourceEditor = ({
  initialTitle,
  initialColor,
  initialContent,
  onTitleChange,
  onColorChange,
  onContentChange,
  onAssociationChange,
  titleError,
  colorError,
  disabled = false,
}: ResourceEditorProps) => {
  const { resourceId } = useParams<{ resourceId: string }>();
  const [isAssociationModalOpen, setIsAssociationModalOpen] = useState(false);

  const editor = useCreateBlockNote({
    initialContent: parseContent(initialContent),
  });

  useEffect(() => {
    const parsed = parseContent(initialContent);
    if (editor && JSON.stringify(parsed) !== JSON.stringify(editor.document)) {
      editor.replaceBlocks(editor.document, parsed);
    }
  }, [initialContent, editor]);

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
          inputProps={{ maxLength: 100 }}
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
      </Box>

      <Box sx={{ mt: 2 }}>
        <ColorSelector
          initialColor={initialColor}
          onColorChange={onColorChange}
        />
        {colorError && (
          <Typography color="error" variant="caption" sx={{ mt: 1 }}>
            {colorError}
          </Typography>
        )}
      </Box>

      <Box sx={{ mt: 2 }}>
        <BlockNoteView
          theme="light"
          editor={editor}
          editable={!disabled}
          onChange={() => {
            onContentChange(editor.document);
          }}
        />
      </Box>

      {resourceId && (
        <ResourceClassAssociationManager
          open={isAssociationModalOpen}
          onClose={() => setIsAssociationModalOpen(false)}
          resourceId={resourceId}
          onSuccess={() => {
            onAssociationChange();
          }}
        />
      )}
    </>
  );
};
