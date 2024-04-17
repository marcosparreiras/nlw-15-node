import {
  EventEntity,
  EventEntityProps,
} from "../../src/domain/enterprise/Entities/event-entity";
import { UniqueEntityId } from "../../src/domain/enterprise/utils/unique-entity-id";
import { faker } from "@faker-js/faker";
import { Slug } from "../../src/domain/enterprise/value-objects/slug";

export function fakeEventFactory(
  overide: Partial<EventEntityProps> = {},
  id?: UniqueEntityId
): EventEntity {
  const title = faker.lorem.sentence();

  return EventEntity.create(
    {
      title,
      details: faker.lorem.paragraph(),
      maximumAttendees: null,
      slug: Slug.fromPlainText(title),
      ...overide,
    },
    id
  );
}
