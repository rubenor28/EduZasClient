import { defaultQuestionAnswerFabric } from "@domain";
import { useAnswer } from "presentation/context/UseAnswer";

export function AnswerEditor() {
  const { answer, test, setAnswerQuestion } = useAnswer();

  return (
    <>
      {test.content.map((q) => {
        const { id, title } = q;

        const questionAnswer = answer.content[id];

        if (questionAnswer === undefined) {
          setAnswerQuestion(id, defaultQuestionAnswerFabric(q));
        }

      })}
    </>
  );
}
