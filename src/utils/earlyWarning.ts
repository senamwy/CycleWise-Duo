import { getPartnerConnectionForUser, getSharingPermissions, getLatestCycleEntry } from './storage';
import { calculateCycleStatus } from './cycleCalculations';
import { toLocalDateString } from './dateUtils';

/** Days before the next period counted as the late-luteal / PMS window (days 20-28 of a 28-day cycle). */
const PMS_WINDOW_DAYS = 9;
/** How many days ahead of the PMS window the early warning starts. */
const EARLY_WARNING_LEAD_DAYS = 3;

export interface EarlyWarningInfo {
  isActive: boolean;
  phaseName: string;
  daysUntilHighSymptom: number;
  reason: string;
  proactiveSuggestions: string[];
}

export function getEarlyWarningForBoyfriend(boyfriendId: string): EarlyWarningInfo {
  const connection = getPartnerConnectionForUser(boyfriendId);
  if (!connection || connection.status !== 'connected') {
    return {
      isActive: false,
      phaseName: '',
      daysUntilHighSymptom: -1,
      reason: '',
      proactiveSuggestions: []
    };
  }

  const permissions = getSharingPermissions(connection.id, connection.girlfriendId);
  if (!permissions.shareGeneralPhase) {
    return {
      isActive: false,
      phaseName: '',
      daysUntilHighSymptom: -1,
      reason: '',
      proactiveSuggestions: []
    };
  }

  const latestCycle = getLatestCycleEntry(connection.girlfriendId);
  if (!latestCycle) {
    return {
      isActive: false,
      phaseName: '',
      daysUntilHighSymptom: -1,
      reason: '',
      proactiveSuggestions: []
    };
  }

  const status = calculateCycleStatus(
    latestCycle.startDate,
    latestCycle.cycleLengthDays,
    latestCycle.periodLengthDays
  );

  if (!status) {
    return {
      isActive: false,
      phaseName: '',
      daysUntilHighSymptom: -1,
      reason: '',
      proactiveSuggestions: []
    };
  }

  // A start date in the future means the cycle hasn't begun yet: nothing to warn about.
  if (latestCycle.startDate > toLocalDateString()) {
    return {
      isActive: false,
      phaseName: '',
      daysUntilHighSymptom: -1,
      reason: '',
      proactiveSuggestions: []
    };
  }

  // High-symptom windows: menstruation, plus the late luteal (PMS) phase, i.e. the last
  // PMS_WINDOW_DAYS days before the next period. Anchoring to the next period instead of
  // fixed cycle days keeps the warning correct for cycles shorter or longer than 28 days.
  const currentDay = status.currentDay;
  const daysUntilPeriod = status.daysUntilNextPeriod;
  const isHighSymptomPhase = status.phaseNumber === 1 || daysUntilPeriod <= PMS_WINDOW_DAYS;
  const isApproachingHighSymptom = !isHighSymptomPhase && daysUntilPeriod <= PMS_WINDOW_DAYS + EARLY_WARNING_LEAD_DAYS;

  if (isHighSymptomPhase) {
    return {
      isActive: true,
      phaseName: status.phaseName,
      daysUntilHighSymptom: 0,
      reason: `Sie befindet sich aktuell in der ${status.phaseName} (Tag ${currentDay}), die statistisch mit höherem Ruhebedürfnis und Sensibilität einhergeht.`,
      proactiveSuggestions: [
        'Halte den Abend entspannt und vermeide unnötige Reize.',
        'Biete unaufgefordert eine Wärmflasche oder einen Kräutertee an.',
        'Höre geduldig zu, ohne sofort Ratschläge zu geben.'
      ]
    };
  } else if (isApproachingHighSymptom) {
    const daysLeft = daysUntilPeriod - PMS_WINDOW_DAYS;
    return {
      isActive: true,
      phaseName: 'Lutealphase / Bevorstehende PMS-Phase',
      daysUntilHighSymptom: daysLeft,
      reason: `Frühe Warnung: In ca. ${daysLeft} ${daysLeft === 1 ? 'Tag' : 'Tagen'} beginnt ihre späte Lutealphase (PMS-Fenster). Progesteron-Schwankungen können zu erhöhter Empfindlichkeit führen.`,
      proactiveSuggestions: [
        'Plane das Wochenende eher gemütlich statt stressig.',
        'Übernehme schon jetzt ein paar Aufgaben im Haushalt.',
        'Signalisiere ihr: "Du kannst dich voll auf mich verlassen."'
      ]
    };
  }

  return {
    isActive: false,
    phaseName: status.phaseName,
    daysUntilHighSymptom: -1,
    reason: '',
    proactiveSuggestions: []
  };
}
