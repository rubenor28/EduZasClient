type FieldWrapperProps = {
  children: React.ReactNode;
  alert?: React.ReactNode;
};

export function FieldWrapper({ alert, children }: FieldWrapperProps) {
  return (
    <div className="mb-4">
      <div className="min-h-[1.25rem] mb-1">
        {alert}
      </div>
      {children}
    </div>
  );
}
