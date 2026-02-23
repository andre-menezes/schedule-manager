import type { CreateUserInput, User } from '../entities/user.js';

export interface UserRepository {
  create(data: CreateUserInput): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  updatePassword(id: string, passwordHash: string): Promise<void>;
  deactivate(id: string): Promise<void>;
  reactivate(id: string): Promise<void>;
}
