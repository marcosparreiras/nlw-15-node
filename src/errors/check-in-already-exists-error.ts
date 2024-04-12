import { DomainError } from "./domain-error";

export class CheckInAlreadyExistsError extends DomainError {
  constructor(attendee: string) {
    super(`Attendee ${attendee} already checked in`);
  }
}
