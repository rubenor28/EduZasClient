import { type Resource } from "@application";
import { useCreateBlockNote } from "@blocknote/react";
import { Box, Typography } from "@mui/material";
import { BlockNoteView } from "@blocknote/mantine";
export type ResourcePreviewProps = {
  resource: Resource;
};

export function ResourcePreview({ resource }: ResourcePreviewProps) {
  const editor = useCreateBlockNote({
    initialContent: resource.content,
  });

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
        <Typography variant="h6" gutterBottom>
          {resource.title}
        </Typography>
      </Box>

      <Box sx={{ mt: 2 }}>
        <BlockNoteView
          theme="light"
          editor={editor}
          editable={false}
          title={resource.title}
        />
      </Box>
    </>
  );
}
