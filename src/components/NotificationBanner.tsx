import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { getDailyNotificationForUser, InAppNotification } from '../utils/notifications';
import { triggerHapticFeedback } from '../utils/haptics';
import { Bell, X, ArrowRight, Sparkles } from 'lucide-react';
import { NavTab } from './Navigation';
import { toLocalDateString } from '../utils/dateUtils';

interface NotificationBannerProps {
  user: User;
  onNavigate: (tab: NavTab) => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({ user, onNavigate }) => {
  const [notification, setNotification] = useState<InAppNotification | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const notif = getDailyNotificationForUser(user);
    const dismissedKey = `cyclewise_dismissed_${user.id}_${toLocalDateString()}`;
    if (!localStorage.getItem(dismissedKey)) {
      setNotification(notif);
    }
  }, [user]);

  if (!notification || dismissed) return null;

  const handleDismiss = () => {
    triggerHapticFeedback('light');
    const dismissedKey = `cyclewise_dismissed_${user.id}_${toLocalDateString()}`;
    localStorage.setItem(dismissedKey, 'true');
    setDismissed(true);
  };

  const handleAction = () => {
    triggerHapticFeedback('medium');
    if (notification.actionTab) {
      onNavigate(notification.actionTab as NavTab);
    }
    handleDismiss();
  };

  return (
    <aside aria-label="Benachrichtigung" className="max-w-4xl mx-auto px-4 sm:px-6 pt-4">
      <div className="rounded-2xl bg-gradient-to-r from-purple-950/80 via-[#1A1A26] to-pink-950/70 border border-purple-500/40 p-4 sm:p-5 shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 mt-0.5 border border-purple-500/30">
            <Bell className="w-4 h-4 text-purple-300 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-purple-300">
              <Sparkles className="w-3 h-3 text-pink-400" />
              <span>Sanfte Erinnerung für heute</span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white mt-0.5">
              {notification.title}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              {notification.message}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {notification.actionTab && (
            <button
              onClick={handleAction}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all cursor-pointer"
            >
              <span>Öffnen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="p-2 rounded-xl bg-[#101018] hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Schließen"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
