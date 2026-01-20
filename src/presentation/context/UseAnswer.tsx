import {
  apiGet,
  apiPost,
  NotFoundError,
  type FieldErrorDTO,
} from "@application";
import type {
  PublicTest,
  QuestionAnswer,
  Answer,
  AnswerContent,
} from "@domain";
import { Box, CircularProgress } from "@mui/material";
import { NotFound } from "@presentation";
import { createContext, useContext, useEffect, useState } from "react";

export type AnswerContentUpdater =
  | AnswerContent
  | ((prev: AnswerContent) => AnswerContent);

export type AnswerQuestionUpdater =
  | QuestionAnswer
  | ((prev: QuestionAnswer) => QuestionAnswer);

export type AnswerUpdater = Answer | ((prev: Answer) => Answer);

export type AnswerConcextType = {
  test: PublicTest;
  answer: Answer;
  answeredQuestions: Set<string>;
  setAnswer: React.Dispatch<React.SetStateAction<Answer | null>>;
  setAnsweredQuestions: (answerId: string) => void;
  setTest: (test: PublicTest) => void;
  setContent: (answer: AnswerContentUpdater) => void;
  setAnswerQuestion: (id: string, answer: AnswerQuestionUpdater) => void;
  fieldErrors: FieldErrorDTO[];
  setFieldErrors: (fieldErrors: FieldErrorDTO[]) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
};

const AnswerContext = createContext<AnswerConcextType | null>(null);

type AnswerProviderProps = {
  classId: string;
  testId: string;
  userId: number;
  children: React.ReactNode;
};

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

        setAnswer(answer);
      } catch (e) {
        if (e instanceof NotFoundError) {
          const newAnswer = await apiPost<Answer>("/answers", {
            userId,
            testId,
            classId,
          });

          setAnswer(newAnswer);
        }
      }

      try {
        const test = await apiGet<PublicTest>(`/tests/${testId}/${classId}`);
        setTest(test);
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
