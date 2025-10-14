import type { ClassDomain } from "@domain";
import type { ClassCriteriaDTO } from "@application";
import { useEffect, useState } from "react";
import { Card, CardGrid, Dialog, PlusSvg, type CardAction } from "@components";
import { ClassViewContext, PopUpFormContext, useAuthContext } from "@context";
import { SearchClassForm } from "../Components/SearchClassForm";
import { classService } from "@dependencies";
import { EnrolledClassesForm } from "../Components/EnrolledClassForm";

export function EnrolledClasses() {
  const defaultCriteria = { page: 1, active: true };

  const [classes, setClasses] = useState<ClassDomain[]>([]);
  const [criteria, setCriteria] = useState<ClassCriteriaDTO>(defaultCriteria);
  const [formOpen, setFormOpen] = useState(false);

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

  useEffect(() => {
    refreshClasses();
  }, []);

  // const getCardOpts = (c: ClassDomain): CardAction[] => {
  //   const hide: CardAction = {
  //     label: "Ocultar",
  //     onClick: () => {
  //       classService.updateClass()
  //     },
  //   }

  //   return [hide, unenroll]
  // };

  return (
    <ClassViewContext.Provider
      value={{ classes, criteria, setClasses, setCriteria, refreshClasses }}
    >
      <PopUpFormContext.Provider
        value={{ open: formOpen, setPopUpOpen: setFormOpen }}
      >
        <nav className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
          <SearchClassForm mode="student" onSubmit={refreshClasses} />

          <button
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setFormOpen(true)}
          >
            <PlusSvg />
          </button>
        </nav>
        <Dialog open={formOpen} onClose={() => setFormOpen(false)}>
          <EnrolledClassesForm />
        </Dialog>
        <CardGrid>
          {classes.map((c) => (
            <Card
              key={c.id}
              title={c.className}
              subtitle={c.subject}
              headerColor={c.color}
              showActions={false}
            >
              {c.section}
            </Card>
          ))}
        </CardGrid>
      </PopUpFormContext.Provider>
    </ClassViewContext.Provider>
  );
}
