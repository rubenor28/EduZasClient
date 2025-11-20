import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";
import ClassIcon from "@mui/icons-material/Class";
import { useNavigate } from "react-router-dom";

const actions = [
  {
    title: "Clases Inscritas",
    description: "Visualiza y gestiona las clases en las que estás inscrito.",
    icon: <ClassIcon fontSize="large" />,
    path: "/student/courses",
  },
];

export const StudentPanel = () => {
  const navigate = useNavigate();

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Estudiante
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
