import { DomainError } from "./domain-error";

export class EventAttendeeAlreadyExistsError extends DomainError {
  constructor(attendee: string) {
    super(`Attendee ${attendee} already exists on this event`);
  }
}
