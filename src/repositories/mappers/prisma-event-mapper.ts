import { Event as PrismaEvent } from "@prisma/client";
import { EventEntity } from "../../domain/enterprise/Entities/event-entity";
import { UniqueEntityId } from "../../domain/enterprise/utils/unique-entity-id";
import { Slug } from "../../domain/enterprise/value-objects/slug";

export class PrismaEventMapper {
  public static toDomain(data: PrismaEvent): EventEntity {
    return EventEntity.create(
      {
        title: data.title,
        details: data.details,
        maximumAttendees: data.maximumAttendees,
        slug: Slug.fromPlainText(data.slug),
      },
      new UniqueEntityId(data.id)
    );
  }

  public static toPrisma(event: EventEntity): PrismaEvent {
    return {
      id: event.id.toString(),
      details: event.details,
      title: event.title,
      maximumAttendees: event.maximumAttendees,
      slug: event.slug.toString(),
    };
  }
}
