import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculateHistoricalStats,
  generateDayByDayPredictionCurve,
  generateCycleComparisonData,
  generateMultiCycleForecast
} from './cyclePrediction.ts';
import { CycleEntry } from '../types/index.ts';

describe('cyclePrediction utility tests', () => {
  it('handles empty cycle entries safely with defaults', () => {
    const stats = calculateHistoricalStats([]);
    assert.strictEqual(stats.totalCyclesLogged, 0);
    assert.strictEqual(stats.averageCycleLength, 28);
    assert.strictEqual(stats.averagePeriodLength, 5);
    assert.strictEqual(stats.confidenceScorePercent, 50);
  });

  it('calculates accurate averages and 80%+ confidence for 3-4 historical cycles', () => {
    const entries: CycleEntry[] = [
      {
        id: 'c1',
        userId: 'u1',
        startDate: '2026-07-01',
        cycleLengthDays: 29,
        periodLengthDays: 5,
        symptoms: ['cramps', 'fatigue'],
        updatedAt: '2026-07-01T00:00:00Z'
      },
      {
        id: 'c2',
        userId: 'u1',
        startDate: '2026-07-30',
        cycleLengthDays: 28,
        periodLengthDays: 5,
        symptoms: ['fatigue'],
        updatedAt: '2026-07-30T00:00:00Z'
      },
      {
        id: 'c3',
        userId: 'u1',
        startDate: '2026-08-27',
        cycleLengthDays: 27,
        periodLengthDays: 4,
        symptoms: ['headache', 'cramps'],
        updatedAt: '2026-08-27T00:00:00Z'
      },
      {
        id: 'c4',
        userId: 'u1',
        startDate: '2026-09-23',
        cycleLengthDays: 28,
        periodLengthDays: 5,
        symptoms: ['cramps'],
        updatedAt: '2026-09-23T00:00:00Z'
      }
    ];

    const stats = calculateHistoricalStats(entries);
    assert.strictEqual(stats.totalCyclesLogged, 4);
    assert.strictEqual(stats.averageCycleLength, 28);
    assert.strictEqual(stats.averagePeriodLength, 4.8);
    assert.strictEqual(stats.minCycleLength, 27);
    assert.strictEqual(stats.maxCycleLength, 29);
    // 4 cycles should have >= 85% confidence score
    assert.ok(stats.confidenceScorePercent >= 85, `Expected >= 85, got ${stats.confidenceScorePercent}`);
    assert.strictEqual(stats.commonSymptoms[0].id, 'cramps');
    assert.strictEqual(stats.commonSymptoms[0].count, 3);
  });

  it('generates day-by-day continuous curve with all 4 phases and hormone crests', () => {
    const curve = generateDayByDayPredictionCurve(28, 5, 14);
    assert.strictEqual(curve.length, 28);

    // Day 1: Menstruation
    assert.strictEqual(curve[0].day, 1);
    assert.strictEqual(curve[0].phaseCode, 1);
    assert.strictEqual(curve[0].phaseName, 'Menstruation');
    assert.ok(curve[0].crampProbability > 50);

    // Day 14: Ovulation
    const day14 = curve.find((p) => p.day === 14);
    assert.ok(day14);
    assert.strictEqual(day14.phaseCode, 3);
    assert.ok(day14.lhSurgeLevel >= 90, 'LH surge should be at peak during ovulation day');
    assert.ok(day14.fertilityProbability >= 90, 'Fertility should peak at ovulation day');
    assert.strictEqual(day14.isCurrentDay, true);

    // Day 22: Luteal Phase
    const day22 = curve.find((p) => p.day === 22);
    assert.ok(day22);
    assert.strictEqual(day22.phaseCode, 4);
    assert.ok(day22.progesteroneLevel > 50, 'Progesterone should be high in luteal phase');
  });

  it('builds cycle comparison data including prediction item', () => {
    const entries: CycleEntry[] = [
      {
        id: 'c1',
        userId: 'u1',
        startDate: '2026-09-01',
        cycleLengthDays: 28,
        periodLengthDays: 5,
        symptoms: [],
        updatedAt: '2026-09-01T00:00:00Z'
      }
    ];

    const stats = calculateHistoricalStats(entries);
    const comparison = generateCycleComparisonData(entries, stats);

    assert.strictEqual(comparison.length, 2);
    assert.strictEqual(comparison[0].isPrediction, false);
    assert.strictEqual(comparison[1].isPrediction, true);
    assert.strictEqual(comparison[1].cycleId, 'prediction-next');
  });

  it('generates 3-cycle forward forecast with dates and confidence margins', () => {
    const stats = calculateHistoricalStats([
      {
        id: 'c1',
        userId: 'u1',
        startDate: '2026-10-01',
        cycleLengthDays: 28,
        periodLengthDays: 5,
        symptoms: [],
        updatedAt: '2026-10-01T00:00:00Z'
      }
    ]);

    const forecast = generateMultiCycleForecast(stats, 3);
    assert.strictEqual(forecast.length, 3);
    assert.strictEqual(forecast[0].cycleIndex, 1);
    assert.strictEqual(forecast[1].cycleIndex, 2);
    assert.strictEqual(forecast[2].cycleIndex, 3);
    assert.ok(forecast[0].startDate.length > 0);
    assert.ok(forecast[0].ovulationDate.length > 0);
  });
});
