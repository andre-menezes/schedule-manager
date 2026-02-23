export interface RequestPasswordResetInput {
  email: string;
}

export interface RequestPasswordResetOutput {
  message: string;
}

export interface ResetPasswordInput {
  email: string;
  code: string;
  newPassword: string;
}

export interface ResetPasswordOutput {
  message: string;
}
