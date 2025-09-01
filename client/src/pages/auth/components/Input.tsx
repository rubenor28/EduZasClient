type RegisterInputProps = {
  type?: string;
  placeholder: string;
  required?: true;
  name: string;
};

export function RegisterInput({
  type,
  placeholder,
  name,
  required,
}: RegisterInputProps) {
  return (
    <input
      type={type ?? "text"}
      name={name}
      placeholder={placeholder}
      className="input-base"
      required={required ?? false}
    />
  );
}
