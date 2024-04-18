import { EventRepository } from "../domain/application/repositories/event-repository";
import { EventEntity } from "../domain/enterprise/Entities/event-entity";
import { prisma } from "./prisma";
import { PrismaEventMapper } from "./mappers/prisma-event-mapper";

export class PrismaEventRepository implements EventRepository {
  public async findBySlug(slug: string): Promise<EventEntity | null> {
    const data = await prisma.event.findUnique({ where: { slug } });
    if (!data) {
      return null;
    }
    return PrismaEventMapper.toDomain(data);
  }

  public async findById(id: string): Promise<EventEntity | null> {
    const data = await prisma.event.findUnique({ where: { id } });
    if (!data) {
      return null;
    }
    return PrismaEventMapper.toDomain(data);
  }

  public async create(event: EventEntity): Promise<void> {
    const data = PrismaEventMapper.toPrisma(event);
    await prisma.event.create({ data });
  }
}
