import { apiGet, type FieldErrorDTO } from "@application";
import { type Test, type TestContent } from "@domain";
import { Box, CircularProgress } from "@mui/material";
import { NotFound } from "@presentation";
import { createContext, useContext, useEffect, useState } from "react";

/**
 * Interfaz que define el estado y las acciones disponibles en el contexto de edición de evaluaciones.
 */
export interface TestContextType {
  /** La entidad de evaluación que se está editando. */
  test: Test;
  /** Lista de errores de validación de campos devueltos por la API. */
  fieldErrors: FieldErrorDTO[];
  /** Lista ordenada de IDs de las preguntas, para manejar el orden en la UI. */
  orderedIds: string[];
  /** Actualiza la entidad de evaluación completa. */
  setTest: (test: Test) => void;
  /** Actualiza el título de la evaluación. */
  setTitle: (title: string) => void;
  /** Actualiza el color asociado a la evaluación. */
  setColor: (color: string) => void;
  /** Establece el límite de tiempo en minutos. */
  setTimeLimit: (minutes: number | undefined) => void;
  /** Actualiza el contenido (preguntas) de la evaluación. */
  setContent: (
    content: TestContent | ((prevContent: TestContent) => TestContent),
  ) => void;
  /** Actualiza el orden de los IDs de las preguntas. */
  setOrderedIds: (ids: string[]) => void;
  /** Establece la lista de errores de validación de campos. */
  setFieldErrors: (fieldErrors: FieldErrorDTO[]) => void;
}

const TestContext = createContext<TestContextType | null>(null);

/**
 * Propiedades para el componente TestProvider.
 */
type TestProviderProps = {
  /** ID de la evaluación a cargar y editar. */
  testId: string;
  /** Contenido hijo. */
  children: React.ReactNode;
};

/**
 * Proveedor de contexto para la creación y edición de evaluaciones.
 * 
 * Responsabilidades:
 * 1. Cargar la evaluación desde la API al inicializarse.
 * 2. Mantener el estado reactivo del título, color, tiempo límite y preguntas.
 * 3. Gestionar el orden de las preguntas para su renderizado.
 * 4. Proveer métodos centralizados para modificar la evaluación.
 */
export const TestProvider = ({ testId, children }: TestProviderProps) => {
  const [test, setTest] = useState<Test | null>(null);
  const [orderedIds, setOrderedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<FieldErrorDTO[]>([]);

  useEffect(() => {
    try {
      const fetchTest = async () => {
        const test = await apiGet<Test>(`/tests/${testId}`);
        setTest(test);
        setOrderedIds(Object.keys(test.content));
      };
      fetchTest();
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  }, [testId]);

  if (isLoading) {
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
  }

  if (!test) return <NotFound />;

  const setTitle = (title: string) =>
    setTest((prev) => (prev ? { ...prev, title } : null));

  const setColor = (color: string) =>
    setTest((prev) => (prev ? { ...prev, color } : null));

  const setContent = (
    content: TestContent | ((prevContent: TestContent) => TestContent),
  ) => {
    setTest((prev) => {
      if (!prev) return null;

      const newContent =
        typeof content === "function" ? content(prev.content) : content;

      setOrderedIds(Object.keys(newContent));
      return { ...prev, content: newContent };
    });
  };

  const setTimeLimit = (timeLimitMinutes?: number) =>
    setTest((prev) => (prev ? { ...prev, timeLimitMinutes } : null));

  if (test) {
    return (
      <TestContext.Provider
        value={{
          test,
          fieldErrors,
          orderedIds,
          setOrderedIds,
          setTest,
          setTitle,
          setColor,
          setContent,
          setTimeLimit,
          setFieldErrors
        }}
      >
        {children}
      </TestContext.Provider>
    );
  }

  return null;
};

export const useTest = (): TestContextType => {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
