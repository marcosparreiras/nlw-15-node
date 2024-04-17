import { DomainError } from "./domain-error";

export class EventAlreadyExistsError extends DomainError {
  constructor(eventTitle: string) {
    super(`Event ${eventTitle} already exists`);
  }
}
