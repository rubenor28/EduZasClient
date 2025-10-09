import type { ClassDomain } from "@domain";
import type { ClassCriteriaDTO } from "@application";
import { useState } from "react";
import { Card, CardGrid, PlusSvg } from "@components";
import { ClassViewContext } from "@context";
import { SearchClassForm } from "../Components/SearchClassForm";
import { classService } from "@dependencies";

export function EnrolledClasses() {
  const defaultCriteria = { page: 1, active: true };

  const [classes, setClasses] = useState<ClassDomain[]>([]);
  const [criteria, setCriteria] = useState<ClassCriteriaDTO>(defaultCriteria);

  const refreshClasses = () => {
    classService.getEnrolledClasses(criteria).then((result) => {
      if (result.err) {
        console.error("Internal server error");
        return;
      }

      setCriteria(result.val.criteria);
      setClasses(result.val.results);
    });
  };

  return (
    <ClassViewContext.Provider
      value={{ classes, criteria, setClasses, setCriteria, refreshClasses }}
    >
      <nav className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
        <SearchClassForm mode="professor" onSubmit={refreshClasses} />

        <button
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() =>
            setFormState({
              open: true,
              input: { mode: "create", data: defaultNewClass },
            })
          }
        >
          <PlusSvg />
        </button>
      </nav>
      <CardGrid>
        {classes.map((c) => (
          <Card
            key={c.id}
            title={c.className}
            subtitle={c.subject}
            headerColor={c.color}
            showActions={true}
            actions={[]}
          >
            {c.section}
          </Card>
        ))}
      </CardGrid>
    </ClassViewContext.Provider>
  );
}
