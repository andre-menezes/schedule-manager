export interface TokenPayload {
  userId: string;
}

export interface TokenService {
  generate(payload: TokenPayload): string;
  verify(token: string): TokenPayload | null;
}
