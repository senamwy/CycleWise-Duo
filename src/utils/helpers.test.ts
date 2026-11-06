import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatDateGerman,
  getGreeting,
  filterAndSortReminders,
  calculateProgressPercentage,
  getDailySupportSuggestion,
  getDailyFact
} from './helpers';
import { PersonalReminder } from '../types';

test('formatDateGerman formats standard YYYY-MM-DD string correctly', () => {
  const formatted = formatDateGerman('2026-10-29');
  assert.ok(formatted.length > 0);
  assert.ok(formatted.includes('29'));
});

test('calculateProgressPercentage calculates exact percentages capped at 100', () => {
  assert.equal(calculateProgressPercentage(0, 10), 0);
  assert.equal(calculateProgressPercentage(5, 10), 50);
  assert.equal(calculateProgressPercentage(8, 8), 100);
  assert.equal(calculateProgressPercentage(10, 8), 100);
  assert.equal(calculateProgressPercentage(0, 0), 0);
});

test('filterAndSortReminders partitions and sorts completed vs upcoming', () => {
  const sampleReminders: PersonalReminder[] = [
    {
      id: '1',
      userId: 'u1',
      title: 'Erinnerung 1',
      category: 'gesture',
      categoryLabel: 'Geste',
      dueDate: '2026-11-02',
      recurring: 'none',
      isCompleted: true,
      createdAt: '2026-10-29'
    },
    {
      id: '2',
      userId: 'u1',
      title: 'Erinnerung 2',
      category: 'date',
      categoryLabel: 'Date',
      dueDate: '2026-10-30',
      recurring: 'none',
      isCompleted: false,
      createdAt: '2026-10-29'
    },
    {
      id: '3',
      userId: 'u1',
      title: 'Erinnerung 3',
      category: 'household',
      categoryLabel: 'Haushalt',
      dueDate: '2026-11-05',
      recurring: 'none',
      isCompleted: false,
      createdAt: '2026-10-29'
    }
  ];

  const upcoming = filterAndSortReminders(sampleReminders, 'upcoming');
  assert.equal(upcoming.length, 2);
  assert.equal(upcoming[0].id, '2'); // earlier date first

  const completed = filterAndSortReminders(sampleReminders, 'completed');
  assert.equal(completed.length, 1);
  assert.equal(completed[0].id, '1');

  const all = filterAndSortReminders(sampleReminders, 'all');
  assert.equal(all.length, 3);
  // Uncompleted items should come first
  assert.equal(all[0].isCompleted, false);
  assert.equal(all[2].isCompleted, true);
});

test('getDailySupportSuggestion and getDailyFact return valid non-empty entries', () => {
  const sug = getDailySupportSuggestion(new Date('2026-10-29'));
  assert.ok(sug.id);
  assert.ok(sug.title.length > 0);

  const fact = getDailyFact(new Date('2026-10-29'));
  assert.ok(fact.length > 10);
});

test('getGreeting returns valid German greeting', () => {
  const greeting = getGreeting();
  assert.ok(['Guten Morgen', 'Guten Tag', 'Guten Abend'].includes(greeting));
});
