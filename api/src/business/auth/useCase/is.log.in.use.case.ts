import { JWT_SECRET } from "config";
import { SignedTokenService } from "../services";
import { UseCase } from "business/common/useCases";
import { PublicUser } from "persistence/users/entities";
import { Result } from "persistence/common/valueObjects";
import { SignedTokenErrors } from "persistence/common/enums";
import { ObjectTypeValidator } from "business/common/validators";

/**
 * Entrada para el caso de uso `isLoginUseCase`.
 *
 * @property token - Cadena JWT recibida del cliente.
 * @property tokenService - Servicio responsable de verificar y decodificar el token firmado.
 */
type IsLoginInput = {
  token: string;
  tokenService: SignedTokenService;
  publicUserValidator: ObjectTypeValidator<PublicUser>;
};

/**
 * Salida para el caso de uso `isLoginUseCase`.
 *
 * Representa el resultado de la validación:
 * - `PublicUser` en caso de éxito.
 * - {@link SignedTokenErrors} en caso de error (token inválido, expirado, etc.).
 */
type IsLoginOutput = Result<PublicUser, SignedTokenErrors>;

/**
 * Caso de uso que valida si un token JWT recibido corresponde
 * a un inicio de sesión válido.
 *
 * Implementa la interfaz {@link UseCase}, parametrizada con:
 * - `IsLoginInput`: datos necesarios para la ejecución.
 * - `IsLoginOutput`: resultado esperado de la operación.
 */
export const isLoginUseCase: UseCase<IsLoginInput, IsLoginOutput> = {
  execute({ tokenService, token, publicUserValidator }) {
    return tokenService.isValid(token, JWT_SECRET, publicUserValidator);
  },
};
