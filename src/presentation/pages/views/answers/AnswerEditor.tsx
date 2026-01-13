import {
  defaultQuestionAnswer,
  type PublicTest,
  type Answer,
  QuestionTypes,
} from "@domain";
import { type AnswerQuestionUpdater } from "@presentation";
import { useState } from "react";
import { QuestionAnswerRenderer } from "./QuestionAnswerRenderer";

export function AnswerEditor() {
  const test: PublicTest = {
    id: "bd05f62e-d2d9-439c-ba86-115092cee5c8",
    active: true,
    color: "rojo",
    professorId: 1,
    timeLimitMinutes: 60,
    title: "Evaluacion prueba",
    content: [
      {
        id: "b83d5e74-bb18-4e6e-8d2b-a311986126fb",
        title: "2x2",
        type: QuestionTypes.Open,
      },
    ],
  };

  const [answer, setAnswer] = useState<Answer>({
    testId: test.id,
    classId: "class-test",
    userId: 2,
    content: {},
    metadata: { manualMarkAsCorrect: [] },
  });

  const setAnswerQuestion = (id: string, content: AnswerQuestionUpdater) => {
    setAnswer((prev) => {
      if (!prev) return prev;

      const updatedContent = { ...prev.content };

      updatedContent[id] =
        typeof content === "function" ? content(updatedContent[id]) : content;

      return { ...prev, content: updatedContent };
    });
  };

  // const { answer, test, setAnswerQuestion } = useAnswer();

  return (
    <>
      {test.content.map((q) => {
        const { id } = q;

        let questionAnswer = answer.content[id];

        if (questionAnswer === undefined) {
          questionAnswer = defaultQuestionAnswer(q);
          setAnswerQuestion(id, questionAnswer);
        }

        return (
          <QuestionAnswerRenderer
            answer={questionAnswer}
            question={q}
            onChange={(q) => setAnswerQuestion(id, q)}
          />
        );
      })}
    </>
  );
}
