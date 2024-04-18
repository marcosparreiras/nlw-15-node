import { fakeAttendeeFactory } from "../../../../test/factories/fake-attendee-factory";
import { fakeEventFactory } from "../../../../test/factories/fake-event-factory";
import { InMemoryAttendeeRepository } from "../../../../test/repositories/in-memory-attendee-repository";
import { InMemoryEventRepository } from "../../../../test/repositories/in-memory-event-repository";
import { EventNotFoundError } from "../erros/event-not-found-error";
import { GetEventUseCase } from "./get-event-use-case";

describe("get-event [use-case]", () => {
  let eventRepository: InMemoryEventRepository;
  let attendeeRepository: InMemoryAttendeeRepository;
  let sut: GetEventUseCase;

  beforeEach(() => {
    eventRepository = new InMemoryEventRepository();
    attendeeRepository = new InMemoryAttendeeRepository();
    sut = new GetEventUseCase(eventRepository, attendeeRepository);
  });

  it("Should be able to get an event by id", async () => {
    const event = fakeEventFactory();
    const attendee = fakeAttendeeFactory({ eventId: event.id });

    eventRepository.items.push(event);
    attendeeRepository.items.push(attendee);

    const result = await sut.execute({ eventId: event.id.toString() });

    expect(result).toEqual(
      expect.objectContaining({
        event: expect.objectContaining({
          title: event.title,
          details: event.details,
          maximumAttendees: event.maximumAttendees,
        }),
        attendeesAmount: 1,
      })
    );
  });

  it("Should not be able to get an unexistent event", async () => {
    await expect(() => {
      return sut.execute({ eventId: "some-fake-id " });
    }).rejects.toBeInstanceOf(EventNotFoundError);
  });
});
