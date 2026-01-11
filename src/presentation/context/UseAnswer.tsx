import { apiGet, apiPost, type FieldErrorDTO } from "@application";
import type { PublicTest, AnyQuestionAnswer } from "@domain";
import { Box, CircularProgress } from "@mui/material";
import type { Answer, AnswerContent } from "domain/answers";
import { NotFound } from "presentation/components";
import { createContext, useContext, useEffect, useState } from "react";

type AnswerContentUpdater =
  | AnswerContent
  | ((prev: AnswerContent) => AnswerContent);

type AnswerQuestionUpdater =
  | AnyQuestionAnswer
  | ((prev: AnyQuestionAnswer) => AnyQuestionAnswer);

export type AnswerConcextType = {
  test: PublicTest;
  answer: Answer;
  setTest: (test: PublicTest) => void;
  setContent: (answer: AnswerContentUpdater) => void;
  setAnswerQuestion: (id: string, answer: AnswerQuestionUpdater) => void;
  fieldErrors: FieldErrorDTO[];
  setFieldErrors: (fieldErrors: FieldErrorDTO[]) => void;
};

const AnswerContext = createContext<AnswerConcextType | null>(null);

type AnswerProviderProps = {
  classId: string;
  testId: string;
  answerId: string;
  children: React.ReactNode;
};

export const AnswerProvider = ({
  classId,
  testId,
  answerId,
  children,
}: AnswerProviderProps) => {
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [test, setTest] = useState<PublicTest | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<FieldErrorDTO[]>([]);

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
    const error = false;

    try {
      const fetchAnswer = async () => {
        const answer = await apiGet<Answer>(`/answer/${answerId}`);
        setAnswer(answer);
      };
    } catch (e) {
      if(e instanceof NotFound)
        const answer = await apiPost<Answer>()
    }

    try {
      const fetchTest = async () => {
        const answer = await apiGet<PublicTest>(`tests/${testId}/${classId}`);
        setTest(answer);
      };

      Promise.all([fetchAnswer(), fetchTest()]);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }, [answerId]);

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
          test,
          setContent,
          setTest,
          setAnswerQuestion,
          fieldErrors,
          setFieldErrors,
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
