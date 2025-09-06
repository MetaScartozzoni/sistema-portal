import { addDays, endOfMonth, endOfWeek, format, isAfter, isBefore, set } from 'date-fns';
import { getAppointmentTypeDetails } from '@/lib/schedulingConfig';

// Generate a 6x7 calendar grid for a given month (Date)
export function getCalendarDays(monthDate) {
  const firstOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const start = new Date(firstOfMonth);
  // move back to previous Sunday
  start.setDate(firstOfMonth.getDate() - ((firstOfMonth.getDay() + 7) % 7));

  const days = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

// Returns available slots for a date based on schedule rules.
// appointments param is currently unused here and can be integrated later.
export function getAvailableSlotsForDate(date, appointments, scheduleConfig, typeFilter) {
  const dayOfWeek = date.getDay(); // 0-6 (Sun-Sat)
  const rules = (scheduleConfig || [])
    .filter((r) => r.day_of_week === dayOfWeek && !r.is_hidden)
    .filter((r) => !typeFilter || r.event_type === typeFilter);

  const slots = [];
  for (const rule of rules) {
    const details = getAppointmentTypeDetails(rule.event_type);
    const [sh, sm] = rule.start_time.split(':').map(Number);
    const [eh, em] = rule.end_time.split(':').map(Number);
    let cursor = set(date, { hours: sh, minutes: sm, seconds: 0, milliseconds: 0 });
    const end = set(date, { hours: eh, minutes: em, seconds: 0, milliseconds: 0 });

    const step = Math.max(details.duration || 30, 5); // minutes
    while (!isAfter(cursor, end)) {
      slots.push({ time: new Date(cursor), type: rule.event_type });
      cursor = new Date(cursor.getTime() + step * 60000);
    }
  }
  return slots;
}

// Suggests next post-op return date based on stage and surgery date
export function getNextPostOpReturnDate(stageValue, surgeryDate, patientAppointments) {
  const base = surgeryDate || new Date();
  const stage = String(stageValue);
  if (stage === 'Alta') return addDays(base, 35);
  if (stage === 'Extra') return addDays(base, 2);

  // Stage 1: next Monday from surgery date; others: +7 days each
  let d = new Date(base);
  // move to next Monday
  const day = d.getDay();
  const delta = (8 - day) % 7 || 7; // days until next Monday
  d = addDays(d, delta);

  const n = parseInt(stage, 10);
  if (!Number.isNaN(n) && n > 1) {
    d = addDays(d, (n - 1) * 7);
  }
  return d;
}

