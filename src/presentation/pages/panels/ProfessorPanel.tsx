import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BookIcon from "@mui/icons-material/Book";
import ContactsIcon from "@mui/icons-material/Contacts";
import { useNavigate } from "react-router-dom";

const actions = [
  {
    title: "Clases Asesoradas",
    description: "Gestiona las clases que impartes o en las que colaboras.",
    icon: <SchoolIcon fontSize="large" />,
    path: "/professor/courses",
  },
  {
    title: "Mis Contactos",
    description: "Administra tu agenda de contactos profesionales y académicos.",
    icon: <ContactsIcon fontSize="large" />,
    path: "/professor/contacts",
  },
  {
    title: "Evaluaciones",
    description: "Crea y administra evaluaciones para tus clases.",
    icon: <AssignmentIcon fontSize="large" />,
    path: "/professor/tests",
  },
  {
    title: "Contenido Académico",
    description: "Sube y organiza el material de estudio para tus alumnos.",
    icon: <BookIcon fontSize="large" />,
    path: "/professor/content",
  },
];

export const ProfessorPanel = () => {
  const navigate = useNavigate();

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Profesor
      </Typography>
      <Grid container spacing={3}>
        {actions.map((action) => (
          <Grid item xs={12} md={6} lg={4} key={action.title}>
            <Card>
              <CardActionArea
                onClick={() => navigate(action.path)}
                sx={{ display: "flex", p: 2, alignItems: "center" }}
              >
                <Box sx={{ mr: 2, color: "primary.main" }}>{action.icon}</Box>
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6" component="div">
                    {action.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {action.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};
