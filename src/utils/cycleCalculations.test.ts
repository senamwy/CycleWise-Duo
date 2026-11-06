import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCycleStatus, MEDICAL_CYCLE_DISCLAIMER } from './cycleCalculations';

test('calculateCycleStatus correctly detects Menstruation phase on day 2', () => {
  const today = new Date('2026-10-29');
  const startDate = '2026-10-28'; // Day 2 of cycle

  const status = calculateCycleStatus(startDate, 28, 5, today);
  assert.ok(status !== null);
  assert.equal(status.currentDay, 2);
  assert.equal(status.phaseNumber, 1);
  assert.equal(status.phaseName, 'Menstruation');
  assert.equal(status.phaseSeason, 'Der innere Winter');
  assert.equal(status.uncertaintyDisclaimer, MEDICAL_CYCLE_DISCLAIMER);
});

test('calculateCycleStatus correctly detects Follicular phase on day 9', () => {
  const today = new Date('2026-10-29');
  const startDate = '2026-10-21'; // Day 9 of cycle

  const status = calculateCycleStatus(startDate, 28, 5, today);
  assert.ok(status !== null);
  assert.equal(status.currentDay, 9);
  assert.equal(status.phaseNumber, 2);
  assert.equal(status.phaseName, 'Follikelphase');
});

test('calculateCycleStatus correctly detects Ovulation around day 14', () => {
  const today = new Date('2026-10-29');
  const startDate = '2026-10-16'; // Day 14 of cycle

  const status = calculateCycleStatus(startDate, 28, 5, today);
  assert.ok(status !== null);
  assert.equal(status.currentDay, 14);
  assert.equal(status.phaseNumber, 3);
  assert.ok(status.phaseName.includes('Ovulation'));
});

test('calculateCycleStatus correctly detects Luteal phase on day 22', () => {
  const today = new Date('2026-10-29');
  const startDate = '2026-10-08'; // Day 22 of cycle

  const status = calculateCycleStatus(startDate, 28, 5, today);
  assert.ok(status !== null);
  assert.equal(status.currentDay, 22);
  assert.equal(status.phaseNumber, 4);
  assert.equal(status.phaseName, 'Lutealphase');
  assert.equal(status.daysUntilNextPeriod, 7);
});

test('calculateCycleStatus gracefully handles empty or invalid dates', () => {
  assert.equal(calculateCycleStatus(''), null);
});
