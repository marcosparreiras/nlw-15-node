import { EventEntity } from "../../enterprise/Entities/event-entity";
import { EventNotFoundError } from "../erros/event-not-found-error";
import { AttendeeRepository } from "../repositories/attendee-repository";
import { EventRepository } from "../repositories/event-repository";

interface GetEventUseCaseRequest {
  eventId: string;
}

interface GetEventUseCaseResponse {
  event: EventEntity;
  attendeesAmount: number;
}

export class GetEventUseCase {
  public constructor(
    private eventRepository: EventRepository,
    private attendeeRepository: AttendeeRepository
  ) {}

  public async execute({
    eventId,
  }: GetEventUseCaseRequest): Promise<GetEventUseCaseResponse> {
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new EventNotFoundError(eventId);
    }
    const attendeesAmount = await this.attendeeRepository.countByEventId(
      eventId
    );
    return { event, attendeesAmount };
  }
}
