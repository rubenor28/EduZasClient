export const SearchType = {
  EQ: 0,
  LIKE: 1,
} as const;

export type SearchType = typeof SearchType[keyof typeof SearchType];

export type StringQuery = {
  text: string;
  searchType: SearchType;
};

export type Criteria = {
  page: number;
  pageSize?: number;
};

export type PaginatedQuery<T, C> = {
  criteria: C;
  results: T[];
  page: number;
  totalPages: number;
};
