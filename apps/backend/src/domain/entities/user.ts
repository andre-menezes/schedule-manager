export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  deactivatedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
  passwordHash: string;
}
