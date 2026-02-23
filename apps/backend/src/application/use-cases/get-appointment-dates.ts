import type { AppointmentRepository } from '../../domain/repositories/appointment-repository.js';

export class GetAppointmentDates {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  async execute(userId: string, month: string): Promise<string[]> {
    const parts = month.split('-');
    const year = Number(parts[0]);
    const monthNum = Number(parts[1]);
    const startDate = new Date(Date.UTC(year, monthNum - 1, 1));
    const endDate = new Date(Date.UTC(year, monthNum, 0, 23, 59, 59, 999));

    const appointments = await this.appointmentRepository.findAllByUserIdAndDateRange(
      userId,
      startDate,
      endDate
    );

    const uniqueDates = new Set<string>();
    for (const a of appointments) {
      const dateStr = a.startAt.toISOString().split('T')[0];
      if (dateStr) uniqueDates.add(dateStr);
    }

    return [...uniqueDates].sort();
  }
}
