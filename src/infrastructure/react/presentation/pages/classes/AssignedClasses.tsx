import type { ClassDomain } from "@domain";
import type { ClassCriteriaDTO } from "@application";
import { CardGrid, Card } from "@components";
import { classService } from "@dependencies";
import { useEffect, useState } from "react";
import { ClassForm, type ClassFormMode } from "./ClassForm";
import { Dialog } from "../../components/Dialog/Dialog";

type FormMode = ClassFormMode & { open: boolean };

export function AssignedClasses() {
  const [classes, setClasses] = useState<ClassDomain[]>([]);
  const [criteria, setCriteria] = useState<ClassCriteriaDTO>({ page: 1 });
  const [formMode, setFormMode] = useState<FormMode>({
    type: "create",
    open: false,
  });

  const refreshClasses = () => {
    classService.getAssignedClasses(criteria).then((result) => {
      if (result.err) {
        console.error("Internal server error");
        return;
      }

      setClasses(result.val.results);
      setCriteria(result.val.criteria);
    });
  };

  useEffect(() => {
    refreshClasses;
  }, []);

  return (
    <>
      <Dialog
        open={formMode.open}
        onClose={() => setFormMode((prev) => ({ ...prev, open: false }))}
      >
        <ClassForm mode={formMode} />
      </Dialog>
      <CardGrid>
        {classes.map((c) => (
          <Card
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
