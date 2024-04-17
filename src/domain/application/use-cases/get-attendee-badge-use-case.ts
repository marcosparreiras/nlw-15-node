import { AttendeeEntity } from "../../enterprise/Entities/attendee-entity";
import { AttendeeNotFoundError } from "../erros/attendee-not-found-error";
import { AttendeeRepository } from "../repositories/attendee-repository";

interface GetAttendeeBadgeUseCaseRequest {
  attendeeId: string;
}

interface GetAttendeeBadgeUseCaseResponse {
  attendee: AttendeeEntity;
}

export class GetAttendeeBadgeUseCase {
  public constructor(private attendeeRepository: AttendeeRepository) {}

  public async execute({
    attendeeId,
  }: GetAttendeeBadgeUseCaseRequest): Promise<GetAttendeeBadgeUseCaseResponse> {
    const attendee = await this.attendeeRepository.findById(attendeeId);

    if (!attendee) {
      throw new AttendeeNotFoundError(attendeeId);
    }

    return { attendee };
  }
}
