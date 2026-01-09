import type { FieldErrorDTO } from "@application";
import type { PublicTest } from "@domain";
import type { AnswerContent } from "domain/answers";

type AnswerContentUpdater =
  | AnswerContent
  | ((prev: AnswerContent) => AnswerContent);

export type AnswerConcextType = {
  test: PublicTest;
  setTest: (test: PublicTest) =>void;
  setContent: (content: AnswerContentUpdater) => void;
  fieldErrors: FieldErrorDTO[];
  setFieldErrors: (fieldErrors: FieldErrorDTO[]) => void;
};
