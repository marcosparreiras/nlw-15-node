import { AttendeeRepository } from "../domain/application/repositories/attendee-repository";
import { SearchProps } from "../domain/application/repositories/search-props";
import { AttendeeEntity } from "../domain/enterprise/Entities/attendee-entity";
import { PrismaAttendeeMapper } from "./mappers/prisma-attendee-mapper";
import { prisma } from "./prisma";

export class PrismaAttendeeRepository implements AttendeeRepository {
  public async countByEventId(eventId: string): Promise<number> {
    const attendeeCount = await prisma.attendee.count({ where: { eventId } });
    return attendeeCount;
  }

  public async create(attendee: AttendeeEntity): Promise<void> {
    const data = PrismaAttendeeMapper.toPrisma(attendee);
    await prisma.attendee.create({ data });
  }

  public async save(attendee: AttendeeEntity): Promise<void> {
    const data = PrismaAttendeeMapper.toPrisma(attendee);
    await prisma.attendee.update({ where: { id: data.id }, data });
  }

  public async findById(attendeeId: string): Promise<AttendeeEntity | null> {
    const data = await prisma.attendee.findUnique({
      where: { id: attendeeId },
    });
    if (!data) {
      return null;
    }
    return PrismaAttendeeMapper.toDomain(data);
  }

  public async findManyByEventId(
    eventId: string,
    search: SearchProps
  ): Promise<AttendeeEntity[]> {
    const data = await prisma.attendee.findMany({ where: { eventId } });
    return data.map(PrismaAttendeeMapper.toDomain);
  }

  public async findByEmailAndEventId(
    email: string,
    eventId: string
  ): Promise<AttendeeEntity | null> {
    const data = await prisma.attendee.findUnique({
      where: { email_eventId: { email, eventId } },
    });
    if (!data) {
      return null;
    }
    return PrismaAttendeeMapper.toDomain(data);
  }
}
