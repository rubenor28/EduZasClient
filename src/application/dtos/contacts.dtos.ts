import type { Criteria, StringQuery } from "./common";

export type NewContact = {
  agendaOwnerId: number;
  userId: number;
  alias: string;
  notes?: string;
  tags?: string[];
};

export type ContactUpdate = {
  agendaOwnerId: number;
  userId: number;
  alias: string;
  notes?: string;
};

export type ContactCriteria = Criteria & {
  alias?: StringQuery;
  agendaOwnerId?: number;
  userId?: number;
  tags?: string[];
};

export type TagCriteria = Criteria & {
  text?: StringQuery;
  contactId?: number;
  agendaOwnerId?: number;
};

export type ContactTagId = {
  tag: string;
  agendaOwnerId: number;
  userId: number;
};
