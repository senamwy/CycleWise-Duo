import { User } from '../types';
import { getPartnerConnectionForUser, getSharingPermissions, getLatestCycleEntry, getCycleEntries } from './storage';
import { calculateCycleStatus } from './cycleCalculations';

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

  // High-symptom phases: Luteal phase (Days 20-28) or Menstruation (Days 1-5)
  const currentDay = status.currentDay;
  const isHighSymptomPhase = (currentDay >= 20 && currentDay <= 28) || (currentDay >= 1 && currentDay <= 5);
  const isApproachingHighSymptom = currentDay >= 17 && currentDay < 20;

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
    const daysLeft = 20 - currentDay;
    return {
      isActive: true,
      phaseName: 'Lutealphase / Bevorstehende PMS-Phase',
      daysUntilHighSymptom: daysLeft,
      reason: `Frühe Warnung: In ca. ${daysLeft} Tagen beginnt ihre Lutealphase. Progesteron-Schwankungen können zu erhöhter Empfindlichkeit führen.`,
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
