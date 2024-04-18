import { FastifyRequest } from "fastify";
import { AttendeeEntity } from "../domain/enterprise/Entities/attendee-entity";

export class AttendeeBadgePresenter {
  public static toHTTP(attendee: AttendeeEntity, request: FastifyRequest) {
    const baseUrl = `${request.protocol}://${request.hostname}`;
    const checkInUrl = new URL(
      `/attendees/${attendee.id.toString()}/checkIn`,
      baseUrl
    );

    return {
      name: attendee.name,
      email: attendee.email,
      checkInUrl: checkInUrl.toString(),
    };
  }
}
