import type { ClassDomain } from "@domain";
import type { ClassCriteriaDTO, ClassUpdateDTO } from "@application";
import { CardGrid, Card, Dialog, type CardAction, PlusSvg } from "@components";
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

  const handleArchive = (c: ClassUpdateDTO) => {
    classService
      .updateClass({
        ...c,
        active: !c.active,
      })
      .then((result) => {
        if (result.err) {
          console.error("Internal server error");
          return;
        }
        refreshClasses();
      });
  };

  const handleDelete = (id: string) => {
    classService.deleteClass(id).then((result) => {
      if (result.err) {
        console.error("Internal server error");
        return;
      }
      refreshClasses();
    });
  };

  const getCardActions = (c: ClassDomain): CardAction[] => {
    const archive = {
      label: criteria.active ? "Archivar" : "Desarchivar",
      onClick: () => handleArchive(c),
    };

    const modify = {
      label: "Modificar",
      onClick: () =>
        setFormState({
          open: true,
          input: { mode: "modify", data: c },
        }),
    };

    const deleteAction = {
      label: "Eliminar",
      onClick: () => handleDelete(c.id),
    };

    // Opciones clases archivadas
    if (!criteria.active) {
      return [archive, deleteAction];
    }

    // Opciones clases activas
    return [modify, archive];
  };

  const refreshClasses = () => {
    classService.getAssignedClasses(criteria).then((result) => {
      if (result.err) {
        console.error("Internal server error");
        return;
      }

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
          <Dialog
            open={formState.open}
            onClose={() => setFormState({ ...formState, open: false })}
          >
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
                actions={getCardActions(c)}
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
