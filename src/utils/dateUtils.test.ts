import test from 'node:test';
import assert from 'node:assert/strict';
import { calendarDaysBetween, localDateStringFromToday, parseLocalDate, toLocalDateString } from './dateUtils';
import { calculateCycleStatus } from './cycleCalculations';
import { addDaysToDateString, calculateHistoricalStats, generateMultiCycleForecast } from './cyclePrediction';

// Run this file with TZ=Europe/Berlin and TZ=America/New_York as well as UTC:
// every assertion below must hold in any time zone.

test('toLocalDateString / parseLocalDate round-trip the local calendar day', () => {
  assert.equal(toLocalDateString(parseLocalDate('2026-03-10')), '2026-03-10');
  assert.equal(toLocalDateString(new Date(2026, 0, 1, 23, 59)), '2026-01-01');
  assert.equal(toLocalDateString(new Date(2026, 0, 1, 0, 1)), '2026-01-01');
});

test('localDateStringFromToday offsets by calendar days', () => {
  const today = new Date(2026, 1, 28, 12);
  assert.equal(localDateStringFromToday(0, today), '2026-02-28');
  assert.equal(localDateStringFromToday(1, today), '2026-03-01');
  assert.equal(localDateStringFromToday(-28, today), '2026-01-31');
});

test('calendarDaysBetween is not thrown off by DST switches', () => {
  // US DST starts 2026-03-08, EU DST starts 2026-03-29
  assert.equal(calendarDaysBetween(new Date(2026, 2, 1), new Date(2026, 2, 10)), 9);
  assert.equal(calendarDaysBetween(new Date(2026, 2, 25), new Date(2026, 3, 2)), 8);
  assert.equal(calendarDaysBetween(new Date(2026, 2, 10), new Date(2026, 2, 1)), -9);
});

test('addDaysToDateString does not shift the date', () => {
  assert.equal(addDaysToDateString('2026-03-10', 0), '2026-03-10');
  assert.equal(addDaysToDateString('2026-03-10', 1), '2026-03-11');
  assert.equal(addDaysToDateString('2026-03-28', 2), '2026-03-30');
});

test('calculateCycleStatus gives the right day and next period across DST', () => {
  const status = calculateCycleStatus('2026-03-01', 28, 5, new Date(2026, 2, 10, 8));
  assert.ok(status);
  assert.equal(status.currentDay, 10);
  assert.equal(status.daysUntilNextPeriod, 19);
  assert.equal(status.nextPeriodDate, '2026-03-29');

  const future = calculateCycleStatus('2026-03-15', 28, 5, new Date(2026, 2, 10, 8));
  assert.ok(future);
  assert.equal(future.daysUntilNextPeriod, 5);
});

test('historical stats and forecasts keep stored dates intact', () => {
  const stats = calculateHistoricalStats([
    { id: 'a', userId: 'u', startDate: '2026-02-01', cycleLengthDays: 28, periodLengthDays: 5, symptoms: [], updatedAt: '' },
    { id: 'b', userId: 'u', startDate: '2026-03-01', cycleLengthDays: 28, periodLengthDays: 5, symptoms: [], updatedAt: '' }
  ]);
  assert.equal(stats.nextPeriodEstimatedDate, '2026-03-29');
  assert.equal(stats.nextOvulationEstimatedDate, '2026-03-15');

  const [first, second] = generateMultiCycleForecast(stats, 2);
  assert.equal(first.startDate, '2026-03-29');
  assert.equal(first.endDate, '2026-04-25');
  assert.equal(second.startDate, '2026-04-26');
});
