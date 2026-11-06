/**
 * CycleWise Duo - Premium Couples Wellness SaaS
 * "Understand Her. Support Her. Grow Together."
 * Phase 1 & Phase 2: Boyfriend Dashboard, Private Girlfriend Cycle Tracker,
 * Partner Connection & Granular Consent Management
 */

import React, { useState, useEffect } from 'react';
import { User } from './types';
import {
  initializeStorage,
  getActiveUser,
  setActiveUserId,
  saveUser
} from './utils/storage';
import { Navigation, NavTab } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { LearnView } from './components/LearnView';
import { SupportView } from './components/SupportView';
import { RemindersView } from './components/RemindersView';
import { ProfileView } from './components/ProfileView';
import { LandingPage } from './components/LandingPage';
import { OnboardingModal } from './components/OnboardingModal';
import { GirlfriendCycleTracker } from './components/GirlfriendCycleTracker';
import { GirlfriendPreferencesView } from './components/GirlfriendPreferencesView';
import { PartnerConnectModal } from './components/PartnerConnectModal';
import { StudyDetailView } from './components/StudyDetailView';
import { CycleAssistantChat } from './components/CycleAssistantChat';
import { NotificationBanner } from './components/NotificationBanner';
import { DeviceFrameWrapper } from './components/DeviceFrameWrapper';

const parseStudyIdFromUrl = (): string | null => {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash || '';
  if (hash.startsWith('#study/')) {
    return hash.replace('#study/', '');
  }
  if (hash.startsWith('#/study/')) {
    return hash.replace('#/study/', '');
  }
  const params = new URLSearchParams(window.location.search);
  return params.get('study');
};

