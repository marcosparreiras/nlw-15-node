import { AttendeeEntity } from "../../enterprise/Entities/attendee-entity";
import { AttendeeNotFoundError } from "../erros/attendee-not-found-error";
import { CheckInAlreadyExistsError } from "../erros/check-in-already-exists-error";
import { AttendeeRepository } from "../repositories/attendee-repository";

interface CheckInUseCaseRequest {
  attendeeId: string;
}

interface CheckInUseCaseResponse {
  attendee: AttendeeEntity;
}

export class CheckInUseCase {
  public constructor(private attendeRepository: AttendeeRepository) {}

  public async execute({
    attendeeId,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const attendee = await this.attendeRepository.findById(attendeeId);

    if (!attendee) {
      throw new AttendeeNotFoundError(attendeeId);
    }

    if (attendee.checkInAt) {
      throw new CheckInAlreadyExistsError(attendee.id.toString());
    }

    attendee.checkIn();

    await this.attendeRepository.save(attendee);

    return { attendee };
  }
}
