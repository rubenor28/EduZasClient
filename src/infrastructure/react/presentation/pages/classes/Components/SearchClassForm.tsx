import { type ClassCriteriaDTO } from "@application";
import { FormInput, FormSelect } from "@components";

export function SearchClassForm() {
  return (
    <form
      className="flex flex-col md:flex-row gap-4 md:items-end"
      onSubmit={(e) => e.preventDefault()}
    >
      <FormInput<ClassCriteriaDTO>
        name="className"
        placeholder="Nombre de clase"
        placeholderType="normal"
        className="mb-0"
      />
      <FormInput<ClassCriteriaDTO>
        name="subject"
        placeholder="Materia"
        placeholderType="normal"
        className="mb-0"
      />
      <FormInput<ClassCriteriaDTO>
        name="section"
        placeholder="Sección"
        placeholderType="normal"
        className="mb-0"
      />

      <FormSelect
        className="mb-0"
        options={[
          { label: "Activas", value: "true" },
          { label: "Archivadas", value: "false" },
        ]}
      />

      <button className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
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
