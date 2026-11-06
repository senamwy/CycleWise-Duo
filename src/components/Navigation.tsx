import { Home, BookOpen, HeartHandshake, Bell, User as UserIcon, Moon, Sun, LogOut, Calendar, Heart, Sparkles } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { User } from '../types';

export type NavTab = 'home' | 'learn' | 'support' | 'reminders' | 'profile' | 'cycle' | 'wishes' | 'partner' | 'chat';

interface NavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeUser: User;
  onLogout: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenConnectModal?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  activeUser,
  onLogout,
  isDark,
  onToggleTheme,
  onOpenConnectModal
}) => {
  const isGirlfriend = activeUser.role === 'girlfriend';

  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = isGirlfriend
    ? [
        { id: 'cycle', label: 'Mein Zyklus', icon: Calendar },
        { id: 'wishes', label: 'Wünsche & Freigaben', icon: Heart },
        { id: 'learn', label: 'Wissen', icon: BookOpen },
        { id: 'partner', label: 'Partner', icon: HeartHandshake },
        { id: 'profile', label: 'Profil', icon: UserIcon }
      ]
    : [
        { id: 'home', label: 'Übersicht', icon: Home },
        { id: 'learn', label: 'Wissen', icon: BookOpen },
        { id: 'support', label: 'Für sie da', icon: HeartHandshake },
        { id: 'reminders', label: 'Erinnerungen', icon: Bell },
        { id: 'profile', label: 'Profil', icon: UserIcon }
      ];

  return (
    <>
      {/* Desktop / Tablet Top Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#101018]/90 dark:bg-[#101018]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div
            onClick={() => onSelectTab(isGirlfriend ? 'cycle' : 'home')}
            className="flex items-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0 group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 p-0.5 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#101018] rounded-[10px] flex items-center justify-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-tr from-purple-400 to-pink-300 font-extrabold text-lg">C</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                CycleWise <span className="text-purple-400 font-medium text-xs px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">Duo</span>
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (hidden on mobile, visible from md) */}
          <nav className="hidden md:flex items-center gap-1 bg-[#1A1A26]/80 p-1 rounded-2xl border border-slate-800/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md shadow-purple-600/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions (KI-Chat, Theme, Install, User) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onSelectTab('chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md ${
                currentTab === 'chat'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-600/30 ring-2 ring-purple-400/50'
                  : 'bg-purple-950/40 hover:bg-purple-900/50 text-purple-200 border border-purple-500/30'
              }`}
              title="KI-Chat Assistent öffnen"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-300 animate-pulse" />
              <span className="hidden sm:inline">KI-Chat</span>
            </button>

            <PWAInstallButton variant="nav" />

            <button
              onClick={onToggleTheme}
              aria-label={isDark ? 'Helles Design aktivieren' : 'Dunkles Design aktivieren'}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white bg-[#1A1A26] border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-purple-300" />}
            </button>

            <button
              onClick={() => onSelectTab('profile')}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl bg-[#1A1A26] border border-slate-800 hover:border-purple-500/30 transition-colors cursor-pointer text-xs"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-[11px]">
                {activeUser.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-slate-300 font-medium hidden sm:inline max-w-[100px] truncate">
                {activeUser.name}
              </span>
            </button>

            <button
              onClick={onLogout}
              aria-label="Abmelden"
              title="Abmelden"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-400 bg-[#1A1A26] border border-slate-800 hover:border-red-500/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#101018]/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 shadow-2xl">
        <nav className="grid grid-cols-5 items-center max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex flex-col items-center justify-center min-h-[48px] py-1 rounded-xl transition-all cursor-pointer ${
                  isActive ? 'text-purple-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div
                  className={`p-1 rounded-lg transition-transform ${
                    isActive ? 'bg-purple-500/15 scale-110' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] tracking-tight mt-0.5 font-medium ${
                    isActive ? 'font-semibold text-purple-300' : 'text-slate-400'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};
