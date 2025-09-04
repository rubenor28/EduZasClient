import jwt from "jsonwebtoken";
import { ObjectTypeValidator } from "business/common/validators";
import { Result, Ok, Err } from "persistence/common/valueObjects";
import {
  SignedTokenService,
  SignedTokenExpirationTime,
  SignedTokenErrors,
} from "./signed.token.service";

export const jwtService: SignedTokenService = {
  generate<T extends Record<string, unknown>>(
    secret: string,
    expiresIn: SignedTokenExpirationTime,
    payload: T,
  ): string {
    return jwt.sign(payload, secret, { expiresIn });
  },

  isValid<T extends Record<string, unknown>>(
    token: string,
    secret: string,
    validator: ObjectTypeValidator<T>,
  ): Result<T, SignedTokenErrors> {
    try {
      const decoded = jwt.verify(token, secret);

      const validation = validator.validate(decoded);

      if (!validation.success) {
        return Err(SignedTokenErrors.TokenInvalid);
      }

      return Ok(validation.value);
    } catch (error) {
      return Err(mapJwtError(error));
    }
  },
};

const mapJwtError = (error: unknown): SignedTokenErrors => {
  if (error instanceof jwt.JsonWebTokenError)
    return SignedTokenErrors.TokenInvalid;

  if (error instanceof jwt.TokenExpiredError)
    return SignedTokenErrors.TokenExpired;

  if (error instanceof jwt.NotBeforeError)
    return SignedTokenErrors.TokenInvalid;

  return SignedTokenErrors.Unknown;
};
