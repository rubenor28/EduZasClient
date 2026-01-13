import { NotFound } from "presentation/components";
import { AnswerProvider } from "presentation/context/UseAnswer";
import { useParams } from "react-router";

type Params = {
  classId: string;
  testId: string;
  answerId: string;
};

export function AnswerEditorPage() {
  const { classId, testId, answerId } = useParams<Params>();

  if (!classId || !testId || !answerId) return <NotFound />;

  return (
    <AnswerProvider
      testId={testId}
      classId={classId}
      answerId={answerId}
    ></AnswerProvider>
  );
}
