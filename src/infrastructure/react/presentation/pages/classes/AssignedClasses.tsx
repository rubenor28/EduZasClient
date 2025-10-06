import { StringSearchType, type ClassDomain } from "@domain";
import type { ClassCriteriaDTO, StringQueryDTO } from "@application";
import { CardGrid, Card, Dialog } from "@components";
import { classService } from "@dependencies";
import { useEffect, useState } from "react";
import { ClassForm, type ClassFormMode } from "./ClassForm";
import { SearchClassForm } from "./SearchClassForm";

type FormMode = ClassFormMode & { open: boolean };

export function AssignedClasses() {
  const defaultCriteria: ClassCriteriaDTO = { page: 1, active: true };

  const [classes, setClasses] = useState<ClassDomain[]>([]);
  const [criteria, setCriteria] = useState<ClassCriteriaDTO>(defaultCriteria);
  const [formMode, setFormMode] = useState<FormMode>({
    type: "create",
    open: false,
  });

  const refreshClasses = (criteriaToUse: ClassCriteriaDTO) => {
    classService.getAssignedClasses(criteriaToUse).then((result) => {
      if (result.err) {
        console.error("Internal server error");
        return;
      }

      setClasses(result.val.results);
      setCriteria(result.val.criteria);
    });
  };

  useEffect(() => {
    refreshClasses(criteria);
  }, []);

  const handleCloseForm = () => {
    setFormMode((prev) => ({ ...prev, open: false }));
    refreshClasses(defaultCriteria);
  };

  const inputToStringQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const query: StringQueryDTO = {
      searchType: StringSearchType.LIKE,
      text: value.trim(),
    };

    setCriteria((prev) => ({
      ...prev,
      [name]: query,
    }));
  };

  const selectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setCriteria((prev) => ({
      ...prev,
      [name]: value === "true" ? true : false,
    }));
  };

  return (
    <>
      <nav className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
        <SearchClassForm
          onInputChange={inputToStringQuery}
          onSelectChange={selectChange}
          onSubmit={() => {
            refreshClasses(criteria);
            console.log(criteria);
          }}
        />
        <button
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setFormMode({ type: "create", open: true })}
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
      <Dialog open={formMode.open} onClose={handleCloseForm}>
        <ClassForm mode={formMode} onSubmit={handleCloseForm} />
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
                  setFormMode({ type: "update", data: c, open: true }),
              },
              { label: "Archivar", onClick: () => console.log("Algo") },
            ]}
          >
            {c.section}
          </Card>
        ))}
      </CardGrid>
    </>
  );
}
