import { apiGet } from "@application";
import { type Test, type TestContent } from "@domain";
import { Box, CircularProgress } from "@mui/material";
import { NotFound } from "@presentation";
import { createContext, useContext, useEffect, useState } from "react";

// Definir el Estado y las Acciones del Store
export interface TestContextType {
  test: Test;
  orderedIds: string[];
  setTest: (test: Test) => void;
  setTitle: (title: string) => void;
  setColor: (color: string) => void;
  setTimeLimit: (minutes: number | undefined) => void;
  setContent: (content: TestContent) => void;
  setOrderedIds: (ids: string[]) => void;
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

  useEffect(() => {
    try {
      const fetchUser = async () => {
        const test = await apiGet<Test>(`/tests/${testId}`);
        setTest(test);
        setOrderedIds(Object.keys(test.content));
      };
      fetchUser();
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

  const setContent = (content: TestContent) => {
    setTest((prev) => (prev ? { ...prev, content } : null));
    setOrderedIds(Object.keys(content));
  };

  const setTimeLimit = (timeLimitMinutes?: number) =>
    setTest((prev) => (prev ? { ...prev, timeLimitMinutes } : null));

  if (test) {
    return (
      <TestContext.Provider
        value={{
          test,
          orderedIds,
          setOrderedIds,
          setTest,
          setTitle,
          setColor,
          setContent,
          setTimeLimit,
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
