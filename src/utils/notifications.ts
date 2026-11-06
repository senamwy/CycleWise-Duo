import { User } from '../types';
import { getPartnerConnectionForUser } from './storage';

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'insight' | 'tip';
  actionTab?: string;
}

export function getDailyNotificationForUser(user: User): InAppNotification {
  const isGirlfriend = user.role === 'girlfriend';
  const partnerName = user.preferences.partnerName || (isGirlfriend ? 'dein Partner' : 'deine Partnerin');

  if (isGirlfriend) {
    return {
      id: 'notif-gf-log',
      title: 'Tägliches Zyklus-Check-in',
      message: 'Wie fühlst du dich heute? Erfasse kurz deine Stimmung und Symptome im Tagebuch.',
      type: 'reminder',
      actionTab: 'cycle'
    };
  } else {
    return {
      id: 'notif-bf-tip',
      title: 'Heutiger Empathie-Impuls',
      message: `Entdecke den heutigen Geheim-Tipp, um ${partnerName} heute besonders aufmerksam zu unterstützen.`,
      type: 'insight',
      actionTab: 'home'
    };
  }
}
