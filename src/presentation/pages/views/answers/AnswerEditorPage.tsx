import { AnswerProvider, NotFound, useUser } from "@presentation";
import { useParams } from "react-router";
import { AnswerEditor } from "./AnswerEditor";

/**
 * Parámetros de ruta esperados para la página de realización de evaluaciones.
 */
type Params = {
  /** ID de la clase. */
  classId: string;
  /** ID de la evaluación. */
  testId: string;
};

/**
 * Página que encapsula el entorno para realizar una evaluación.
 * 
 * Se encarga de extraer los parámetros de la URL y proveer el `AnswerProvider`,
 * el cual gestiona la carga/creación de la respuesta del estudiante y la carga
 * del contenido de la evaluación pública.
 */
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
