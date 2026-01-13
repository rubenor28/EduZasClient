import { AnswerProvider, NotFound, useUser } from "@presentation";
import { useParams } from "react-router";

type Params = {
  classId: string;
  testId: string;
  answerId: string;
};

export function AnswerEditorPage() {
  const { user } = useUser();
  const { classId, testId, answerId } = useParams<Params>();

  if (!classId || !testId || !answerId) return <NotFound />;

  return (
    <AnswerProvider
      testId={testId}
      classId={classId}
      userId={user.id}
    ><></></AnswerProvider>
  );
}
