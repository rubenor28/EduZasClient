export const AlertType = {
  SUCCESS: "success",
  DANGER: "error",
  WARNING: "warning",
  INFO: "info",
} as const;

export type AlertType = (typeof AlertType)[keyof typeof AlertType];
