import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
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
  const [nameFilter, setNameFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState<number | "">("");
  const [gradeOperator, setGradeOperator] = useState(">=");

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

  const filteredResults = report.results
    .filter((student) =>
      student.studentName.toLowerCase().includes(nameFilter.toLowerCase()),
    )
    .filter((student) => {
      if (gradeFilter === "") return true;
      switch (gradeOperator) {
        case ">=":
          return student.grade >= gradeFilter;
        case "<=":
          return student.grade <= gradeFilter;
        case "==":
          return student.grade == gradeFilter;
        default:
          return true;
      }
    });

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
        <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              label="Filtrar por nombre"
              variant="outlined"
              fullWidth
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={2}>
              <Grid item xs={5}>
                <FormControl fullWidth>
                  <InputLabel>Condición</InputLabel>
                  <Select
                    value={gradeOperator}
                    label="Condición"
                    onChange={(e) => setGradeOperator(e.target.value)}
                  >
                    <MenuItem value=">=">&gt;=</MenuItem>
                    <MenuItem value="<=">&lt;=</MenuItem>
                    <MenuItem value="==">=</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={7}>
                <TextField
                  label="Calificación"
                  variant="outlined"
                  type="number"
                  fullWidth
                  value={gradeFilter}
                  onChange={(e) =>
                    setGradeFilter(
                      e.target.value === "" ? "" : parseFloat(e.target.value),
                    )
                  }
                  inputProps={{ step: "0.01" }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Paper variant="outlined">
          <List>
            {filteredResults
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
