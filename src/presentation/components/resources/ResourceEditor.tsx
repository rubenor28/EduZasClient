import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { Box, TextField } from "@mui/material";
import { useEffect } from "react";
import type { Block } from "@blocknote/core";

type ResourceEditorProps = {
  initialTitle: string;
  initialContent: Block[];
  onTitleChange: (title: string) => void;
  onContentChange: (content: Block[]) => void;
  titleError?: string;
  disabled?: boolean;
};

export const ResourceEditor = ({
  initialTitle,
  initialContent,
  onTitleChange,
  onContentChange,
  titleError,
  disabled = false,
}: ResourceEditorProps) => {
  const editor = useCreateBlockNote({ initialContent });

  // Sync editor if initialContent changes from parent
  useEffect(() => {
    if (editor && JSON.stringify(initialContent) !== JSON.stringify(editor.document)) {
        editor.replaceBlocks(editor.document, initialContent);
    }
  }, [initialContent, editor]);


  return (
    <>
      <TextField
        label="Título"
        value={initialTitle}
        onChange={(e) => onTitleChange(e.target.value)}
        fullWidth
        margin="normal"
        error={!!titleError}
        helperText={titleError}
        disabled={disabled}
      />

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
    </>
  );
};