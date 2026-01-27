import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import {
  apiGet,
  errorService,
  type ResourceClassReportResponse,
  type StudentActivityDetail,
} from "@application";
import { ScorePieChart } from "@presentation";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PeopleIcon from "@mui/icons-material/People";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import { useParams } from "react-router";

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactElement;
}) {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          {icon}
          <Typography variant="h6" component="div" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" align="center">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

function EngagementChart({ students }: { students: StudentActivityDetail[] }) {
  const topStudents = useMemo(
    () =>
      [...students]
        .sort((a, b) => b.totalMinutesSpent - a.totalMinutesSpent)
        .slice(0, 10),
    [students],
  );

  const maxTime = topStudents.length > 0 ? topStudents[0].totalMinutesSpent : 1;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Top 10 Estudiantes por Tiempo de Visualización
        </Typography>
        <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
          {topStudents.map((student) => (
            <Box
              component="li"
              key={student.userId}
              sx={{ mb: 2, "&:last-child": { mb: 0 } }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.5,
                }}
              >
                <Typography variant="body2">{student.fullName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {student.totalMinutesSpent.toFixed(1)} min
                </Typography>
              </Box>
              <Box
                sx={{
                  height: "8px",
                  bgcolor: "grey.300",
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    width: `${(student.totalMinutesSpent / maxTime) * 100}%`,
                    bgcolor: "primary.main",
                    borderRadius: 1,
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

export type Params = {
  classId: string;
  resourceId: string;
};

export function ResourceReportView() {
  const { classId, resourceId } = useParams<Params>();
  const [report, setReport] = useState<
    ResourceClassReportResponse | undefined
  >();
  const [orderBy, setOrderBy] =
    useState<keyof StudentActivityDetail>("totalMinutesSpent");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);
  const [nameFilter, setNameFilter] = useState("");
  const [minViewCountFilter, setMinViewCountFilter] = useState("");
  const [minMinutesSpentFilter, setMinMinutesSpentFilter] = useState("");

  const filteredStudents = useMemo(() => {
    if (!report?.students) {
      return [];
    }
    return report.students.filter((student) => {
      const nameMatch = student.fullName
        .toLowerCase()
        .includes(nameFilter.toLowerCase());
      const minViewCount =
        minViewCountFilter === "" ? 0 : Number(minViewCountFilter);
      const viewCountMatch = student.viewCount >= minViewCount;
      const minMinutesSpent =
        minMinutesSpentFilter === "" ? 0 : Number(minMinutesSpentFilter);
      const minutesSpentMatch = student.totalMinutesSpent >= minMinutesSpent;

      return nameMatch && viewCountMatch && minutesSpentMatch;
    });
  }, [report, nameFilter, minViewCountFilter, minMinutesSpentFilter]);

  const sortedStudents = useMemo(() => {
    if (!filteredStudents) {
      return [];
    }
    return [...filteredStudents].sort((a, b) => {
      let comparison = 0;
      if (a[orderBy] < b[orderBy]) {
        comparison = -1;
      }
      if (a[orderBy] > b[orderBy]) {
        comparison = 1;
      }
      return order === "desc" ? -comparison : comparison;
    });
  }, [filteredStudents, order, orderBy]);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        setLoading(true);
        const report = await apiGet<ResourceClassReportResponse>(
          `/reports/resource/session/${classId}/${resourceId}`,
        );

        setReport(report);
      } catch (e) {
        errorService.notify(e);
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [classId, resourceId]);

  const handleSort = (property: keyof StudentActivityDetail) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  if (loading) return <CircularProgress />;

  if (!report) return <h1>No existen sesiones de uso para este recurso</h1>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Reporte del Recurso: {report.resourceTitle}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Clase: {report.classId}
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Vistas Totales"
            value={report.summary.totalViews.toString()}
            icon={<VisibilityIcon color="primary" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Estudiantes Únicos"
            value={report.summary.uniqueStudentsCount.toString()}
            icon={<PeopleIcon color="primary" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Duración Promedio"
            value={`${report.summary.averageDurationMinutes.toFixed(1)} min`}
            icon={<AccessTimeIcon color="primary" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tiempo Total Visto"
            value={`${report.summary.totalTimeSpentMinutes.toFixed(1)} min`}
            icon={<HourglassTopIcon color="primary" />}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <EngagementChart students={report.students} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estudiantes que han visto el recurso
              </Typography>
              <ScorePieChart
                value={(report.summary.uniqueStudentsCount / 15) * 100}
                label={"Alcanze"}
                percentage={true}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Detalle por Estudiante
      </Typography>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filtros
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Nombre del Estudiante"
                variant="outlined"
                fullWidth
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Vistas Mínimas (<=)"
                variant="outlined"
                type="number"
                fullWidth
                value={minViewCountFilter}
                onChange={(e) => setMinViewCountFilter(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Minutos Mínimos Vistos (<=)"
                variant="outlined"
                type="number"
                fullWidth
                value={minMinutesSpentFilter}
                onChange={(e) => setMinMinutesSpentFilter(e.target.value)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sortDirection={orderBy === "fullName" ? order : false}>
                <TableSortLabel
                  active={orderBy === "fullName"}
                  direction={orderBy === "fullName" ? order : "asc"}
                  onClick={() => handleSort("fullName")}
                >
                  Nombre
                </TableSortLabel>
              </TableCell>
              <TableCell
                align="right"
                sortDirection={orderBy === "viewCount" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "viewCount"}
                  direction={orderBy === "viewCount" ? order : "asc"}
                  onClick={() => handleSort("viewCount")}
                >
                  Vistas
                </TableSortLabel>
              </TableCell>
              <TableCell
                align="right"
                sortDirection={orderBy === "totalMinutesSpent" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "totalMinutesSpent"}
                  direction={orderBy === "totalMinutesSpent" ? order : "asc"}
                  onClick={() => handleSort("totalMinutesSpent")}
                >
                  Minutos Vistos
                </TableSortLabel>
              </TableCell>
              <TableCell
                align="right"
                sortDirection={orderBy === "lastViewed" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "lastViewed"}
                  direction={orderBy === "lastViewed" ? order : "asc"}
                  onClick={() => handleSort("lastViewed")}
                >
                  Última Vista
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedStudents.map((student) => (
              <TableRow key={student.userId}>
                <TableCell>{student.fullName}</TableCell>
                <TableCell align="right">{student.viewCount}</TableCell>
                <TableCell align="right">
                  {student.totalMinutesSpent.toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  {new Date(student.lastViewed).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
