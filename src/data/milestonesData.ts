export interface MilestoneBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'checkin' | 'communication' | 'wellness' | 'connection';
  requiredCount: number;
}

export const MILESTONE_BADGES: MilestoneBadge[] = [
  {
    id: 'badge-connect',
    title: 'Duo Synchron',
    description: 'Erfolgreiche Verbindung der Partnerkonten für gemeinsamen Rückhalt.',
    iconName: 'HeartHandshake',
    category: 'connection',
    requiredCount: 1
  },
  {
    id: 'badge-first-task',
    title: 'Aufmerksamer Start',
    description: 'Ersten täglichen Unterstützungsimpuls erfolgreich umgesetzt.',
    iconName: 'Sparkles',
    category: 'checkin',
    requiredCount: 1
  },
  {
    id: 'badge-communicator',
    title: 'Empathie-Profi',
    description: 'Den Kommunikations-Coach genutzt und Deeskalations-Tipps angewendet.',
    iconName: 'MessageCircle',
    category: 'communication',
    requiredCount: 1
  },
  {
    id: 'badge-science',
    title: 'Wissens-Explorer',
    description: 'Mehrere evidenzbasierte Fachartikel oder Studien im Hub gelesen.',
    iconName: 'BookOpen',
    category: 'wellness',
    requiredCount: 3
  },
  {
    id: 'badge-support-streak',
    title: 'Sanfte Zuwendung',
    description: 'Mindestens 3 Unterstützungstipps oder Erinnerungen erledigt.',
    iconName: 'Heart',
    category: 'wellness',
    requiredCount: 3
  },
  {
    id: 'badge-cycle-tracker',
    title: 'Rhythmus-Meisterin',
    description: 'Regelmäßige Erfassung von Zyklusphasen und Wohlbefinden.',
    iconName: 'Calendar',
    category: 'checkin',
    requiredCount: 3
  }
];
