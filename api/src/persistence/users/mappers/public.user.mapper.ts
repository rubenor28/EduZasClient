import { PublicUser, User } from "../entities";

export const userToPublicUser = (user: User): PublicUser => ({
  id: user.id,
  email: user.email,
  fatherLastname: user.fatherLastname,
  firstName: user.firstName,
  tuition: user.tuition,
  gender: user.gender,
  midName: user.midName,
  motherLastname: user.motherLastname,
});
