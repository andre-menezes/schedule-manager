import type { PrismaClient } from '@prisma/client';
import type {
  AuditLogInput,
  AuditService,
} from '../../application/services/audit-service.js';

export class PrismaAuditService implements AuditService {
  constructor(private readonly prisma: PrismaClient) {}

  async log(input: AuditLogInput): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        userId: input.userId,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        details: input.details as any,
      },
    });
  }
}
