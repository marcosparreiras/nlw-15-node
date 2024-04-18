import { AttendeeEntity } from "../../enterprise/Entities/attendee-entity";
import { EventNotFoundError } from "../erros/event-not-found-error";
import { AttendeeRepository } from "../repositories/attendee-repository";
import { EventRepository } from "../repositories/event-repository";

interface FetchEventAttendeesUseCaseRequest {
  eventId: string;
  page: number;
  query?: string | null;
}

interface FetchEventAttendeesUseCaseResponse {
  attendees: AttendeeEntity[];
}

export class FetchEventAttendeesUseCase {
  public constructor(
    private eventRepository: EventRepository,
    private attendeeRepository: AttendeeRepository
  ) {}

  public async execute({
    eventId,
    page,
    query,
  }: FetchEventAttendeesUseCaseRequest): Promise<FetchEventAttendeesUseCaseResponse> {
    const event = await this.eventRepository.findById(eventId);

    if (!event) {
      throw new EventNotFoundError(eventId);
    }

    const attendees = await this.attendeeRepository.findManyByEventId(eventId, {
      page,
      query,
    });

    return { attendees };
  }
}
