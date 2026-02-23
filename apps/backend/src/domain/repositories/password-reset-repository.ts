export interface PasswordResetToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
}

export interface CreatePasswordResetTokenInput {
  userId: string;
  token: string;
  expiresAt: Date;
}

export interface PasswordResetRepository {
  create(data: CreatePasswordResetTokenInput): Promise<PasswordResetToken>;
  findByToken(token: string): Promise<PasswordResetToken | null>;
  markAsUsed(id: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
}
