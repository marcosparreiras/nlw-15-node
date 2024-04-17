import { EventEntity } from "../../enterprise/Entities/event-entity";
import { Slug } from "../../enterprise/value-objects/slug";
import { EventAlreadyExistsError } from "../erros/event-already-exists-error";
import { EventRepository } from "../repositories/event-repository";

interface CreateEventUseCaseRequest {
  title: string;
  details: string;
  maximumAttendees: number;
}

interface CreateEventUseCaseResponse {
  event: EventEntity;
}

export class CreateEventUseCase {
  public constructor(private eventRepository: EventRepository) {}

  public async execute({
    title,
    details,
    maximumAttendees,
  }: CreateEventUseCaseRequest): Promise<CreateEventUseCaseResponse> {
    const slug = Slug.fromPlainText(title);

    const eventAlreadyExists = await this.eventRepository.findBySlug(
      slug.toString()
    );
    if (eventAlreadyExists) {
      throw new EventAlreadyExistsError(title);
    }

    const event = EventEntity.create({
      title,
      details,
      maximumAttendees,
      slug,
    });
    await this.eventRepository.create(event);

    return { event };
  }
}
