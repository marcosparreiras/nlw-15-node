import { DomainError } from "./domain-error";

export class EventAttendeeAlreadyExistsError extends DomainError {
  constructor(attendee: string) {
    super(`Attendee ${attendee} alrady exists on this event`);
  }
}
