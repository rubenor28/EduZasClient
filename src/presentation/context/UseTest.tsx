import { apiGet, type FieldErrorDTO } from "@application";
import { type Test, type TestContent } from "@domain";
import { Box, CircularProgress } from "@mui/material";
import { NotFound } from "@presentation";
import { createContext, useContext, useEffect, useState } from "react";

// Definir el Estado y las Acciones del Store
export interface TestContextType {
  test: Test;
  fieldErrors: FieldErrorDTO[];
  orderedIds: string[];
  setTest: (test: Test) => void;
  setTitle: (title: string) => void;
  setColor: (color: string) => void;
  setTimeLimit: (minutes: number | undefined) => void;
  setContent: (
    content: TestContent | ((prevContent: TestContent) => TestContent),
  ) => void;
  setOrderedIds: (ids: string[]) => void;
  setFieldErrors: (fieldErrors: FieldErrorDTO[]) => void;
}

const TestContext = createContext<TestContextType | null>(null);

type TestProviderProps = {
  testId: string;
  children: React.ReactNode;
};

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
