import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  type SelectChangeEvent,
  Typography,
  CircularProgress,
} from "@mui/material";
import type { AnswerGradeDetail, Grade } from "@domain";
import { QuestionTypes } from "@domain";
import {
  ConceptRelationGradeDetails,
  MultipleChoiceGradeDetails,
  MultipleSelectionGradeDetails,
  OpenGradeDetails,
  OrderingGradeDetails,
} from "./grades";
import { NotFound, ScorePieChart } from "@presentation";
import { useNavigate, useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";
import { apiGet, apiPut, errorService } from "@application";

import PrintIcon from "@mui/icons-material/Print";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

export function GradeDetails({ grade }: { grade: Grade }) {
  switch (grade.type) {
    case QuestionTypes.MultipleChoise:
      return <MultipleChoiceGradeDetails grade={grade} />;
    case QuestionTypes.MultipleSelection:
      return <MultipleSelectionGradeDetails grade={grade} />;
    case QuestionTypes.Ordering:
      return <OrderingGradeDetails grade={grade} />;
    case QuestionTypes.ConceptRelation:
      return <ConceptRelationGradeDetails grade={grade} />;
    case QuestionTypes.Open:
      return <OpenGradeDetails grade={grade} />;
    default:
      return (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography>Unsupported question type</Typography>
        </Paper>
      );
  }
}

type ManualGradeControlProps = {
  value: boolean | null;
  onChange: (value: boolean | null) => void;
};

function ManualGradeControl({ value, onChange }: ManualGradeControlProps) {
  const handleChange = (event: SelectChangeEvent<string>) => {
    const val = event.target.value;
    if (val === "auto") {
      onChange(null);
    } else {
      onChange(val === "correct");
    }
  };

  const selectValue = value === null ? "auto" : value ? "correct" : "incorrect";

  return (
    <FormControl fullWidth sx={{ mb: 1 }}>
      <InputLabel>Calificación manual</InputLabel>
      <Select value={selectValue} label="Manual Grade" onChange={handleChange}>
        <MenuItem value={"auto"}>Automático</MenuItem>
        <MenuItem value={"correct"}>Correcto</MenuItem>
        <MenuItem value={"incorrect"}>Incorrecto</MenuItem>
      </Select>
    </FormControl>
  );
}

export type ManualGrades = Record<string, boolean | null>;

type Params = {
  classId: string;
  testId: string;
  userId: string;
};

export function ProfessorGradingView() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { classId, userId, testId } = useParams<Params>();
  const [manualGrades, setManualGrades] = useState<ManualGrades>({});
  const [result, setResult] = useState<AnswerGradeDetail | null>(null);

  const handlePrint = () => window.print();

  const fetchResult = useCallback(async () => {
    try {
      setLoading(true);
      const result = await apiGet<AnswerGradeDetail>(
        `/reports/answer/${userId}/${classId}/${testId}/detail`,
      );
      setResult(result);
      console.log("GRADE DETAILS");
      console.log(result.gradeDetails);
      result.gradeDetails.forEach((g) => {
        console.log("G");
        console.log(g);
        if (g.manualGrade !== null)
          onManualGradeChange(g.questionId, g.manualGrade);
      });
    } catch (e) {
      errorService.notify(e);
    } finally {
      setLoading(false);
    }
  }, [classId, testId, userId]);

  console.log(manualGrades);

  const handleSave = async () => {
    try {
      setLoading(true);
      await apiPut(`/answers/professor`, {
        userId: Number(userId),
        testId,
        classId,
        metadata: {
          manualGrade: manualGrades,
        },
      });

      fetchResult();
    } catch (e) {
      errorService.notify(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchResult();
  }, [classId, userId, testId]);

  const onManualGradeChange = (id: string, value: boolean | null) => {
    setManualGrades((prevManualGrades) => ({
      ...prevManualGrades,
      [id]: value,
    }));
  };

  if (loading) return <CircularProgress />;

  if (result === null) return <NotFound />;

  return (
    <Card>
      <Box
        sx={{
          position: "sticky",
          gap: 2,
          top: 0,
          zIndex: 1,
          bgcolor: "background.paper",
          p: 2,
          boxShadow: 1,
        }}
      >
        <Button
          sx={{ mr: 2 }}
          variant="contained"
          startIcon={<ArrowBackIosIcon />}
          onClick={() => navigate(-1)}
        >
          Volver
        </Button>
        <Button
          sx={{ mr: 2 }}
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={() => handleSave()}
          disabled={loading}
        >
          Guardar
        </Button>
        <Button
          sx={{ mr: 2 }}
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
        >
          Descargar
        </Button>
      </Box>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <div>
            <Typography variant="h4">{result.testTitle}</Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {result.className}
            </Typography>
            <Typography variant="body2">
              Alumno: {result.studentName}
            </Typography>
            <Typography variant="body2">
              Profesor: {result.professorName}
            </Typography>
            <Typography variant="body2">
              Fecha: {new Date(result.date).toLocaleDateString()}
            </Typography>
          </div>
        </Box>

        <Grid container spacing={2} sx={{ mt: 2 }} alignItems="center">
          <Grid
            item
            xs={12}
            md={4}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <ScorePieChart value={result.score} label="Puntaje" />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h5">Resumen</Typography>
            <Typography>
              Aciertos: {result.points}/{result.totalPoints}
            </Typography>
            <Typography>Calificación: {result.score.toFixed(2)}%</Typography>
            <Typography color={result.approved ? "success.main" : "error.main"}>
              Estado: {result.approved ? "Aprobado" : "No aprobado"}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          {result.gradeDetails.map((grade) => (
            <Box key={grade.questionId} mb={2}>
              <ManualGradeControl
                value={manualGrades[grade.questionId] ?? null}
                onChange={(value) =>
                  onManualGradeChange(grade.questionId, value)
                }
              />
              <GradeDetails grade={grade} />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
