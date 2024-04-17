import { EventEntity } from "../../enterprise/Entities/event-entity";

export interface EventRepository {
  findBySlug(slug: string): Promise<EventEntity | null>;
  findById(id: string): Promise<EventEntity | null>;
  create(event: EventEntity): Promise<void>;
}
