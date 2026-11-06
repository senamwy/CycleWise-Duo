import { CalculatedCycleStatus } from '../types';
import { calendarDaysBetween, parseLocalDate, toLocalDateString } from './dateUtils';

export const MEDICAL_CYCLE_DISCLAIMER =
  'Hinweis: Berechnungen und Phasenangaben beruhen auf statistischen Schätzungen und können vom tatsächlichen biologischen Verlauf abweichen. Nicht als Verhütungsmethode oder Schwangerschaftsdiagnostik geeignet.';

export function calculateCycleStatus(
  startDateStr: string,
  cycleLength: number = 28,
  periodLength: number = 5,
  asOfDate: Date = new Date()
): CalculatedCycleStatus | null {
  if (!startDateStr) return null;

  try {
    const start = parseLocalDate(startDateStr);
    const current = new Date(asOfDate);
    current.setHours(0, 0, 0, 0);
    if (isNaN(start.getTime()) || isNaN(current.getTime())) return null;

    const totalDaysSinceStart = calendarDaysBetween(start, current);
    if (totalDaysSinceStart < 0) {
      // Future start date
      return {
        currentDay: 1,
        phaseNumber: 1,
        phaseName: 'Menstruation',
        phaseSeason: 'Der innere Winter',
        nextPeriodDate: startDateStr,
        daysUntilNextPeriod: -totalDaysSinceStart,
        uncertaintyDisclaimer: MEDICAL_CYCLE_DISCLAIMER
      };
    }

    const effectiveCycleLength = Math.max(21, Math.min(45, cycleLength || 28));
    const effectivePeriodLength = Math.max(3, Math.min(10, periodLength || 5));

    // Current day in this cycle (1-indexed)
    const currentDay = (totalDaysSinceStart % effectiveCycleLength) + 1;

    // Ovulation typically occurs ~14 days before next period
    const estimatedOvulationDay = Math.max(effectivePeriodLength + 2, effectiveCycleLength - 14);

    let phaseNumber = 1;
    let phaseName = 'Menstruation';
    let phaseSeason = 'Der innere Winter';

    if (currentDay <= effectivePeriodLength) {
      phaseNumber = 1;
      phaseName = 'Menstruation';
      phaseSeason = 'Der innere Winter';
    } else if (currentDay < estimatedOvulationDay - 1) {
      phaseNumber = 2;
      phaseName = 'Follikelphase';
      phaseSeason = 'Der innere Frühling';
    } else if (currentDay <= estimatedOvulationDay + 1) {
      phaseNumber = 3;
      phaseName = 'Ovulation (Eisprung)';
      phaseSeason = 'Der innere Sommer';
    } else {
      phaseNumber = 4;
      phaseName = 'Lutealphase';
      phaseSeason = 'Der innere Herbst';
    }

    const daysUntilNext = effectiveCycleLength - currentDay + 1;
    const nextDate = new Date(current);
    nextDate.setDate(nextDate.getDate() + daysUntilNext);
    const nextPeriodDate = toLocalDateString(nextDate);

    return {
      currentDay,
      phaseNumber,
      phaseName,
      phaseSeason,
      nextPeriodDate,
      daysUntilNextPeriod: daysUntilNext,
      uncertaintyDisclaimer: MEDICAL_CYCLE_DISCLAIMER
    };
  } catch {
    return null;
  }
}

export const COMMON_SYMPTOMS: { id: string; label: string; icon: string }[] = [
  { id: 'cramps', label: 'Unterleibskrämpfe', icon: 'Flame' },
  { id: 'headache', label: 'Kopfschmerzen', icon: 'AlertCircle' },
  { id: 'fatigue', label: 'Erschöpfung / Müdigkeit', icon: 'BatteryLow' },
  { id: 'bloating', label: 'Völlegefühl / Blähbauch', icon: 'Activity' },
  { id: 'breast_tenderness', label: 'Empfindliche Brüste', icon: 'Heart' },
  { id: 'back_pain', label: 'Rückenschmerzen', icon: 'Shield' },
  { id: 'sweet_cravings', label: 'Heißhunger auf Süßes', icon: 'Coffee' }
];

export const MOOD_OPTIONS: { id: string; label: string; emoji: string }[] = [
  { id: 'calm', label: 'Ausgeglichen & Ruhig', emoji: '🌿' },
  { id: 'energetic', label: 'Voller Tatendrang & Fröhlich', emoji: '✨' },
  { id: 'sensitive', label: 'Sensibel & Nachdenklich', emoji: '🌙' },
  { id: 'exhausted', label: 'Müde & Bedürfnis nach Pause', emoji: '☁️' },
  { id: 'irritable', label: 'Gereizt oder Überreizt', emoji: '⚡' }
];

export const GIRLFRIEND_DEFAULT_PREFERENCES = [
  'Ich schätze eine warme Tasse Tee ohne ständiges Fragen',
  'Hilfe bei alltäglichen Aufgaben (z.B. Kochen, Küche) entlastet mich',
  'Ich brauche manchmal einfach Ruhe und Zeit für mich',
  'Bitte vorher kurz nachfragen, bevor feste Abendpläne gemacht werden',
  'Liebevolle Worte und Verständnis tun mir besonders gut',
  'Eine sanfte Rückenmassage oder eine Wärmflasche hilft mir'
];
