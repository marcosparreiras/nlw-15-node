import { Entity } from "./utils/entity";
import { Optional } from "./utils/optional";
import { UniqueEntityId } from "./utils/unique-entity-id";

interface AttendeeEntityProps {
  name: string;
  email: string;
  eventId: UniqueEntityId;
  createdAt: Date;
  checkInAt: Date | null;
}

export class AttendeeEntity extends Entity<AttendeeEntityProps> {
  public get name(): string {
    return this.props.name;
  }

  public get email(): string {
    return this.props.email;
  }

  public get eventId(): UniqueEntityId {
    return this.props.eventId;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get checkInAt(): Date | null {
    return this.props.checkInAt;
  }

  public checkIn(): void {
    if (!this.props.checkInAt) {
      this.props.checkInAt = new Date();
    }
  }

  public static create(
    props: Optional<AttendeeEntityProps, "checkInAt" | "createdAt">,
    id?: UniqueEntityId
  ): AttendeeEntity {
    return new AttendeeEntity(
      {
        name: props.name,
        email: props.email,
        eventId: props.eventId,
        checkInAt: props.checkInAt ?? null,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }
}
