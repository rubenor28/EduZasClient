/**
 * Representa el resultado individual de un estudiante en un examen.
 */
export type StudentResult = {
  /** ID del estudiante. */
  studentId: number;
  /** Nombre completo del estudiante. */
  studentName: string;
  /** Calificación obtenida (0-100). */
  grade: number;
};

/**
 * Representa un error ocurrido durante la calificación de un estudiante específico.
 */
export type IndividualGradeError = {
  /** ID del estudiante. */
  studentId: number;
  /** Nombre completo del estudiante. */
  studentName: string;
  /** Descripción del error. */
  error: string;
};

/**
 * Representa un reporte estadístico completo de un examen para una clase.
 */
export type ClassTestReport = {
  /** Nombre de la clase. */
  className: string;
  /** Título del examen. */
  testTitle: string;
  /** Nombre del profesor que aplicó el examen. */
  professorName: string;
  /** Umbral de aprobación (ej. 60). */
  passThreshold: number;
  /** Fecha en la que se aplicó el examen. */
  testDate: string;

  /** Porcentaje promedio de aciertos. */
  averagePercentage: number;
  /** Mediana del porcentaje de aciertos. */
  medianPercentage: number;
  /** Porcentaje de estudiantes que aprobaron. */
  passPercentage: number;
  /** Desviación estándar de los puntajes. */
  standardDeviation: number;
  /** Puntaje máximo obtenido. */
  maxScore: number;
  /** Puntaje mínimo obtenido. */
  minScore: number;
  /** Número total de estudiantes que realizaron el examen. */
  totalStudents: number;

  /** Lista de resultados individuales por estudiante. */
  results: StudentResult[];
  /** Lista de errores ocurridos durante la calificación automática. */
  errors: IndividualGradeError[];
};
