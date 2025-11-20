export type SearchType = "LIKE" | "EQUALS";

export type StringQuery = {
  text: string;
  searchType: SearchType;
};

export type Criteria = {
  page: number;
};

export type PaginatedQuery<T, C> = {
  criteria: C;
  results: T[];
  page: number;
  totalPages: number;
};
