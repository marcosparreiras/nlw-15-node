import { DomainError } from "./domain-error";

export class EventSoldOutError extends DomainError {
  constructor(event: string) {
    super(`Could not register, event ${event} is sold out`);
  }
}
