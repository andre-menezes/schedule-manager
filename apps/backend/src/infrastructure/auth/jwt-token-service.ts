import type { FastifyInstance } from 'fastify';
import type {
  TokenPayload,
  TokenService,
} from '../../application/services/token-service.js';

export class JwtTokenService implements TokenService {
  constructor(private readonly app: FastifyInstance) {}

  generate(payload: TokenPayload): string {
    return this.app.jwt.sign(payload);
  }

  verify(token: string): TokenPayload | null {
    try {
      return this.app.jwt.verify<TokenPayload>(token);
    } catch {
      return null;
    }
  }
}
