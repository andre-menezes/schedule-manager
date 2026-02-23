export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'DomainError';
  }
}

export class EmailAlreadyExistsError extends DomainError {
  constructor() {
    super('Email already registered', 'EMAIL_ALREADY_EXISTS');
  }
}

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super('Invalid email or password', 'INVALID_CREDENTIALS');
  }
}

export class UserNotFoundError extends DomainError {
  constructor() {
    super('User not found', 'USER_NOT_FOUND');
  }
}

export class PatientNotFoundError extends DomainError {
  constructor() {
    super('Patient not found', 'PATIENT_NOT_FOUND');
  }
}

export class AppointmentNotFoundError extends DomainError {
  constructor() {
    super('Appointment not found', 'APPOINTMENT_NOT_FOUND');
  }
}

export class AppointmentConflictError extends DomainError {
  constructor() {
    super('Time slot conflicts with an existing appointment', 'APPOINTMENT_CONFLICT');
  }
}

export class InvalidAppointmentTimeError extends DomainError {
  constructor() {
    super('Start time must be before end time', 'INVALID_APPOINTMENT_TIME');
  }
}

export class AppointmentNotEditableError extends DomainError {
  constructor() {
    super('Completed appointments cannot be edited', 'APPOINTMENT_NOT_EDITABLE');
  }
}

export class AccessDeniedError extends DomainError {
  constructor() {
    super('Access denied', 'ACCESS_DENIED');
  }
}

export class InvalidResetTokenError extends DomainError {
  constructor() {
    super('Invalid reset token', 'INVALID_RESET_TOKEN');
  }
}

export class ResetTokenExpiredError extends DomainError {
  constructor() {
    super('Reset token has expired', 'RESET_TOKEN_EXPIRED');
  }
}

export class CannotDeactivateAdminError extends DomainError {
  constructor() {
    super('Cannot deactivate admin user', 'CANNOT_DEACTIVATE_ADMIN');
  }
}

export class UserDeactivatedError extends DomainError {
  constructor() {
    super('User account has been deactivated', 'USER_DEACTIVATED');
  }
}

export class PastAppointmentError extends DomainError {
  constructor() {
    super('Cannot schedule appointments in the past', 'PAST_APPOINTMENT');
  }
}
