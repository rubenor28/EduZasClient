import {
  defaultQuestionAnswer,
  type PublicTest,
  type Answer,
  QuestionTypes,
} from "@domain";
import { type AnswerQuestionUpdater } from "@presentation";
import { useState } from "react";
import { QuestionAnswerRenderer } from "./QuestionAnswerRenderer";

export function AnswerEditorTest() {
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
        title: "Pregunta Abierta: ¿Cual es la capital de Francia?",
        type: QuestionTypes.Open,
      },
      {
        id: "a3f5c9e2-1d7b-4a8c-9e0f-2b1a3c5d6e7f",
        title: "Pregunta de Múltiple Opción: ¿Cuál de los siguientes es un color primario?",
        type: QuestionTypes.MultipleChoise,
        options: [
          { id: "opt1", text: "Verde" },
          { id: "opt2", text: "Azul" },
          { id: "opt3", text: "Naranja" },
        ],
      },
      {
        id: "c7e1b5d9-f3a0-4c6e-8b2d-1a0e3f2c4b5d",
        title: "Pregunta de Selección Múltiple: Selecciona todos los animales que son mamíferos.",
        type: QuestionTypes.MultipleSelection,
        options: [
          { id: "sel1", text: "Perro" },
          { id: "sel2", text: "Oveja" },
          { id: "sel3", text: "Tiburón" },
          { id: "sel4", text: "Aguila" },
        ],
      },
      {
        id: "e9a2d4c8-0b6f-4d1e-9c7a-5b3f1e0d2c1a",
        title: "Pregunta de Relación de Conceptos: Relaciona los países con sus capitales.",
        type: QuestionTypes.ConceptRelation,
        columnA: ["España", "Italia", "Alemania"],
        columnB: ["Roma", "Madrid", "Berlín"],
      },
      {
        id: "f1b3e5d7-9c8a-4b0d-1e2f-3a4b5c6d7e8f",
        title: "Pregunta de Ordenamiento: Ordena los siguientes eventos históricon cronológicamente.",
        type: QuestionTypes.Ordering,
        items: ["Revolución Francesa", "Caída del Muro de Berlín", "Descubrimiento de América"],
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
            key={id}
            answer={questionAnswer}
            question={q}
            onChange={(q) => setAnswerQuestion(id, q)}
          />
        );
      })}
    </>
  );
}
