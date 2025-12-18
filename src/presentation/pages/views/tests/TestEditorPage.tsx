import { apiGet, type FieldErrorDTO } from "@application";
import type { Test } from "@domain";
import { NotFound, TestProvider } from "@presentation";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { TestEditor } from "./TestEditor";

export type Params = {
  testId: string;
};

export function TestEditorPage() {
  const { testId } = useParams<Params>();

  if(!testId) return <NotFound />

  return <TestProvider testId={testId}>
    <TestEditor/>
  </TestProvider>;
}
