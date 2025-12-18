import { NotFound, TestProvider, useTest } from "@presentation";
import { useParams } from "react-router";

export type Params = {
  testId: string;
};

export function TestEditorPage() {
  const { testId } = useParams<Params>();

  if (!testId) return <NotFound />;

  return (
    <TestProvider testId={testId}>
      <TestEditorContainer />
    </TestProvider>
  );
}

function TestEditorContainer() {
  const { test } = useTest();

}
