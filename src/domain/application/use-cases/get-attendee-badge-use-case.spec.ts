import { fakeAttendeeFactory } from "../../../../test/factories/fake-attendee-factory";
import { InMemoryAttendeeRepository } from "../../../../test/repositories/in-memory-attendee-repository";
import { AttendeeNotFoundError } from "../erros/attendee-not-found-error";
import { GetAttendeeBadgeUseCase } from "./get-attendee-badge-use-case";

describe("get-attendee-badge [use-case]", () => {
  let attendeeRepository: InMemoryAttendeeRepository;
  let sut: GetAttendeeBadgeUseCase;

  beforeEach(() => {
    attendeeRepository = new InMemoryAttendeeRepository();
    sut = new GetAttendeeBadgeUseCase(attendeeRepository);
  });

  it("Should be able to get attendee badge", async () => {
    const attendee = fakeAttendeeFactory();
    attendeeRepository.items.push(attendee);

    const result = await sut.execute({ attendeeId: attendee.id.toString() });

    expect(result.attendee).toEqual(
      expect.objectContaining({
        name: attendee.name,
        email: attendee.email,
      })
    );
  });

  it("Should not be able to get an unexistent attendee", async () => {
    await expect(() =>
      sut.execute({ attendeeId: "some-unexistent-attendee-id" })
    ).rejects.toBeInstanceOf(AttendeeNotFoundError);
  });
});
