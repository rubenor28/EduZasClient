import { NotFound, TestProvider } from "@presentation";
import { useParams } from "react-router";
import { TestEditor } from "./TestEditor";

/**
 * Parámetros de ruta esperados por la página del editor.
 */
export type Params = {
  /** ID de la evaluación a editar. */
  testId: string;
};

/**
 * Página que encapsula el editor de evaluaciones.
 * 
 * Se encarga de extraer el `testId` de la URL y proveer el `TestProvider`
 * necesario para que los componentes hijos gestionen el estado de la evaluación.
 */
export function TestEditorPage() {
  const { testId } = useParams<Params>();

  if (!testId) return <NotFound />;

  return (
    <TestProvider testId={testId}>
      <TestEditor />
    </TestProvider>
  );
}
