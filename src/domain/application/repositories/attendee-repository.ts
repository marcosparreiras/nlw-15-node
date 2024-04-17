import { AttendeeEntity } from "../../enterprise/Entities/attendee-entity";

export interface AttendeeRepository {
  countByEventId(eventId: string): Promise<number>;
  create(attendee: AttendeeEntity): Promise<void>;
  findByEmailAndEventId(
    email: string,
    eventId: string
  ): Promise<AttendeeEntity | null>;
}
