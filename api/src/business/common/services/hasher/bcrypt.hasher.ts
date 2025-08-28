import bcrypt from "bcrypt";
import { Hasher } from "./hasher";
import { SALT_OR_ROUNDS } from "config";

export const bcryptHasher: Hasher = {
  hash(input) {
    return bcrypt.hashSync(input, SALT_OR_ROUNDS);
  },

  matches(input, hash) {
    return bcrypt.compareSync(input, hash);
  },
};
