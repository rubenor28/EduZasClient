import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { UploadFile } from "@mui/icons-material";
import { apiGet, apiPost } from "@application";

const API_BASE_URL = "http://localhost:5018";

type AntiforgeryToken = {
  headerName: string;
  requestToken: string;
};

export const DatabaseManagement = () => {
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const [antiforgery, setAntiforgery] = useState<{
    token: AntiforgeryToken | null;
    loading: boolean;
    error: string | null;
  }>({
    token: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchAntiforgeryToken = async () => {
      try {
        const tokenData = await apiGet<AntiforgeryToken>(
          "/auth/antiforgery/token",
        );
        setAntiforgery({ token: tokenData, loading: false, error: null });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "No se pudo obtener el token de seguridad necesario para la restauración.";
        setAntiforgery({ token: null, loading: false, error: errorMessage });
        console.error("Antiforgery token fetch error:", errorMessage);
      }
    };

    fetchAntiforgeryToken();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setRestoreFile(event.target.files[0]);
    }
  };

  const handleRestore = async () => {
    if (!restoreFile || !antiforgery.token) {
      setSnackbar({
        open: true,
        message:
          "No se puede restaurar sin un archivo o sin el token de seguridad.",
        severity: "error",
      });
      return;
    }

    setIsRestoring(true);
    const formData = new FormData();
    formData.append("file", restoreFile);

    const headers: HeadersInit = {
      [antiforgery.token.headerName]: antiforgery.token.requestToken,
    };

    try {
      await apiPost<void>("/database/restore", formData, {
        headers,
      });
      setSnackbar({
        open: true,
        message: "Restauración completada con éxito.",
        severity: "success",
      });
      setRestoreFile(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ocurrió un error desconocido al restaurar la base de datos.";
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Respaldo y Restauración de la Base de Datos
      </Typography>

      <Box component={Paper} variant="outlined" sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Crear Respaldo
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Genera un archivo .sql con el estado actual de la base de datos. La
          descarga comenzará automáticamente.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          href={`${API_BASE_URL}/database/backup`}
          component="a"
          sx={{ mt: 1 }}
        >
          Crear y Descargar Respaldo
        </Button>
      </Box>

      <Box component={Paper} variant="outlined" sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Restaurar desde Respaldo
        </Typography>
        <Typography variant="body2" color="error" sx={{ mb: 1 }}>
          <strong>¡Advertencia!</strong> Esta acción es destructiva. Reemplazará
          permanentemente todos los datos actuales de la base de datos con los
          del archivo de respaldo. Proceda con precaución.
        </Typography>

        {antiforgery.loading && <CircularProgress size={24} />}
        {antiforgery.error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {antiforgery.error}
          </Alert>
        )}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mt: 2,
            opacity: antiforgery.loading || antiforgery.error ? 0.5 : 1,
          }}
        >
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFile />}
            disabled={isRestoring || antiforgery.loading || !!antiforgery.error}
          >
            Seleccionar Archivo .sql
            <input
              type="file"
              hidden
              accept=".sql"
              onChange={handleFileChange}
              onClick={(event) => {
                (event.target as HTMLInputElement).value = "";
              }}
            />
          </Button>
          {restoreFile ? (
            <Typography variant="body1">
              Archivo seleccionado: <strong>{restoreFile.name}</strong>
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Ningún archivo seleccionado
            </Typography>
          )}
        </Box>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleRestore}
            disabled={
              !restoreFile ||
              isRestoring ||
              antiforgery.loading ||
              !!antiforgery.error
            }
            sx={{ mt: 1 }}
          >
            {isRestoring ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Subir y Restaurar"
            )}
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};
