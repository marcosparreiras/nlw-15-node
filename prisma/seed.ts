import { PrismaClient, Event, Attendee } from "@prisma/client";

const EVENTS: Event[] = [
  {
    id: "3d57fd67-5e9a-4b24-b7bf-9f3187c488d5",
    title: "my event",
    details: "my event details",
    slug: "my-event-details",
    maximumAttendees: 4,
  },
];

const ATTENDEES: Attendee[] = [
  {
    id: "3d57fd67-5e9a-4b24-b7bf-9f3187c488d8",
    name: "john doe",
    email: "johndoe@example.com",
    eventId: EVENTS[0].id,
    createdAt: new Date(),
    checkInAt: new Date(),
  },
];

async function seed() {
  const prisma = new PrismaClient();

  await prisma.attendee.deleteMany({});
  await prisma.event.deleteMany({});

  await prisma.event.createMany({ data: EVENTS });
  await prisma.attendee.createMany({ data: ATTENDEES });

  await prisma.$disconnect();
}

seed().then(() => {
  console.log("Database seeded 🌱");
});
