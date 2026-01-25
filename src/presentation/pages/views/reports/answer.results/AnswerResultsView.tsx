import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import type { AnswerGradeDetail, AnswerId, Grade } from "@domain";
import { QuestionTypes } from "@domain";
import PrintIcon from "@mui/icons-material/Print";
import {
  ConceptRelationGradeDetails,
  MultipleChoiceGradeDetails,
  MultipleSelectionGradeDetails,
  OpenGradeDetails,
  OrderingGradeDetails,
} from "./grades";
import { ScorePieChart } from "./ScorePieChart";
import { useEffect, useState } from "react";
import { NotFound } from "@presentation";
import { apiGet, errorService } from "@application";

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

export function AnswerResultsView(answerId: AnswerId) {
  const { classId, userId, testId } = answerId;
  const [result, setResult] = useState<AnswerGradeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const result = await apiGet<AnswerGradeDetail>(
          `/reports/answer/${userId}/${classId}/${testId}`,
        );
        setResult(result);
      } catch (e) {
        errorService.notify(e);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [answerId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <CircularProgress />;

  if (result === null) return <NotFound />;

  return (
    <Card>
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
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
          >
            Descargar
          </Button>
        </Box>

        <Grid container spacing={2} sx={{ mt: 2 }} alignItems="center">
          <Grid
            item
            xs={12}
            md={4}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <ScorePieChart score={result.score} approved={result.approved} />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h5">Resumen</Typography>
            <Typography>
              Aciertos: {result.points}/{result.totalPoints}
            </Typography>
            <Typography>Score: {result.score.toFixed(2)}%</Typography>
            <Typography color={result.approved ? "success.main" : "error.main"}>
              Estado: {result.approved ? "Aprobado" : "No aprobado"}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          {result.gradeDetails.map((grade, index) => (
            <Box key={index} mb={2}>
              <GradeDetails grade={grade} />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
