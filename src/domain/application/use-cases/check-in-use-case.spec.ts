import { fakeAttendeeFactory } from "../../../../test/factories/fake-attendee-factory";
import { InMemoryAttendeeRepository } from "../../../../test/repositories/in-memory-attendee-repository";
import { CheckInAlreadyExistsError } from "../erros/check-in-already-exists-error";
import { CheckInUseCase } from "./check-in-use-case";

describe("check-in [use-case]", () => {
  let attendeeRepository: InMemoryAttendeeRepository;
  let sut: CheckInUseCase;

  beforeEach(() => {
    attendeeRepository = new InMemoryAttendeeRepository();
    sut = new CheckInUseCase(attendeeRepository);
  });

  it("Should be able to check-in an attendee", async () => {
    const attendee = fakeAttendeeFactory({ checkInAt: null });
    attendeeRepository.items.push(attendee);

    await sut.execute({ attendeeId: attendee.id.toString() });

    expect(attendee.checkIn).toBeTruthy();
  });

  it("Should not be able to check-in an attendee twice", async () => {
    const attendee = fakeAttendeeFactory({ checkInAt: new Date() });
    attendeeRepository.items.push(attendee);

    await expect(() =>
      sut.execute({ attendeeId: attendee.id.toString() })
    ).rejects.toBeInstanceOf(CheckInAlreadyExistsError);
  });
});
