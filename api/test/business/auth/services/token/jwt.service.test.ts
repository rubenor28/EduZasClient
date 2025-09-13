import { jwtService } from "business/auth/services";
import { PublicUser } from "persistence/users/entities";
import { SignedTokenExpirationTime } from "persistence/common/enums";
import { publicUserTypeZodValidator } from "business/users/validators/zod/public.user.type.zod.validator";

describe("Test servicio JWT", () => {
  const expiresIn = SignedTokenExpirationTime.Minutes15;
  const validator = publicUserTypeZodValidator;
  const service = jwtService;
  const secret = "1234";

  const payload: PublicUser = {
    id: 1,
    email: "test@test.com",
    firstName: "Test",
    fatherLastname: "Test",
    tuition: "1",
  };

  test("Crear token", () => {
    service.generate(secret, expiresIn, payload);
  });

  test("Decodificar token valido", () => {
    const token = service.generate(secret, expiresIn, payload);
    const validation = service.isValid(token, secret, validator);

    expect(validation.ok).toBe(true);
    expect(validation.val).toEqual(payload);
  });

  test("Decodificar token invalido", () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJvbWFyLnJvbWFuLjI4MjhAZ21haWwuY29tIiwiZmF0aGVyTGFzdG5hbWUiOiJST03DgU4iLCJmaXJzdE5hbWUiOiJSVULDiU4iLCJ0dWl0aW9uIjoiUlNSTzIyMDIzMCIsImlhdCI6MTc1Nzc4Mjg5OSwiZXhwIjoxNzU3ODY5Mjk5fQ.1plDut6XMrfGoiEfm0iXLAyOYiCj8GwtE6gg9GVML3U";
    const validation = service.isValid(token, secret, validator);

    expect(validation.ok).toBe(false);
  });
});
