import { CardGrid, Card } from "@components";
import type { ClassDomain } from "@domain";
import { useEffect, useState } from "react";

type EnrolledClassesProps = {
  userId: number;
};

export function EnrolledClasses({ userId }: EnrolledClassesProps) {
  const [classes, setClasses] = useState<ClassDomain[]>([]);

  useEffect(()=>{}, []);

  return (
    <CardGrid>
      <Card
        title="Aasjdlksajdlajdlajdlajdlajdlasjdlajdlajsdlasjdlkajdlajdlajdlajdlsajdlasjdlasj"
        subtitle="B"
      >
        <p>C</p>
      </Card>
      <Card title="A" subtitle="B">
        <p>C</p>
      </Card>
      <Card title="A" subtitle="B">
        <p>C</p>
      </Card>
      <Card title="A" subtitle="B">
        <p>C</p>
      </Card>
    </CardGrid>
  );
}
