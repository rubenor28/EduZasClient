import type { ClassCriteriaDTO } from "@application";
import { CardGrid, Card } from "@components";
import { classService } from "@dependencies";
import type { ClassDomain } from "@domain";
import { useEffect, useState } from "react";

export function EnrolledClasses() {
  const [classes, setClasses] = useState<ClassDomain[]>([]);
  const [criteria, setCriteria] = useState<ClassCriteriaDTO>({ page: 1 });

  useEffect(() => {
    classService.getEnrolledClasses(criteria).then((result) => {
      if (result.err) {
        console.error("Internal server error");
        return;
      }

      setClasses(result.val.results);
      setCriteria(result.val.criteria);
    });
  }, []);

  return (
    <CardGrid>
      {classes.map((c) => (
        <Card title={c.className} subtitle={c.subject}></Card>
      ))}
    </CardGrid>
  );
}
