export interface AttendeeRepository {
  countByEventId(eventId: string): Promise<number>;
}
