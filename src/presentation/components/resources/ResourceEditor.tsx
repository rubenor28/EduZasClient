import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { Box, Typography, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import type { Block } from "@blocknote/core";

export const ResourceEditor = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const editor = useCreateBlockNote();

  useEffect(() => console.log(JSON.stringify(blocks)), [blocks]);

  return (
    <>
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <TextField
          id="standard-helperText"
          label="Helper text"
          defaultValue="Default Value"
          helperText="Some important text"
          variant="standard"
          size="medium"
        />
      </Box>
      <BlockNoteView
        theme="light"
        editor={editor}
        onChange={() => {
          setBlocks(editor.document);
        }}
      />
    </>
  );
};
