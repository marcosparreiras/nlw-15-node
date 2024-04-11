export class EventAlreadyExistsError extends Error {
  constructor(eventTitle: string) {
    super(`Event ${eventTitle} already exists`);
  }
}
