import { NotFound, TestProvider } from "@presentation";
import { useParams } from "react-router";
import { TestEditor } from "./TestEditor";

export type Params = {
  testId: string;
};

export function TestEditorPage() {
  const { testId } = useParams<Params>();

  if (!testId) return <NotFound />;

  return (
    <TestProvider testId={testId}>
      <TestEditor />
    </TestProvider>
  );
}
