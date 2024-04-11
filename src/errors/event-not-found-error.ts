import { DomainError } from "./domain-error";

export class EventNotFoundError extends DomainError {
  constructor(event: string) {
    super(`Event ${event} not found`);
  }
}
