import { EventEntity } from "../domain/enterprise/Entities/event-entity";

export class EventPresenter {
  public static toHTTP(event: EventEntity, atteendessAmount: number) {
    return {
      id: event.id.toString(),
      title: event.title,
      details: event.details,
      slug: event.slug.toString(),
      maximumAttendees: event.maximumAttendees,
      atteendessAmount,
    };
  }
}
