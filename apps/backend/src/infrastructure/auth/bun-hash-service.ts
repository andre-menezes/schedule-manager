import type { HashService } from '../../application/services/hash-service.js';

export class BunHashService implements HashService {
  async hash(password: string): Promise<string> {
    return Bun.password.hash(password, {
      algorithm: 'bcrypt',
      cost: 10,
    });
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return Bun.password.verify(password, hash);
  }
}
