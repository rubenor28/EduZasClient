import type { ClassDomain } from "@domain";
import type { ClassCriteriaDTO } from "@application";
import { CardGrid, Card } from "@components";
import { classService } from "@dependencies";
import { useEffect, useState } from "react";
import { ClassForm, type ClassFormMode } from "./ClassForm";
import { Dialog } from "../../components/Dialog/Dialog";

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

  return (
    <>
      <nav className="flex justify-end items-center gap-x-4">
        <button
          className="submit-button"
          onClick={() => setFormMode({ type: "create", open: true })}
        >
          Nueva clase
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
