import type { Block } from "@blocknote/core";

export type Resource = {
    id: string;
    active: boolean;
    title: string;
    content: Block[];
    professorId: number;
};
