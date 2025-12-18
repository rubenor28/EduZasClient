import { apiGet } from "@application";
import { type Test, type TestContent } from "@domain";
import { Box, CircularProgress } from "@mui/material";
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
}

const TestContext = createContext<TestContextType | null>(null);

type TestProviderProps = {
  testId: string;
  children: React.ReactNode;
};

export const TestProvider = ({ testId, children }: TestProviderProps) => {
  const [test, setTest] = useState<Test | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const test = await apiGet<Test>("/auth/me");
      setTest(test);
      setIsLoading(false);
    };

    fetchUser();
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

  if (test) {
    return (
      <TestContext.Provider
        value={{
          test,
          orderedIds: Object.keys(test),
          setTest,
          setTitle: (title) => setTest((prev) => prev === null ? null  : { ...prev, title}),
          setColor: (color) => setTest((prev) => prev === null ? null  : { ...prev, color}),
          setContent: (content) => setTest((prev) => prev === null ? null  : { ...prev, content}),
          setTimeLimit: (timeLimitMinutes) => setTest((prev) => prev === null ? null  : { ...prev, timeLimitMinutes}),
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
