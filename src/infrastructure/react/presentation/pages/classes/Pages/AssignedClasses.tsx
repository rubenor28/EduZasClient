import type { ClassCriteriaDTO } from "@application";
import { CardGrid, Card, Dialog } from "@components";
import { classService } from "@dependencies";
import { useEffect, useState } from "react";

import {
  ClassPopUpFormContext,
  ClassViewContext,
  type ClassPopUpFormData,
  type ClassFormInput,
} from "@context";

import { ClassForm } from "../Components/ClassForm";
import { SearchClassForm } from "../Components/SearchClassForm";
import type { ClassDomain } from "@domain";

export function AssignedClasses() {
  const defaultCriteria = { page: 1, active: true };
  const defaultNewClass = { className: "", color: "#007bff" };
  const defaultFormState: ClassPopUpFormData = {
    open: false,
    input: { mode: "create", data: defaultNewClass },
  };

  const [criteria, setCriteria] = useState<ClassCriteriaDTO>(defaultCriteria);
  const [classes, setClasses] = useState<ClassDomain[]>([]);
  const [formState, setFormState] = useState(defaultFormState);

  const cvCtxValue = {
    ...formState,
    setOpen: (open: boolean) => setFormState((prev) => ({ ...prev, open })),
    setInput: (input: ClassFormInput) =>
      setFormState((prev) => ({ ...prev, input })),
  };

  const refreshClasses = () => {
    classService.getAssignedClasses(criteria).then((result) => {
      if (result.err) {
        console.error("Internal server error");
        return;
      }

      console.log(`WithStudent ${result.val.criteria.withStudent}`);

      setCriteria(result.val.criteria);
      setClasses(result.val.results);
    });
  };

  useEffect(() => {
    refreshClasses();
  }, []);

  return (
    <>
      <ClassViewContext.Provider
        value={{ classes, criteria, setClasses, setCriteria, refreshClasses }}
      >
        <ClassPopUpFormContext.Provider value={cvCtxValue}>
          <nav className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
            <SearchClassForm />
            <button
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() =>
                setFormState({
                  open: true,
                  input: { mode: "create", data: defaultNewClass },
                })
              }
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 12H18M12 6V18"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </nav>
          <Dialog open={formState.open}>
            <ClassForm />
          </Dialog>
          <CardGrid>
            {classes.map((c) => (
              <Card
                key={c.id}
                title={c.className}
                subtitle={c.subject}
                headerColor={c.color}
                showActions={true}
                actions={[
                  {
                    label: "Modificar",
                    onClick: () =>
                      setFormState({
                        open: true,
                        input: { mode: "modify", data: c },
                      }),
                  },
                  { label: "Archivar", onClick: () => console.log("Algo") },
                ]}
              >
                {c.section}
              </Card>
            ))}
          </CardGrid>
        </ClassPopUpFormContext.Provider>
      </ClassViewContext.Provider>
    </>
  );
}
