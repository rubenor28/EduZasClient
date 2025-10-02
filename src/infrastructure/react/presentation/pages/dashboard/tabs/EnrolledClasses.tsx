import { CardGrid, Card } from "@components";

type EnrolledClassesProps = {
  userId: number;
};

export function EnrolledClasses({ userId }: EnrolledClassesProps) {
  

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
