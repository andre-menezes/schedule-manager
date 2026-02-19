export interface SendPasswordResetEmailInput {
  to: string;
  code: string;
}

export interface EmailService {
  sendPasswordResetEmail(input: SendPasswordResetEmailInput): Promise<void>;
}
