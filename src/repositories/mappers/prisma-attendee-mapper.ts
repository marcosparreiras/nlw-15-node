import { Attendee as PrismaAttendee } from "@prisma/client";
import { AttendeeEntity } from "../../domain/enterprise/Entities/attendee-entity";
import { UniqueEntityId } from "../../domain/enterprise/utils/unique-entity-id";

export class PrismaAttendeeMapper {
  public static toDomain(data: PrismaAttendee): AttendeeEntity {
    return AttendeeEntity.create(
      {
        email: data.email,
        eventId: new UniqueEntityId(data.eventId),
        name: data.name,
        checkInAt: data.checkInAt,
        createdAt: data.createdAt,
      },
      new UniqueEntityId(data.id)
    );
  }

  public static toPrisma(attendee: AttendeeEntity): PrismaAttendee {
    return {
      id: attendee.id.toString(),
      eventId: attendee.eventId.toString(),
      checkInAt: attendee.checkInAt,
      createdAt: attendee.createdAt,
      email: attendee.email,
      name: attendee.name,
    };
  }
}
