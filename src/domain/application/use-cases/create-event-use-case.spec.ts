import { fakeEventFactory } from "../../../../test/factories/fake-event-factory";
import { InMemoryEventRepository } from "../../../../test/repositories/in-memory-event-repository";
import { EventAlreadyExistsError } from "../erros/event-already-exists-error";
import { CreateEventUseCase } from "./create-event-use-case";

describe("create-event [use-case]", () => {
  let eventRepository: InMemoryEventRepository;
  let sut: CreateEventUseCase;

  beforeEach(() => {
    eventRepository = new InMemoryEventRepository();
    sut = new CreateEventUseCase(eventRepository);
  });

  it("Should be able to create a new event", async () => {
    const result = await sut.execute({
      title: "My event",
      details: "Event Details",
      maximumAttendees: 5,
    });

    expect(result).toEqual(
      expect.objectContaining({
        event: expect.objectContaining({
          title: "My event",
          details: "Event Details",
          maximumAttendees: 5,
        }),
      })
    );

    expect(result.event.slug.toString()).toEqual("my-event");

    const eventInRepository = eventRepository.items.find((item) =>
      item.id.equals(result.event.id)
    );

    expect(eventInRepository).toBeTruthy();
  });

  it("Should not be able to create a event with same title", async () => {
    const event = fakeEventFactory();
    eventRepository.items.push(event);

    await expect(() =>
      sut.execute({
        title: event.title,
        details: "My event details",
        maximumAttendees: 10,
      })
    ).rejects.toBeInstanceOf(EventAlreadyExistsError);

    expect(eventRepository.items).toHaveLength(1);
  });
});
