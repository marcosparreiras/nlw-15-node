export class EventAttendeeAlreadyExistsError extends Error {
  constructor(attendee: string) {
    super(`Attendee ${attendee} alrady exists on this event`);
  }
}
