import "./Dialog.css";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({
  open,
  onClose,
  children,
  className = "",
}: DialogProps) {
  if (!open) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div
        className={`dialog-content ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="dialog-close" onClick={onClose}>
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
