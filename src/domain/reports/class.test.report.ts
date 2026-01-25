export type StudentResult = {
  studentId: number;
  studentName: string;
  grade: number;
};

export type IndividualGradeError = {
  studentId: number;
  studentName: string;
  error: string;
};

export type ClassTestReport = {
  className: string;
  testTitle: string;
  professorName: string;
  passThreshold: number;
  testDate: string;

  averagePercentage: number;
  medianPercentage: number;
  passPercentage: number;
  standardDeviation: number;
  maxScore: number;
  minScore: number;
  totalStudents: number;

  results: StudentResult[];
  errors: IndividualGradeError[];
};
