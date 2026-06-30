import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';
@Injectable()
export class BcryptProvider implements HashingProvider {
  public async hashPassword(password: string): Promise<string> {
    // Generate salt
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const salt: unknown = await bcrypt.genSalt(10);
    //Hash a password
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return await bcrypt.hash(password, salt);
  }

  public async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
