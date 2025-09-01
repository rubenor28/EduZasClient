export const RegisterState = {
  IDLE: "idle",
  SUCCESS: "success",
  INPUT_ERROR: "input_error",
  UNEXPECTED_ERROR: "unexpected_error",
} as const;

export type RegisterState = (typeof RegisterState)[keyof typeof RegisterState];
