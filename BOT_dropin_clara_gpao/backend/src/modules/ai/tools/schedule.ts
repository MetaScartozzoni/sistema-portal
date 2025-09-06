import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function scheduleAppointment(input: {
  patientId: string;
  doctorId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  reason?: string;
  insurance?: string;
}) {
  const dt = new Date(`${input.date}T${input.time}:00`);
  const appt = await prisma.appointment.create({
    data: {
      patientId: input.patientId,
      doctorId: input.doctorId,
      date: dt,
      reason: input.reason
    }
  });
  return { ok: true, appointment: appt };
}
