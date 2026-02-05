export interface AuditLogInput {
  userId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: 'PATIENT' | 'APPOINTMENT' | 'USER';
  entityId: string;
  details?: Record<string, unknown>;
}

export interface AuditService {
  log(input: AuditLogInput): Promise<void>;
}
