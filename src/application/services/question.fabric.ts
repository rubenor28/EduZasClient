import { type AnyQuestion, QuestionTypes } from "@domain";
import { v4 as uuidv4 } from "uuid";

const questionFabric: Record<QuestionTypes, () => AnyQuestion> = {
  [QuestionTypes.Open]: () => ({
    type: QuestionTypes.Open,
    imageUrl: null,
    title: "Nueva pregunta",
  }),
  [QuestionTypes.MultipleChoise]: () => {
    var id = uuidv4();
    return {
      type: QuestionTypes.MultipleChoise,
      title: "Nueva pregunta",
      imageUrl: null,
      options: { [id]: "Opcion 1" },
      correctOption: id,
    };
  },
};

export const QuestionFabric = (type: QuestionTypes): AnyQuestion => {
  const constructor =
    questionFabric[type] ?? questionFabric[QuestionTypes.Open];
  return constructor();
};
