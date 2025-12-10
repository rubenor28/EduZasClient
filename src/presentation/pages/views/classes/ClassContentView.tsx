import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  List,
  ListItem,
  Chip,
  Divider,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type { ClassContentDTO, ClassContentCriteria } from "@application";
import {
  apiPost,
  ContentType,
  ContentTypeLabels,
  parseContentType,
} from "@application";

interface ClassContentResponse {
  results: ClassContentDTO[];
  page: number;
  totalPages: number;
}

export const ClassContentView = () => {
  const { classId } = useParams<{ classId: string }>();
  const [data, setData] = useState<ClassContentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!classId) {
      setError(new Error("ClassId no proporcionado en la URL"));
      setIsLoading(false);
      return;
    }

    const fetchContent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const criteria: ClassContentCriteria = {
          classId,
          page: 1,
          pageSize: 999999,
        };
        const result = await apiPost<ClassContentResponse>(`/classes/content`, criteria);
        setData(result);
      } catch (err) {
        throw err; // Lanzar para que lo capture el error boundary
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [classId]);

  const getContentTypeLabel = (type: number | ContentType): string => {
    const parsedType = parseContentType(type);
    return ContentTypeLabels[parsedType];
  };

  const getContentTypeColor = (
    type: number | ContentType
  ): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    const parsedType = parseContentType(type);
    return parsedType === ContentType.TEST ? "primary" : "secondary";
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    throw error;
  }

  const contents = data?.results || [];

  return (
    <Paper sx={{ p: 3, backgroundColor: "transparent", boxShadow: "none" }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" gutterBottom>
          Contenido de la Clase
        </Typography>
        <Typography variant="h5" color="textSecondary">
          Código de invitación a la clase: {classId}
        </Typography>
      </Box>

      {contents.length === 0 ? (
        <Alert severity="info">
          No hay contenido asignado a esta clase aún.
        </Alert>
      ) : (
        <List sx={{ bgcolor: "background.paper", borderRadius: 1 }}>
          {contents.map((content, index) => (
            <Box key={content.id}>
              <ListItem
                sx={{
                  py: 2,
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Typography variant="h4">{content.title}</Typography>
                  <Chip
                    label={getContentTypeLabel(content.type)}
                    color={getContentTypeColor(content.type)}
                    size="small"
                  />
                </Box>
                <Typography variant="body1" color="textSecondary">
                  {formatDate(content.publishDate)}
                </Typography>
              </ListItem>
              {index < contents.length - 1 && <Divider component="li" />}
            </Box>
          ))}
        </List>
      )}
    </Paper>
  );
};
