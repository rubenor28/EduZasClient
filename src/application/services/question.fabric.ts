import { type AnyQuestion, QuestionTypes, type Question } from "@domain";
import { v4 as uuidv4 } from "uuid";

const defaultQuestion: Omit<Question, "id"> = { title: "Nueva pregunta" };

export const questionFabric: Record<QuestionTypes, () => AnyQuestion> = {
  [QuestionTypes.MultipleChoise]: () => {
    const id = uuidv4();
    return {
      ...defaultQuestion,
      type: QuestionTypes.MultipleChoise,
      options: { [id]: "Opción 1" },
      correctOption: id,
      id,
    };
  },
  [QuestionTypes.MultipleSelection]: () => {
    const id = uuidv4();
    return {
      ...defaultQuestion,
      type: QuestionTypes.MultipleSelection,
      options: { [id]: "Opción 1" },
      correctOptions: [id],
      id,
    };
  },
  [QuestionTypes.Ordering]: () => ({
    ...defaultQuestion,
    type: QuestionTypes.Ordering,
    sequence: ["Primer opción"],
    id: uuidv4(),
  }),
  [QuestionTypes.Open]: () => ({
    ...defaultQuestion,
    type: QuestionTypes.Open,
    id: uuidv4(),
  }),
  [QuestionTypes.ConceptRelation]: () => ({
    ...defaultQuestion,
    type: QuestionTypes.ConceptRelation,
    concepts: [],
    id: uuidv4(),
  }),
};

export const QuestionFabric = (type: QuestionTypes): AnyQuestion => {
  const constructor =
    questionFabric[type] ?? questionFabric[QuestionTypes.Open];

  const q = constructor();
  console.log("Constructor de pregunta");
  console.log(q)
  return q;
};
