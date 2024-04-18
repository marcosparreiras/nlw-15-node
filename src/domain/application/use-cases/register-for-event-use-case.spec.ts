import { fakeAttendeeFactory } from "../../../../test/factories/fake-attendee-factory";
import { fakeEventFactory } from "../../../../test/factories/fake-event-factory";
import { InMemoryAttendeeRepository } from "../../../../test/repositories/in-memory-attendee-repository";
import { InMemoryEventRepository } from "../../../../test/repositories/in-memory-event-repository";
import { EventAttendeeAlreadyExistsError } from "../erros/event-attendee-already-exists-error";
import { EventNotFoundError } from "../erros/event-not-found-error";
import { EventSoldOutError } from "../erros/event-sold-out-error";
import { RegisterForEventUseCase } from "./register-for-event-use-case";

describe("register-for-event [use-case]", () => {
  let eventRepository: InMemoryEventRepository;
  let attendeeRepository: InMemoryAttendeeRepository;
  let sut: RegisterForEventUseCase;

  beforeEach(() => {
    eventRepository = new InMemoryEventRepository();
    attendeeRepository = new InMemoryAttendeeRepository();
    sut = new RegisterForEventUseCase(eventRepository, attendeeRepository);
  });

  it("Should be able to register for an event", async () => {
    const event = fakeEventFactory();
    eventRepository.items.push(event);

    const result = await sut.execute({
      name: "john doe",
      email: "johndoe@example.com",
      eventId: event.id.toString(),
    });
    expect(result.attendee).toEqual(
      expect.objectContaining({
        name: "john doe",
        email: "johndoe@example.com",
      })
    );

    const attendeeInRepository = attendeeRepository.items.find((item) =>
      item.eventId.equals(event.id)
    );
    expect(attendeeInRepository).toBeTruthy();
  });

  it("Should not be able to register for an unexistent event", async () => {
    await expect(() =>
      sut.execute({
        name: "john doe",
        email: "johndoe@example.com",
        eventId: "some-nonexisten-event",
      })
    ).rejects.toBeInstanceOf(EventNotFoundError);
  });

  it("Should not be able to register for an sold out event", async () => {
    const event = fakeEventFactory({ maximumAttendees: 2 });
    const attendees = [
      fakeAttendeeFactory({ eventId: event.id }),
      fakeAttendeeFactory({ eventId: event.id }),
    ];
    eventRepository.items.push(event);
    attendeeRepository.items.push(...attendees);

    await expect(() =>
      sut.execute({
        name: "john doe",
        email: "johndoe@example.com",
        eventId: event.id.toString(),
      })
    ).rejects.toBeInstanceOf(EventSoldOutError);
  });

  it("Should not be able to register twice on the same event", async () => {
    const event = fakeEventFactory({ maximumAttendees: 2 });
    const attendee = fakeAttendeeFactory({ eventId: event.id });
    eventRepository.items.push(event);
    attendeeRepository.items.push(attendee);

    await expect(() =>
      sut.execute({
        name: "",
        email: attendee.email,
        eventId: event.id.toString(),
      })
    ).rejects.toBeInstanceOf(EventAttendeeAlreadyExistsError);
  });
});
