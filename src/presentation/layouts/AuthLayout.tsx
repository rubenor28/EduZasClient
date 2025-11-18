import { Grid, Paper, Box, Typography } from "@mui/material";

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const AuthLayout = ({ title, children }: AuthLayoutProps) => {
  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      {/* Columna del Formulario */}
      <Grid xs={12} sm={8} md={5}>
        <Paper
          elevation={6}
          square
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "100%",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              maxWidth: 400, // Limita el ancho del formulario
            }}
          >
            <Typography component="h1" variant="h5">
              {title}
            </Typography>
            {children}
          </Box>
        </Paper>
      </Grid>
      {/* Columna de la Imagen */}
      <Grid
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: "url(/login-background.png)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </Grid>
  );
};
