import { AttendeeEntity } from "../domain/enterprise/Entities/attendee-entity";

export class AttendeePresenter {
  public static toHTTP(attendee: AttendeeEntity) {
    return {
      id: attendee.id.toString(),
      name: attendee.name,
      email: attendee.email,
      createdAt: attendee.createdAt,
      checkInAt: attendee.checkInAt,
    };
  }
}
