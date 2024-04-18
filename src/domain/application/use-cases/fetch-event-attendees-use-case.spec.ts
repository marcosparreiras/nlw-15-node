import { fakeAttendeeFactory } from "../../../../test/factories/fake-attendee-factory";
import { fakeEventFactory } from "../../../../test/factories/fake-event-factory";
import { InMemoryAttendeeRepository } from "../../../../test/repositories/in-memory-attendee-repository";
import { InMemoryEventRepository } from "../../../../test/repositories/in-memory-event-repository";
import { AttendeeEntity } from "../../enterprise/Entities/attendee-entity";
import { EventNotFoundError } from "../erros/event-not-found-error";
import { FetchEventAttendeesUseCase } from "./fetch-event-attendees-use-case";

describe("fetch-event-attendees [use-case]", () => {
  let eventRepository: InMemoryEventRepository;
  let attendeeRepository: InMemoryAttendeeRepository;
  let sut: FetchEventAttendeesUseCase;

  beforeEach(() => {
    eventRepository = new InMemoryEventRepository();
    attendeeRepository = new InMemoryAttendeeRepository();
    sut = new FetchEventAttendeesUseCase(eventRepository, attendeeRepository);
  });

  it("Should be able to fetch event attendees", async () => {
    const event = fakeEventFactory();
    const event2 = fakeEventFactory();

    const attendees = [
      fakeAttendeeFactory({ eventId: event.id }),
      fakeAttendeeFactory({ eventId: event.id }),
      fakeAttendeeFactory({ eventId: event.id }),
      fakeAttendeeFactory({ eventId: event2.id }),
      fakeAttendeeFactory({ eventId: event2.id }),
    ];
    eventRepository.items.push(event);
    attendeeRepository.items.push(...attendees);

    const result = await sut.execute({ eventId: event.id.toString(), page: 1 });

    expect(result.attendees).toHaveLength(3);
  });

  it("Should be able to paginate the attendees results", async () => {
    const event = fakeEventFactory();

    const attendees: AttendeeEntity[] = [];

    for (let i = 1; i <= 22; i++) {
      attendees.push(fakeAttendeeFactory({ eventId: event.id }));
    }

    eventRepository.items.push(event);
    attendeeRepository.items.push(...attendees);

    const page1 = await sut.execute({ eventId: event.id.toString(), page: 1 });
    const page2 = await sut.execute({ eventId: event.id.toString(), page: 2 });
    const page3 = await sut.execute({ eventId: event.id.toString(), page: 3 });

    expect(page1.attendees).toHaveLength(10);
    expect(page2.attendees).toHaveLength(10);
    expect(page3.attendees).toHaveLength(2);
  });

  it("Should be able to query the attendees results by attendee name", async () => {
    const event = fakeEventFactory();
    const attendees = [
      fakeAttendeeFactory({ eventId: event.id, name: "john doe" }),
      fakeAttendeeFactory({ eventId: event.id, name: "albert john brown" }),
      fakeAttendeeFactory({ eventId: event.id, name: "dora viss" }),
    ];
    eventRepository.items.push(event);
    attendeeRepository.items.push(...attendees);

    const result = await sut.execute({
      eventId: event.id.toString(),
      page: 1,
      query: "john",
    });

    expect(result.attendees).toHaveLength(2);

    expect(result.attendees).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "john doe" }),
        expect.objectContaining({ name: "albert john brown" }),
      ])
    );
  });

  it("Should not be able to fetch attendees from an unexistent event", async () => {
    await expect(() =>
      sut.execute({ eventId: "some-unexistent-event-id", page: 1 })
    ).rejects.toBeInstanceOf(EventNotFoundError);
  });
});
