import type { PublicQuestion, PublicQuestionVariant } from "./public.questions";
import { type ConceptPair, QuestionTypes } from "./questions";

/**
 * Unión de todos los tipos de respuestas posibles para las preguntas.
 */
export type QuestionAnswer =
  | { readonly type: QuestionTypes.Open; text: string | null }
  | {
      readonly type: QuestionTypes.MultipleChoise;
      selectedOption: string | null;
    }
  | {
      readonly type: QuestionTypes.MultipleSelection;
      selectedOptions: string[];
    }
  | { readonly type: QuestionTypes.Ordering; sequence: string[] }
  | {
      readonly type: QuestionTypes.ConceptRelation;
      answeredPairs: ConceptPair[];
    };

/**
 * Helper para extraer una variante específica de respuesta por su tipo.
 */
export type QuestionAnswerVariant<T extends QuestionTypes> = Extract<
  QuestionAnswer,
  { type: T }
>;

/**
 * Genera un objeto de respuesta inicial por defecto para una pregunta dada.
 * @param question La pregunta para la cual generar la respuesta por defecto.
 * @returns Un objeto de tipo QuestionAnswer con valores iniciales.
 */
export function defaultQuestionAnswer(question: PublicQuestion): QuestionAnswer;
export function defaultQuestionAnswer(
  question: PublicQuestionVariant<QuestionTypes.Open>,
): QuestionAnswerVariant<QuestionTypes.Open>;
export function defaultQuestionAnswer(
  question: PublicQuestionVariant<QuestionTypes.Ordering>,
): QuestionAnswerVariant<QuestionTypes.Ordering>;
export function defaultQuestionAnswer(
  question: PublicQuestionVariant<QuestionTypes.MultipleChoise>,
): QuestionAnswerVariant<QuestionTypes.MultipleChoise>;
export function defaultQuestionAnswer(
  question: PublicQuestionVariant<QuestionTypes.ConceptRelation>,
): QuestionAnswerVariant<QuestionTypes.ConceptRelation>;
export function defaultQuestionAnswer(
  question: PublicQuestionVariant<QuestionTypes.MultipleSelection>,
): QuestionAnswerVariant<QuestionTypes.MultipleSelection>;

export function defaultQuestionAnswer(
  question: PublicQuestionVariant<QuestionTypes>,
): QuestionAnswer {
  const { type } = question;

  if (type === QuestionTypes.MultipleChoise)
    return { type, selectedOption: question.options[0].id };

  if (type === QuestionTypes.MultipleSelection)
    return { type, selectedOptions: [] };

  if (type === QuestionTypes.Ordering)
    return { type, sequence: [...question.items] };

  if (type === QuestionTypes.Open) return { type, text: null };

  if (type === QuestionTypes.ConceptRelation) {
    return { type, answeredPairs: [] };
  }

  throw Error(`QuestionAnswer ${type} not suported`);
}
