export type SearchType = "LIKE" | "EQUALS";

export type StringQuery = {
  text: string;
  searchType: SearchType;
};
