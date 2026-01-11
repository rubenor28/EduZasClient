import { useEffect } from "react";
import { useParams } from "react-router";

type Params = {
  classId: string;
  testId: string;
};

export function AnswerEditorPage() {
  const {} = useParams<Params>();

}
