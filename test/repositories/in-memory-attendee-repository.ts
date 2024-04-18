import { AttendeeRepository } from "../../src/domain/application/repositories/attendee-repository";
import { SearchProps } from "../../src/domain/application/repositories/search-props";
import { AttendeeEntity } from "../../src/domain/enterprise/Entities/attendee-entity";

export class InMemoryAttendeeRepository implements AttendeeRepository {
  public items: AttendeeEntity[] = [];

  async countByEventId(eventId: string): Promise<number> {
    const attendeesCount = this.items.reduce<number>((acc, cur) => {
      if (cur.eventId.toString() === eventId) {
        return acc + 1;
      }
      return acc;
    }, 0);
    return attendeesCount;
  }

  async create(attendee: AttendeeEntity): Promise<void> {
    this.items.push(attendee);
  }

  async save(attendee: AttendeeEntity): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(attendee.id));
    if (index !== -1) {
      this.items[index] = attendee;
    }
  }

  async findById(attendeeId: string): Promise<AttendeeEntity | null> {
    const attendee = this.items.find(
      (item) => item.id.toString() === attendeeId
    );
    return attendee ?? null;
  }

  async findManyByEventId(
    eventId: string,
    search: SearchProps
  ): Promise<AttendeeEntity[]> {
    if (search.page < 0) {
      search.page = 1;
    }

    const attendees = this.items
      .filter((item) => {
        const checkEventId = item.eventId.toString() === eventId;
        if (search.query) {
          return item.name.includes(search.query) && checkEventId;
        }
        return checkEventId;
      })
      .slice((search.page - 1) * 10, search.page * 10);

    return attendees;
  }

  async findByEmailAndEventId(
    email: string,
    eventId: string
  ): Promise<AttendeeEntity | null> {
    const attendee = this.items.find(
      (item) => item.eventId.toString() === eventId && item.email === email
    );
    return attendee ?? null;
  }
}
