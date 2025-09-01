import type { AlertType } from "./AlertType";
import "./Alert.css"


export interface AlertProps {
  message: string;
  type: AlertType;
}

export function Alert({ type, message }: AlertProps) {
  return (
    <div
      className={`alert-block alert-${type.toLowerCase()}`}
    >
      {message}
    </div>
  );
}
