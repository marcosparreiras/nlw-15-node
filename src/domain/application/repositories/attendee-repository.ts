import { AttendeeEntity } from "../../enterprise/Entities/attendee-entity";
import { SearchProps } from "./search-props";

export interface AttendeeRepository {
  countByEventId(eventId: string): Promise<number>;
  create(attendee: AttendeeEntity): Promise<void>;
  findManyByEventId(
    eventId: string,
    search: SearchProps
  ): Promise<AttendeeEntity[]>;
  findByEmailAndEventId(
    email: string,
    eventId: string
  ): Promise<AttendeeEntity | null>;
}
