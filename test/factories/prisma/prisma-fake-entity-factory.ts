import { PrismaClient } from "@prisma/client";
import {
  EventEntity,
  EventEntityProps,
} from "../../../src/domain/enterprise/Entities/event-entity";
import { UniqueEntityId } from "../../../src/domain/enterprise/utils/unique-entity-id";
import { fakeEventFactory } from "../fake-event-factory";
import { PrismaEventMapper } from "../../../src/repositories/mappers/prisma-event-mapper";
import {
  AttendeeEntity,
  AttendeeEntityProps,
} from "../../../src/domain/enterprise/Entities/attendee-entity";
import { fakeAttendeeFactory } from "../fake-attendee-factory";
import { PrismaAttendeeMapper } from "../../../src/repositories/mappers/prisma-attendee-mapper";
import { DefaultArgs } from "@prisma/client/runtime/library";

export class PrismaFakeEntityFactory {
  public prisma: PrismaClient<never, DefaultArgs>;

  public constructor() {
    this.prisma = new PrismaClient();
  }

  public async makeEvent(
    overide: Partial<EventEntityProps> = {},
    id?: UniqueEntityId
  ): Promise<EventEntity> {
    const event = fakeEventFactory(overide, id);
    const data = PrismaEventMapper.toPrisma(event);
    await this.prisma.event.create({ data });
    return event;
  }

  public async makeAttendee(
    overide: Partial<AttendeeEntityProps> = {},
    id?: UniqueEntityId
  ): Promise<AttendeeEntity> {
    const attendee = fakeAttendeeFactory(overide, id);
    const data = PrismaAttendeeMapper.toPrisma(attendee);
    await this.prisma.attendee.create({ data });
    return attendee;
  }

  public async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}
