import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { Box, Typography, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import type { Block } from "@blocknote/core";
import type { Resource } from "domain/resources";

type ResourceEditorProps = {
  defaultData: Resource;
};

export const ResourceEditor = ({ defaultData }: ResourceEditorProps) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [resource, setResource] = useState(defaultData);

  const editor = useCreateBlockNote();

  useEffect(() => console.log(JSON.stringify(blocks)), [setBlocks]);

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
        {/* Un titulo o input editable pero que tambien permita ver el titulo del recurso o modificarlo */}
        <TextField
          id="standard-helperText"
          label="Helper text"
          defaultValue="Default Value"
          helperText="Some important text"
          variant="standard"
          size="medium"
        />
      </Box>
      {/*Contenido del recurso*/}
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
