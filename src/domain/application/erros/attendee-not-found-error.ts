import { DomainError } from "./domain-error";

export class AttendeeNotFoundError extends DomainError {
  constructor(attendee: string) {
    super(`Atteendee ${attendee} not found`);
  }
}
