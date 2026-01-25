import { Box, Typography } from "@mui/material";

export default function StatCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  const chartEquivalentSize = 120;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        height: "100%",
        justifyContent: "flex-start",
        textAlign: "center",
      }}
    >
      <Typography variant="subtitle1" color="text.secondary">
        {title}
      </Typography>
      <Box
        sx={{
          height: chartEquivalentSize,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1,
        }}
      >
        <Typography variant="h4" component="div" color="text.primary">
          {value}
        </Typography>
      </Box>
    </Box>
  );
}
