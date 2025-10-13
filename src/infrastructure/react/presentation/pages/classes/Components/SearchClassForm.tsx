import type { ClassCriteriaDTO, WithStudent } from "@application";
import { FormInput, FormSelect } from "@components";
import { useClassViewContext } from "@context";
import { StringSearchType } from "@domain";

type SearchClassFormProps = {
  mode?: "professor" | "student";
  onSubmit: () => void;
};

export function SearchClassForm({
  mode = "professor",
  onSubmit,
}: SearchClassFormProps) {
  const { criteria, setCriteria } = useClassViewContext();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    console.log(`Value: ${value}`);
    if (value.trim() === "") {
      setCriteria({
        ...criteria,
        [name]: undefined,
      });

      return;
    }

    setCriteria({
      ...criteria,
      [name]: {
        text: value.trim(),
        searchType: StringSearchType.LIKE,
      },
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "active") {
      setCriteria({ ...criteria, active: value === "true" });
    } else if (name === "withStudentHidden") {
      const withStudent: WithStudent | undefined = criteria.withStudent
        ? { id: criteria.withStudent.id, hidden: value === "true" }
        : undefined;

      console.log(withStudent);

      setCriteria({
        ...criteria,
        withStudent,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form className="flex flex-col md:flex-row gap-4 md:items-end">
      <FormInput<ClassCriteriaDTO>
        name="className"
        placeholder="Nombre de clase"
        placeholderType="normal"
        className="mb-0"
        value={criteria.className?.text || ""}
        onChange={handleInputChange}
      />
      <FormInput<ClassCriteriaDTO>
        name="subject"
        placeholder="Materia"
        placeholderType="normal"
        className="mb-0"
        value={criteria.subject?.text || ""}
        onChange={handleInputChange}
      />
      <FormInput<ClassCriteriaDTO>
        name="section"
        placeholder="Sección"
        placeholderType="normal"
        className="mb-0"
        value={criteria.section?.text || ""}
        onChange={handleInputChange}
      />

      <FormSelect
        name="active"
        className="mb-0"
        options={[
          { label: "Activas", value: "true" },
          { label: "Archivadas", value: "false" },
        ]}
        value={String(criteria.active)}
        onChange={handleSelectChange}
      />

      {mode === "student" && (
        <FormSelect
          name="withStudentHidden"
          className="mb-0"
          options={[
            { label: "Visibles", value: "false" },
            { label: "Ocultas", value: "true" },
          ]}
          value={String(criteria.withStudent?.hidden)}
          onChange={handleSelectChange}
        />
      )}

      <button
        type="submit"
        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={handleSubmit}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          width="24"
          height="24"
        >
          <path
            d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  );
}
