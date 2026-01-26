import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import type { ClassTestReport } from "@domain";
import { useEffect, useState } from "react";
import { apiGet, errorService } from "@application";
import { NotFound, ScorePieChart } from "@presentation";
import { useNavigate, useParams } from "react-router";
import PrintIcon from "@mui/icons-material/Print";
import StatCard from "./StatCard";

type Params = {
  classId: string;
  testId: string;
};

export function ClassTestReportView() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { classId, testId } = useParams<Params>();
  const [report, setReport] = useState<ClassTestReport | null>(null);

  const handlePrint = () => window.print();

  const attendAction = (studentId: number) =>
    navigate(
      `/professor/classes/report/test/${classId}/${testId}/${studentId}`,
    );

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const report = await apiGet<ClassTestReport>(
          `/reports/test/${classId}/${testId}`,
        );
        setReport(report);
      } catch (e) {
        errorService.notify(e);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [classId, testId]);

  if (loading) return <CircularProgress />;

  if (report === null) return <NotFound />;

  return (
    <Card>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <div>
            <Typography variant="h4" gutterBottom>
              {report.testTitle}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {report.className}
            </Typography>
            <Typography variant="body1">
              Profesor: {report.professorName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Date: {new Date(report.testDate).toLocaleDateString()}
            </Typography>
          </div>
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
          >
            Descargar
          </Button>
        </Box>

        {report.errors?.length > 0 && (
          <Alert severity="warning" sx={{ my: 3 }}>
            <AlertTitle>Acción Requerida</AlertTitle>
            <ul>
              {report.errors.map((error) => (
                <li key={error.studentId}>
                  <Typography variant="body2">
                    Estudiante: <strong>{error.studentName}</strong> - Razón:{" "}
                    {error.error}
                  </Typography>
                  {error.error === "Calificación manual requerida" && (
                    <Button
                      onClick={() => attendAction(error.studentId)}
                      color="warning"
                    >
                      Atender
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </Alert>
        )}

        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          Estadísticas
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={6} sm={3}>
            <ScorePieChart
              label="Puntaje promedio"
              value={report.averagePercentage}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <ScorePieChart
              label="Tasa de aprobados"
              value={report.passPercentage}
              percentage
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <ScorePieChart label="Mayor puntaje" value={report.maxScore} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <ScorePieChart label="Menor puntaje" value={report.minScore} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatCard
              title="Desviación estandar"
              value={`${report.standardDeviation.toFixed(2)}`}
            />
          </Grid>
        </Grid>

        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          Resultados individuales ({report.totalStudents} alumnos)
        </Typography>
        <Paper variant="outlined">
          <List>
            {report.results
              .sort((a, b) => b.grade - a.grade)
              .map((student) => (
                <ListItem key={student.studentId} divider>
                  <ListItemText
                    primary={
                      <Typography variant="body1">
                        {student.studentName}
                      </Typography>
                    }
                    secondary={`Puntaje: ${student.grade.toFixed(2)}`}
                    sx={{ flexBasis: "30%" }}
                  />
                  <Box sx={{ flexGrow: 1, ml: 2 }}>
                    <Tooltip title={`${student.grade.toFixed(2)}`}>
                      <LinearProgress
                        variant="determinate"
                        value={student.grade}
                        color={
                          student.grade >= report.passThreshold
                            ? "success"
                            : "error"
                        }
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                    </Tooltip>
                  </Box>
                  <Button onClick={() => attendAction(student.studentId)}>
                    Ver respuesta
                  </Button>
                </ListItem>
              ))}
          </List>
        </Paper>
      </CardContent>
    </Card>
  );
}
