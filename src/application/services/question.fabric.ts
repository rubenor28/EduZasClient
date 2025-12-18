import { type AnyQuestion, QuestionTypes, type Question } from "@domain";
import { v4 as uuidv4 } from "uuid";

const defaultQuestion: Question = {
  title: "Nueva pregunta",
  imageUrl: null,
};

export const questionFabric: Record<QuestionTypes, () => AnyQuestion> = {
  [QuestionTypes.MultipleChoise]: () => {
    var id = uuidv4();
    return {
      ...defaultQuestion,
      type: QuestionTypes.MultipleChoise,
      options: { [id]: "Opción 1" },
      correctOption: id,
    };
  },
  [QuestionTypes.MultipleSelection]: () => {
    var id = uuidv4();
    return {
      ...defaultQuestion,
      type: QuestionTypes.MultipleSelection,
      options: { [id]: "Opción 1" },
      correctOptions: [id],
    };
  },
  [QuestionTypes.Ordering]: () => ({
    ...defaultQuestion,
    type: QuestionTypes.Ordering,
    sequence: ["Primer opción"],
  }),
  [QuestionTypes.Open]: () => ({
    ...defaultQuestion,
    type: QuestionTypes.Open,
  }),
  [QuestionTypes.ConceptRelation]: () => ({
    ...defaultQuestion,
    type: QuestionTypes.ConceptRelation,
    concepts: {
      [uuidv4()]: { conceptA: "A", conceptB: "B" },
    },
  }),
};

export const QuestionFabric = (type: QuestionTypes): AnyQuestion => {
  const constructor =
    questionFabric[type] ?? questionFabric[QuestionTypes.Open];
  return constructor();
};