export default function App() {
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [showConnectModal, setShowConnectModal] = useState<boolean>(false);
  const [partnerUpdateTick, setPartnerUpdateTick] = useState<number>(0);
  const [activeStudyId, setActiveStudyId] = useState<string | null>(parseStudyIdFromUrl);

  // Cross-view navigation state
  const [targetArticleId, setTargetArticleId] = useState<string | null>(null);
  const [reminderModalState, setReminderModalState] = useState<{
    isOpen: boolean;
    prefillTitle?: string;
    prefillCategory?: any;
  }>({ isOpen: false });

  // Initialize storage and load user session
  useEffect(() => {
    initializeStorage();
    const user = getActiveUser();
    setActiveUser(user);
    if (user) {
      setCurrentTab(user.role === 'girlfriend' ? 'cycle' : 'home');
    }

    // Initial theme setup
    const savedTheme = localStorage.getItem('cyclewise_theme');
    const prefersDark = savedTheme ? savedTheme === 'dark' : true;
    setIsDark(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }

    // Listen to URL changes for deep-linking into specific scientific study pages
    const handleUrlChange = () => {
      setActiveStudyId(parseStudyIdFromUrl());
    };
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const handleToggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    localStorage.setItem('cyclewise_theme', nextDark ? 'dark' : 'light');
    if (nextDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  const handleLoginSuccess = (user: User) => {
    setActiveUser(user);
    setCurrentTab(user.role === 'girlfriend' ? 'cycle' : 'home');
  };

  const handleLogout = () => {
    setActiveUserId(null);
    setActiveUser(null);
    setCurrentTab('home');
  };

  const handleUpdateUser = (updatedUser: User) => {
    saveUser(updatedUser);
    setActiveUser(updatedUser);
  };

  const handleOpenNewReminderWithPrefill = (prefillTitle?: string, prefillCategory?: any) => {
    setReminderModalState({
      isOpen: true,
      prefillTitle,
      prefillCategory
    });
    setCurrentTab('reminders');
  };

  const handleSelectArticleFromDashboard = (articleId: string) => {
    setTargetArticleId(articleId);
    setCurrentTab('learn');
  };

  const handleOpenStudyArticle = (studyId: string) => {
    setActiveStudyId(studyId);
    window.location.hash = `#study/${studyId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseStudyArticle = () => {
    setActiveStudyId(null);
    if (window.location.hash.includes('study')) {
      history.pushState(null, '', window.location.pathname);
    }
  };

  // Dedicated Study Reader View (Direct Deep-linkable Article Website)
  if (activeStudyId) {
    return (
      <StudyDetailView
        studyId={activeStudyId}
        onBack={handleCloseStudyArticle}
        onSelectStudy={(id) => {
          setActiveStudyId(id);
          window.location.hash = `#study/${id}`;
        }}
      />
    );
  }

  // If no user is logged in, show the comprehensive landing page
  if (!activeUser) {
    return <LandingPage onLoginSuccess={handleLoginSuccess} />;
  }

  // If user has not completed onboarding, enforce the guided flow
  if (!activeUser.onboardingComplete) {
    return (
      <div className="min-h-screen bg-[#101018] text-slate-100 flex items-center justify-center p-4">
        <OnboardingModal
          user={activeUser}
          onComplete={(completedUser) => {
            setActiveUser(completedUser);
            setCurrentTab(completedUser.role === 'girlfriend' ? 'cycle' : 'home');
          }}
        />
      </div>
    );
  }

  const isGirlfriend = activeUser.role === 'girlfriend';

  return (
    <div className="min-h-screen bg-[#101018] text-slate-100 flex flex-col">
      {/* Top Bar and Mobile Bottom Navigation */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeUser={activeUser}
        onLogout={handleLogout}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onOpenConnectModal={() => setShowConnectModal(true)}
      />

      <NotificationBanner
        user={activeUser}
        onNavigate={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1" key={partnerUpdateTick}>
        {/* Boyfriend Views */}
        {!isGirlfriend && (
          <>
            {currentTab === 'home' && (
              <DashboardView
                user={activeUser}
                onNavigate={(tab) => {
                  setCurrentTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSelectArticle={handleSelectArticleFromDashboard}
                onOpenNewReminder={handleOpenNewReminderWithPrefill}
                onOpenConnectModal={() => setShowConnectModal(true)}
              />
            )}

            {currentTab === 'support' && (
              <SupportView
                user={activeUser}
                onOpenNewReminder={handleOpenNewReminderWithPrefill}
              />
            )}

            {currentTab === 'reminders' && (
              <RemindersView
                user={activeUser}
                isAddModalOpen={reminderModalState.isOpen}
                prefillTitle={reminderModalState.prefillTitle}
                prefillCategory={reminderModalState.prefillCategory}
                onCloseAddModal={() =>
                  setReminderModalState({ isOpen: false, prefillTitle: undefined, prefillCategory: undefined })
                }
              />
            )}
          </>
        )}

        {/* Girlfriend Views */}
        {isGirlfriend && (
          <>
            {currentTab === 'cycle' && (
              <GirlfriendCycleTracker user={activeUser} />
            )}

            {currentTab === 'wishes' && (
              <GirlfriendPreferencesView
                user={activeUser}
                onOpenConnectModal={() => setShowConnectModal(true)}
              />
            )}

            {currentTab === 'partner' && (
              <div className="max-w-2xl mx-auto px-4 py-8">
                <PartnerConnectModal
                  user={activeUser}
                  onClose={() => setCurrentTab('cycle')}
                  onConnectionChange={() => setPartnerUpdateTick((t) => t + 1)}
                />
              </div>
            )}
          </>
        )}

        {/* Shared Views (Available to both roles) */}
        {currentTab === 'chat' && (
          <CycleAssistantChat user={activeUser} />
        )}

        {currentTab === 'learn' && (
          <LearnView
            user={activeUser}
            initialArticleId={targetArticleId}
            onClearInitialArticle={() => setTargetArticleId(null)}
            onOpenStudyArticle={handleOpenStudyArticle}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            user={activeUser}
            onUpdateUser={handleUpdateUser}
            onLogout={handleLogout}
            isDark={isDark}
            onToggleTheme={handleToggleTheme}
            onOpenConnectModal={() => setShowConnectModal(true)}
          />
        )}
      </main>

      {/* Partner Connection Modal (can be triggered anywhere) */}
      {showConnectModal && (
        <PartnerConnectModal
          user={activeUser}
          onClose={() => setShowConnectModal(false)}
          onConnectionChange={() => setPartnerUpdateTick((t) => t + 1)}
        />
      )}
    </div>
  );
}
