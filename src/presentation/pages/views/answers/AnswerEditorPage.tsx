import { AnswerProvider, NotFound, useUser } from "@presentation";
import { useParams } from "react-router";
import { AnswerEditor } from "./AnswerEditor";

type Params = {
  classId: string;
  testId: string;
};

export function AnswerEditorPage() {
  const { user } = useUser();
  const { classId, testId } = useParams<Params>();

  if (!classId || !testId) return <NotFound />;

  return (
    <AnswerProvider testId={testId} classId={classId} userId={user.id}>
      <AnswerEditor />
    </AnswerProvider>
  );
}
