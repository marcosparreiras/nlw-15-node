import { AttendeeEntity } from "../../enterprise/Entities/attendee-entity";
import { UniqueEntityId } from "../../enterprise/utils/unique-entity-id";
import { EventAttendeeAlreadyExistsError } from "../erros/event-attendee-already-exists-error";
import { EventNotFoundError } from "../erros/event-not-found-error";
import { EventSoldOutError } from "../erros/event-sold-out-error";
import { AttendeeRepository } from "../repositories/attendee-repository";
import { EventRepository } from "../repositories/event-repository";

interface RegisterForEventUseCaseRequest {
  eventId: string;
  name: string;
  email: string;
}

interface RegisterForEventUseCaseResponse {
  attendee: AttendeeEntity;
}

export class RegisterForEventUseCase {
  public constructor(
    private eventRepository: EventRepository,
    private attendeeRepository: AttendeeRepository
  ) {}

  public async execute({
    eventId,
    name,
    email,
  }: RegisterForEventUseCaseRequest): Promise<RegisterForEventUseCaseResponse> {
    const event = await this.eventRepository.findById(eventId);

    if (!event) {
      throw new EventNotFoundError(eventId);
    }

    if (event.maximumAttendees) {
      const eventAttendeeAmount = await this.attendeeRepository.countByEventId(
        eventId
      );

      if (event.maximumAttendees >= eventAttendeeAmount) {
        throw new EventSoldOutError(event.title);
      }
    }

    const attendeeAlreadyExists =
      await this.attendeeRepository.findByEmailAndEventId(email, eventId);

    if (attendeeAlreadyExists) {
      throw new EventAttendeeAlreadyExistsError(attendeeAlreadyExists.email);
    }

    const attendee = AttendeeEntity.create({
      eventId: new UniqueEntityId(eventId),
      name,
      email,
    });

    await this.attendeeRepository.create(attendee);

    return { attendee };
  }
}
