import {
  apiGet,
  apiPost,
  errorService,
  NotFoundError,
  type FieldErrorDTO,
} from "@application";
import type {
  PublicTest,
  QuestionAnswer,
  Answer,
  AnswerContent,
  AnswerGradeStatus,
} from "@domain";
import { Box, CircularProgress } from "@mui/material";
import { NotFound } from "@presentation";
import { createContext, useContext, useEffect, useState } from "react";

/**
 * Tipo para funciones que actualizan el contenido completo de una respuesta.
 */
export type AnswerContentUpdater =
  | AnswerContent
  | ((prev: AnswerContent) => AnswerContent);

/**
 * Tipo para funciones que actualizan la respuesta a una pregunta específica.
 */
export type AnswerQuestionUpdater =
  | QuestionAnswer
  | ((prev: QuestionAnswer) => QuestionAnswer);

/**
 * Tipo para funciones o valores que actualizan la entidad de respuesta.
 */
export type AnswerUpdater = Answer | ((prev: Answer) => Answer);

/**
 * Interfaz que define el estado y las acciones disponibles en el contexto de respuesta.
 */
export type AnswerConcextType = {
  /** La estructura pública de la evaluación que se está respondiendo. */
  test: PublicTest;
  /** La entidad de respuesta que contiene el progreso del estudiante. */
  answer: Answer;
  /** El estado actual de la calificación (ej. pendiente, calificado). */
  answerState: AnswerGradeStatus;
  /** Conjunto de IDs de preguntas que ya han sido respondidas. */
  answeredQuestions: Set<string>;
  /** Función para actualizar la entidad de respuesta completa. */
  setAnswer: React.Dispatch<React.SetStateAction<Answer | null>>;
  /** Registra una pregunta como respondida. */
  setAnsweredQuestions: (answerId: string) => void;
  /** Actualiza la información de la evaluación. */
  setTest: (test: PublicTest) => void;
  /** Actualiza el contenido de todas las respuestas. */
  setContent: (answer: AnswerContentUpdater) => void;
  /** Actualiza la respuesta a una pregunta específica por su ID. */
  setAnswerQuestion: (id: string, answer: AnswerQuestionUpdater) => void;
  /** Lista de errores de validación de campos devueltos por la API. */
  fieldErrors: FieldErrorDTO[];
  /** Establece los errores de validación de campos. */
  setFieldErrors: (fieldErrors: FieldErrorDTO[]) => void;
  /** Indica si se están cargando los datos iniciales. */
  isLoading: boolean;
  /** Controla el estado de carga. */
  setLoading: (loading: boolean) => void;
};

const AnswerContext = createContext<AnswerConcextType | null>(null);

/**
 * Propiedades para el componente AnswerProvider.
 */
type AnswerProviderProps = {
  /** ID de la clase. */
  classId: string;
  /** ID de la evaluación. */
  testId: string;
  /** ID del estudiante. */
  userId: number;
  /** Contenido hijo. */
  children: React.ReactNode;
};

/**
 * Proveedor de contexto para la gestión de respuestas a evaluaciones.
 * 
 * Responsabilidades:
 * 1. Cargar la respuesta existente del estudiante o crear una nueva si no existe.
 * 2. Cargar el contenido de la evaluación pública.
 * 3. Consultar el estado de calificación de la respuesta.
 * 4. Proveer métodos para actualizar las respuestas de forma reactiva.
 */
export const AnswerProvider = ({
  classId,
  testId,
  userId,
  children,
}: AnswerProviderProps) => {
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [test, setTest] = useState<PublicTest | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<FieldErrorDTO[]>([]);
  const [answeredQuestions, setAnswered] = useState<Set<string>>(new Set());
  const [answerState, setAnswerState] = useState<AnswerGradeStatus>({
    status: "idle",
  });

  const setAnsweredQuestions = (answerId: string) => {
    setAnswered((prev) => {
      const newSet = new Set(prev);
      newSet.add(answerId);
      return newSet;
    });
  };

  const setContent = (content: AnswerContentUpdater) => {
    setAnswer((prev) => {
      if (!prev) return null;

      const newContent =
        typeof content === "function" ? content(prev.content) : content;

      return { ...prev, content: newContent };
    });
  };

  const setAnswerQuestion = (id: string, content: AnswerQuestionUpdater) => {
    setAnswer((prev) => {
      if (!prev) return prev;

      const updatedContent: AnswerContent = { ...prev.content };

      updatedContent[id] =
        typeof content === "function" ? content(updatedContent[id]) : content;

      return { ...prev, content: updatedContent };
    });
  };

  useEffect(() => {
    setLoading(true);

    const fetchOrCreateAnswer = async () => {
      try {
        const answer = await apiGet<Answer>(
          `/answers/${userId}/${classId}/${testId}`,
        );

        const state = await apiGet<AnswerGradeStatus>(
          `/answers/${userId}/${classId}/${testId}/status`,
        );

        setAnswer(answer);
        setAnswerState(state);
      } catch (e) {
        if (e instanceof NotFoundError === false) {
          errorService.notify(e);
          return;
        }

        const newAnswer = await apiPost<Answer>("/answers", {
          userId,
          testId,
          classId,
        });

        setAnswer(newAnswer);
      }

      try {
        const test = await apiGet<PublicTest>(`/tests/${testId}/${classId}`);
        setTest(test);
      } catch (e) {
        errorService.notify(e);
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreateAnswer();
  }, [userId, classId, testId]);
  if (isLoading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );

  if (!test || !answer) return <NotFound />;

  if (answer)
    return (
      <AnswerContext.Provider
        value={{
          answer,
          answerState,
          test,
          setAnswer,
          setContent,
          setTest,
          setAnswerQuestion,
          fieldErrors,
          setFieldErrors,
          isLoading,
          setLoading,
          answeredQuestions,
          setAnsweredQuestions,
        }}
      >
        {children}
      </AnswerContext.Provider>
    );

  return null;
};

export const useAnswer = (): AnswerConcextType => {
  const context = useContext(AnswerContext);
  if (!context)
    throw new Error("useAnswer must be used within a AnswerProvider");

  return context;
};
