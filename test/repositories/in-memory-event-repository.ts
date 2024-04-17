import { EventRepository } from "../../src/domain/application/repositories/event-repository";
import { EventEntity } from "../../src/domain/enterprise/Entities/event-entity";

export class InMemoryEventRepository implements EventRepository {
  public items: EventEntity[] = [];

  async findBySlug(slug: string): Promise<EventEntity | null> {
    const event = this.items.find((item) => item.slug.toString() === slug);
    return event ?? null;
  }

  async findById(id: string): Promise<EventEntity | null> {
    const event = this.items.find((item) => item.id.toString() === id);
    return event ?? null;
  }

  async create(event: EventEntity): Promise<void> {
    this.items.push(event);
  }
}
