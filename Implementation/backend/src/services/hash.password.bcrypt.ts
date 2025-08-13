import {genSalt, hash, compare} from 'bcryptjs';
import {injectable} from '@loopback/core';

export interface PasswordHasher {
  hashPassword(password: string): Promise<string>;
  comparePassword(providedPass: string, storedPass: string): Promise<boolean>;
}

@injectable()
export class BcryptHasher implements PasswordHasher {
  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt();
    return hash(password, salt);
    //return password;
  }

  async comparePassword(
    providedPass: string,
    storedPass: string,
  ): Promise<boolean> {
    return compare(providedPass, storedPass);
  }
}
