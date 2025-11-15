// Función genérica para mapear strings a valores de enum
export function mapStringToEnum<T extends string>(
  value: string,
  enumObj: Record<string, T>,
): T {
  if (Object.values(enumObj).includes(value as T)) {
    return value as T;
  }

  throw new Error(`Invalid enum value: ${value}`);
}
