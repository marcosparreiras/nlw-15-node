import { Entity } from "../utils/entity";
import { UniqueEntityId } from "../utils/unique-entity-id";
import { Slug } from "../value-objects/slug";

interface EventEntityProps {
  title: string;
  details: string;
  slug: Slug;
  maximumAttendees: number | null;
}

export class EventEntity extends Entity<EventEntityProps> {
  public get title(): string {
    return this.props.title;
  }

  public get details(): string {
    return this.props.details;
  }

  public get slug(): Slug {
    return this.props.slug;
  }

  public get maximumAttendees(): number | null {
    return this.props.maximumAttendees;
  }

  public static create(
    props: EventEntityProps,
    id?: UniqueEntityId
  ): EventEntity {
    return new EventEntity(
      {
        title: props.title,
        details: props.details,
        slug: props.slug,
        maximumAttendees: props.maximumAttendees,
      },
      id
    );
  }
}
