import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import type { Block } from "@blocknote/core";
import { ClassAssociationManager } from "./ClassAssociationManager";
import { useParams } from "react-router-dom";

type ResourceEditorProps = {
  initialTitle: string;
  initialContent?: Block[] | string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: Block[]) => void;
  onAssociationChange: () => void;
  titleError?: string;
  disabled?: boolean;
};

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

export const ResourceEditor = ({
  initialTitle,
  initialContent,
  onTitleChange,
  onContentChange,
  onAssociationChange,
  titleError,
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
        {resourceId && (
          <Button
            variant="outlined"
            onClick={() => setIsAssociationModalOpen(true)}
          >
            Asignar a Clases
          </Button>
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
        <ClassAssociationManager
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

