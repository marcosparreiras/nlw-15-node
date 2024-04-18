import { AttendeeRepository } from "../domain/application/repositories/attendee-repository";
import { EventRepository } from "../domain/application/repositories/event-repository";
import { CheckInUseCase } from "../domain/application/use-cases/check-in-use-case";
import { CreateEventUseCase } from "../domain/application/use-cases/create-event-use-case";
import { FetchEventAttendeesUseCase } from "../domain/application/use-cases/fetch-event-attendees-use-case";
import { GetAttendeeBadgeUseCase } from "../domain/application/use-cases/get-attendee-badge-use-case";
import { GetEventUseCase } from "../domain/application/use-cases/get-event-use-case";
import { RegisterForEventUseCase } from "../domain/application/use-cases/register-for-event-use-case";
import { PrismaAttendeeRepository } from "../repositories/prisma-attendee-repository";
import { PrismaEventRepository } from "../repositories/prisma-event-repository";

export class UseCaseFacotry {
  private static eventRepository: EventRepository = new PrismaEventRepository();
  private static attendeeRepository: AttendeeRepository =
    new PrismaAttendeeRepository();

  public static makeCheckIn(): CheckInUseCase {
    const useCase = new CheckInUseCase(this.attendeeRepository);
    return useCase;
  }

  public static makeCreateEventUseCase(): CreateEventUseCase {
    const useCase = new CreateEventUseCase(this.eventRepository);
    return useCase;
  }

  public static makeFetchEventAttendeesUseCase(): FetchEventAttendeesUseCase {
    const useCase = new FetchEventAttendeesUseCase(
      this.eventRepository,
      this.attendeeRepository
    );
    return useCase;
  }

  public static makeGetAttendeeBadgeUseCase(): GetAttendeeBadgeUseCase {
    const useCase = new GetAttendeeBadgeUseCase(this.attendeeRepository);
    return useCase;
  }

  public static makeGetEventUseCase(): GetEventUseCase {
    const useCase = new GetEventUseCase(
      this.eventRepository,
      this.attendeeRepository
    );
    return useCase;
  }

  public static makeRegisterForEventUseCase(): RegisterForEventUseCase {
    const useCase = new RegisterForEventUseCase(
      this.eventRepository,
      this.attendeeRepository
    );
    return useCase;
  }
}
