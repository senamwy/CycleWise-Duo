import { PersonalReminder, SupportSuggestion } from '../types';
import { SUPPORT_SUGGESTIONS, DAILY_FACTS } from '../data/supportData';

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Guten Morgen';
  if (hour >= 12 && hour < 18) return 'Guten Tag';
  return 'Guten Abend';
}

export function formatDateGerman(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-');
    if (!year || !month || !day) return dateStr;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString('de-DE', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  } catch {
    return dateStr;
  }
}

export function getDailySupportSuggestion(date: Date = new Date()): SupportSuggestion {
  // Deterministic daily selection based on day of year
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const index = dayOfYear % SUPPORT_SUGGESTIONS.length;
  return SUPPORT_SUGGESTIONS[index] || SUPPORT_SUGGESTIONS[0];
}

export function getDailyFact(date: Date = new Date()): string {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const index = dayOfYear % DAILY_FACTS.length;
  return DAILY_FACTS[index] || DAILY_FACTS[0];
}

export function filterAndSortReminders(
  reminders: PersonalReminder[],
  filter: 'all' | 'upcoming' | 'completed'
): PersonalReminder[] {
  return reminders
    .filter((r) => {
      if (filter === 'upcoming') return !r.isCompleted;
      if (filter === 'completed') return r.isCompleted;
      return true;
    })
    .sort((a, b) => {
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }
      return a.dueDate.localeCompare(b.dueDate);
    });
}

export function calculateProgressPercentage(completed: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((completed / total) * 100));
}
