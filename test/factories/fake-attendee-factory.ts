import { faker } from "@faker-js/faker";
import {
  AttendeeEntity,
  AttendeeEntityProps,
} from "../../src/domain/enterprise/Entities/attendee-entity";
import { UniqueEntityId } from "../../src/domain/enterprise/utils/unique-entity-id";

export function fakeAttendeeFactory(
  overide: Partial<AttendeeEntityProps> = {},
  id?: UniqueEntityId
): AttendeeEntity {
  return AttendeeEntity.create(
    {
      email: faker.internet.email(),
      name: faker.internet.userName(),
      eventId: new UniqueEntityId(),
      ...overide,
    },
    id
  );
}
