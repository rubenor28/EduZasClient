import { Result } from "ts-results";
import { Repository } from "../../common/repositories";
import { NewUser, User, UserCriteria, UserUpdate } from "../entities";

export interface UserRepository
  extends Repository<number, User, NewUser, UserUpdate, UserCriteria> {
  emailIsRegistered(email: string): Promise<boolean>;
  getPasswordHash(email: string): Promise<Result<string, void>>;
  findByTuition(tuition: string): Promise<User | undefined>;
}
