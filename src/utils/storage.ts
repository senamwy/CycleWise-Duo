import {
  User,
  UserPreferences,
  UserRole,
  PersonalReminder,
  CustomSupportIdea,
  QuizResult,
  CycleEntry,
  GirlfriendSupportPreferences,
  PartnerInvitation,
  PartnerConnection,
  SharingPermissions,
  CalculatedCycleStatus
} from '../types';
import { calculateCycleStatus, GIRLFRIEND_DEFAULT_PREFERENCES } from './cycleCalculations';
import { localDateStringFromToday, toLocalDateString } from './dateUtils';

const STORAGE_KEYS = {
  USERS: 'cyclewise_users',
  ACTIVE_USER_ID: 'cyclewise_active_user_id',
  THEME: 'cyclewise_theme',
  INVITATIONS: 'cyclewise_partner_invitations',
  CONNECTIONS: 'cyclewise_partner_connections',
};

const DEFAULT_PREFERENCES: UserPreferences = {
  language: 'de',
  relationshipGoals: [
    'Ihren Zyklus besser verstehen',
    'Aufmerksamer und feinfühliger im Alltag sein',
    'Bessere Kommunikation ohne Vorurteile',
    'Praktische Entlastung bei Beschwerden'
  ],
  areasToImprove: [
    'Zuhören ohne sofortige Ratschläge',
    'Wichtige Anlässe und Termine nicht vergessen',
    'Kleine Gesten im Alltag etablieren'
  ],
  communicationStyle: 'Einfühlsam & Direkt',
  reminderFrequency: 'daily',
  theme: 'dark',
  partnerName: 'Sarah'
};

const SEED_BOYFRIEND: User = {
  id: 'usr_boyfriend_demo',
  email: 'leo@cyclewise.app',
  name: 'Leo',
  role: 'boyfriend',
  onboardingComplete: true,
  preferences: DEFAULT_PREFERENCES,
  createdAt: new Date().toISOString()
};

const SEED_GIRLFRIEND: User = {
  id: 'usr_girlfriend_demo',
  email: 'sarah@cyclewise.app',
  name: 'Sarah',
  role: 'girlfriend',
  onboardingComplete: true,
  preferences: {
    ...DEFAULT_PREFERENCES,
    partnerName: 'Leo'
  },
  createdAt: new Date().toISOString()
};

const SEED_REMINDERS: PersonalReminder[] = [
  {
    id: 'rem-1',
    userId: 'usr_boyfriend_demo',
    title: 'Wärmflasche & Kräutertee vorbereiten',
    category: 'gesture',
    categoryLabel: 'Kleine Geste',
    dueDate: localDateStringFromToday(1),
    dueTime: '19:30',
    recurring: 'none',
    notes: 'Kamillentee aus dem Schrank, sanfte Musik einschalten',
    isCompleted: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'rem-2',
    userId: 'usr_boyfriend_demo',
    title: 'Abendessen planen: Eisenreiche Gemüsesuppe',
    category: 'household',
    categoryLabel: 'Haushalt & Entlastung',
    dueDate: localDateStringFromToday(2),
    dueTime: '18:00',
    recurring: 'weekly',
    notes: 'Frisches Gemüse auf dem Heimweg besorgen',
    isCompleted: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'rem-3',
    userId: 'usr_boyfriend_demo',
    title: 'Lieblingsblumen & Schokolade besorgen',
    category: 'gesture',
    categoryLabel: 'Kleine Geste',
    dueDate: toLocalDateString(),
    dueTime: '17:00',
    recurring: 'none',
    notes: 'Dunkle Schokolade 75% + weiße Tulpen',
    isCompleted: true,
    createdAt: new Date().toISOString()
  }
];

const SEED_FAVORITES: string[] = ['sug-hot-water-bottle', 'sug-tea', 'sug-listen-no-fix'];

const SEED_CUSTOM_IDEAS: CustomSupportIdea[] = [
  {
    id: 'custom-1',
    userId: 'usr_boyfriend_demo',
    title: 'Gemeinsamer Spaziergang im Park ohne Handy',
    description: '30 Minuten an der frischen Luft spazieren, einfach die Hand halten und durchatmen.',
    category: 'comfort',
    createdAt: new Date().toISOString()
  }
];

function getLocalStorage(): Storage | null {
  if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) return (globalThis as any).localStorage;
  return null;
}

function getStorageItem(key: string): string | null {
  const storage = getLocalStorage();
  return storage ? storage.getItem(key) : null;
}

function setStorageItem(key: string, value: string): void {
  const storage = getLocalStorage();
  if (storage) storage.setItem(key, value);
}

function removeStorageItem(key: string): void {
  const storage = getLocalStorage();
  if (storage) storage.removeItem(key);
}

// Ensure seed data exists for demo/test purposes
export function initializeStorage(): void {
  const users = getAllUsers();
  if (users.length === 0) {
    saveUser(SEED_BOYFRIEND);
    saveUser(SEED_GIRLFRIEND);

    // Seed boyfriend data
    setReminders(SEED_BOYFRIEND.id, SEED_REMINDERS);
    setFavorites(SEED_BOYFRIEND.id, SEED_FAVORITES);
    setCustomIdeas(SEED_BOYFRIEND.id, SEED_CUSTOM_IDEAS);
    saveReadArticle(SEED_BOYFRIEND.id, 'cycle-basics');
    saveReadArticle(SEED_BOYFRIEND.id, 'phase-1-menstruation');
    saveQuizResult({
      userId: SEED_BOYFRIEND.id,
      quizId: 'quiz-basics',
      score: 3,
      total: 3,
      completedAt: new Date().toISOString()
    });

    // Seed girlfriend with 4 historical cycles to demonstrate statistical 80%+ prediction
    const cycle1Start = localDateStringFromToday(-87);
    const cycle2Start = localDateStringFromToday(-60);
    const cycle3Start = localDateStringFromToday(-31);
    const cycle4Start = localDateStringFromToday(-3);

    saveCycleEntry(SEED_GIRLFRIEND.id, {
      startDate: cycle1Start,
      cycleLengthDays: 27,
      periodLengthDays: 4,
      symptoms: ['cramps', 'bloating'],
      mood: 'calm',
      energyLevel: 'medium',
      sleepQuality: 'good',
      notes: 'Sanfter Einstieg, wenig Schmerzen.'
    });

    saveCycleEntry(SEED_GIRLFRIEND.id, {
      startDate: cycle2Start,
      cycleLengthDays: 29,
      periodLengthDays: 5,
      symptoms: ['fatigue', 'headache'],
      mood: 'sensitive',
      energyLevel: 'low',
      sleepQuality: 'poor',
      notes: 'Stressige Arbeitswoche hat Periode um 1 Tag verschoben.'
    });

    saveCycleEntry(SEED_GIRLFRIEND.id, {
      startDate: cycle3Start,
      cycleLengthDays: 28,
      periodLengthDays: 5,
      symptoms: ['cramps', 'sweet_cravings'],
      mood: 'sensitive',
      energyLevel: 'medium',
      sleepQuality: 'fair',
      notes: 'Magnesium und warmes Bad haben sehr gut getan.'
    });

    saveCycleEntry(SEED_GIRLFRIEND.id, {
      startDate: cycle4Start,
      cycleLengthDays: 28,
      periodLengthDays: 5,
      symptoms: ['cramps', 'fatigue'],
      mood: 'sensitive',
      energyLevel: 'low',
      sleepQuality: 'fair',
      notes: 'Wärmflasche tut gerade besonders gut.'
    });

    // Seed girlfriend support preferences
    saveGirlfriendPreferences(
      SEED_GIRLFRIEND.id,
      [
        'Ich schätze eine warme Tasse Tee ohne ständiges Fragen',
        'Hilfe bei alltäglichen Aufgaben (z.B. Kochen, Küche) entlastet mich',
        'Ich brauche manchmal einfach Ruhe und Zeit für mich'
      ],
      'Abends gerne eine ruhige Serie schauen ohne langes Planen'
    );
  }
}

// User Authentication and Profiles
export function getAllUsers(): User[] {
  try {
    const raw = getStorageItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveUser(user: User): void {
  const users = getAllUsers();
  const index = users.findIndex((u) => u.id === user.id);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  setStorageItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function getActiveUserId(): string | null {
  return getStorageItem(STORAGE_KEYS.ACTIVE_USER_ID);
}

export function setActiveUserId(userId: string | null): void {
  if (userId) {
    setStorageItem(STORAGE_KEYS.ACTIVE_USER_ID, userId);
  } else {
    removeStorageItem(STORAGE_KEYS.ACTIVE_USER_ID);
  }
}

export function getActiveUser(): User | null {
  const id = getActiveUserId();
  if (!id) return null;
  const users = getAllUsers();
  return users.find((u) => u.id === id) || null;
}

export function registerUser(
  email: string,
  name: string,
  password?: string,
  role: UserRole = 'boyfriend'
): User {
  const users = getAllUsers();
  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    throw new Error('Ein Konto mit dieser E-Mail existiert bereits.');
  }

  const newUser: User = {
    id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    email: email.trim(),
    name: name.trim(),
    role,
    onboardingComplete: false,
    preferences: {
      ...DEFAULT_PREFERENCES,
      partnerName: ''
    },
    createdAt: new Date().toISOString()
  };

  saveUser(newUser);
  setActiveUserId(newUser.id);
  return newUser;
}

export function loginUser(email: string, password?: string): User {
  const users = getAllUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user) {
    throw new Error('Kein Benutzer mit dieser E-Mail gefunden.');
  }
  setActiveUserId(user.id);
  return user;
}

export function logoutUser(): void {
  setActiveUserId(null);
}

// Reminders
export function getReminders(userId: string): PersonalReminder[] {
  try {
    const raw = getStorageItem(`cyclewise_reminders_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setReminders(userId: string, reminders: PersonalReminder[]): void {
  setStorageItem(`cyclewise_reminders_${userId}`, JSON.stringify(reminders));
}

export function addReminder(
  userId: string,
  reminder: Omit<PersonalReminder, 'id' | 'userId' | 'createdAt'>
): PersonalReminder {
  const current = getReminders(userId);
  const newReminder: PersonalReminder = {
    ...reminder,
    id: `rem_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    userId,
    createdAt: new Date().toISOString()
  };
  const updated = [newReminder, ...current];
  setReminders(userId, updated);
  return newReminder;
}

export function updateReminder(userId: string, updatedReminder: PersonalReminder): void {
  const current = getReminders(userId);
  const updated = current.map((r) => (r.id === updatedReminder.id ? updatedReminder : r));
  setReminders(userId, updated);
}

export function deleteReminder(userId: string, reminderId: string): void {
  const current = getReminders(userId);
  const updated = current.filter((r) => r.id !== reminderId);
  setReminders(userId, updated);
}

// Favorites
export function getFavorites(userId: string): string[] {
  try {
    const raw = getStorageItem(`cyclewise_favorites_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setFavorites(userId: string, favorites: string[]): void {
  setStorageItem(`cyclewise_favorites_${userId}`, JSON.stringify(favorites));
}

export function toggleFavorite(userId: string, suggestionId: string): boolean {
  const current = getFavorites(userId);
  const exists = current.includes(suggestionId);
  const updated = exists ? current.filter((id) => id !== suggestionId) : [...current, suggestionId];
  setFavorites(userId, updated);
  return !exists;
}

// Custom Support Ideas
export function getCustomIdeas(userId: string): CustomSupportIdea[] {
  try {
    const raw = getStorageItem(`cyclewise_custom_ideas_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setCustomIdeas(userId: string, ideas: CustomSupportIdea[]): void {
  setStorageItem(`cyclewise_custom_ideas_${userId}`, JSON.stringify(ideas));
}

export function addCustomIdea(
  userId: string,
  idea: Omit<CustomSupportIdea, 'id' | 'userId' | 'createdAt'>
): CustomSupportIdea {
  const current = getCustomIdeas(userId);
  const newIdea: CustomSupportIdea = {
    ...idea,
    id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    userId,
    createdAt: new Date().toISOString()
  };
  setCustomIdeas(userId, [newIdea, ...current]);
  return newIdea;
}

export function deleteCustomIdea(userId: string, ideaId: string): void {
  const current = getCustomIdeas(userId);
  setCustomIdeas(userId, current.filter((i) => i.id !== ideaId));
}

// Education Progress
export function getReadArticles(userId: string): string[] {
  try {
    const raw = getStorageItem(`cyclewise_read_articles_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveReadArticle(userId: string, articleId: string): void {
  const current = getReadArticles(userId);
  if (!current.includes(articleId)) {
    setStorageItem(`cyclewise_read_articles_${userId}`, JSON.stringify([...current, articleId]));
  }
}

export function toggleReadArticle(userId: string, articleId: string): boolean {
  const current = getReadArticles(userId);
  const exists = current.includes(articleId);
  const updated = exists ? current.filter((id) => id !== articleId) : [...current, articleId];
  setStorageItem(`cyclewise_read_articles_${userId}`, JSON.stringify(updated));
  return !exists;
}

// Quizzes
export function getQuizResults(userId: string): QuizResult[] {
  try {
    const raw = getStorageItem(`cyclewise_quiz_results_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveQuizResult(result: QuizResult): void {
  const current = getQuizResults(result.userId);
  const filtered = current.filter((r) => r.quizId !== result.quizId);
  setStorageItem(`cyclewise_quiz_results_${result.userId}`, JSON.stringify([...filtered, result]));
}

// Completed daily suggestions tracking
export function getCompletedSuggestions(userId: string, dateStr: string): string[] {
  try {
    const raw = getStorageItem(`cyclewise_completed_sug_${userId}_${dateStr}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleCompletedSuggestion(userId: string, dateStr: string, suggestionId: string): boolean {
  const current = getCompletedSuggestions(userId, dateStr);
  const exists = current.includes(suggestionId);
  const updated = exists ? current.filter((id) => id !== suggestionId) : [...current, suggestionId];
  setStorageItem(`cyclewise_completed_sug_${userId}_${dateStr}`, JSON.stringify(updated));
  return !exists;
}

// -------------------------------------------------------------
// PHASE 2: PRIVATE CYCLE TRACKING & JOURNAL (Strictly User-Owned)
// -------------------------------------------------------------

export function getCycleEntries(userId: string): CycleEntry[] {
  try {
    const raw = getStorageItem(`cyclewise_cycles_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getLatestCycleEntry(userId: string): CycleEntry | null {
  const entries = getCycleEntries(userId);
  if (entries.length === 0) return null;
  return entries.sort((a, b) => b.startDate.localeCompare(a.startDate))[0];
}

export function saveCycleEntry(
  userId: string,
  entry: Omit<CycleEntry, 'id' | 'userId' | 'updatedAt'>
): CycleEntry {
  const current = getCycleEntries(userId);
  const newEntry: CycleEntry = {
    ...entry,
    id: `cycle_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    userId,
    updatedAt: new Date().toISOString()
  };
  const updated = [newEntry, ...current];
  setStorageItem(`cyclewise_cycles_${userId}`, JSON.stringify(updated));
  return newEntry;
}

export function deleteCycleEntry(userId: string, entryId: string): void {
  const current = getCycleEntries(userId);
  const updated = current.filter((e) => e.id !== entryId);
  setStorageItem(`cyclewise_cycles_${userId}`, JSON.stringify(updated));
}

/**
 * Seeds a realistic set of 4 historical cycles for any user (e.g. for testing predictions).
 */
export function seedSampleHistoricalCycles(userId: string): CycleEntry[] {
  const sampleData = [
    {
      startDate: localDateStringFromToday(-87),
      cycleLengthDays: 27,
      periodLengthDays: 4,
      symptoms: ['cramps', 'bloating'],
      mood: 'calm',
      energyLevel: 'medium' as const,
      sleepQuality: 'good' as const,
      notes: 'Sanfter Zyklusbeginn.'
    },
    {
      startDate: localDateStringFromToday(-60),
      cycleLengthDays: 29,
      periodLengthDays: 5,
      symptoms: ['fatigue', 'headache'],
      mood: 'sensitive',
      energyLevel: 'low' as const,
      sleepQuality: 'poor' as const,
      notes: 'Stress in der Prüfungsphase.'
    },
    {
      startDate: localDateStringFromToday(-31),
      cycleLengthDays: 28,
      periodLengthDays: 5,
      symptoms: ['cramps', 'sweet_cravings'],
      mood: 'sensitive',
      energyLevel: 'medium' as const,
      sleepQuality: 'fair' as const,
      notes: 'Viel Kräutertee getrunken.'
    },
    {
      startDate: localDateStringFromToday(-3),
      cycleLengthDays: 28,
      periodLengthDays: 5,
      symptoms: ['cramps', 'fatigue'],
      mood: 'sensitive',
      energyLevel: 'low' as const,
      sleepQuality: 'fair' as const,
      notes: 'Aktueller Zyklus, Tag 4.'
    }
  ];

  const created: CycleEntry[] = [];
  sampleData.forEach((s) => {
    created.push(saveCycleEntry(userId, s));
  });
  return getCycleEntries(userId);
}

// Girlfriend Support Preferences
export function getGirlfriendPreferences(userId: string): GirlfriendSupportPreferences {
  try {
    const raw = getStorageItem(`cyclewise_gf_prefs_${userId}`);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return {
    userId,
    preferences: GIRLFRIEND_DEFAULT_PREFERENCES.slice(0, 3),
    updatedAt: new Date().toISOString()
  };
}

export function saveGirlfriendPreferences(
  userId: string,
  preferences: string[],
  customWish?: string
): GirlfriendSupportPreferences {
  const payload: GirlfriendSupportPreferences = {
    userId,
    preferences,
    customWish: customWish?.trim() || undefined,
    updatedAt: new Date().toISOString()
  };
  setStorageItem(`cyclewise_gf_prefs_${userId}`, JSON.stringify(payload));
  return payload;
}

// -------------------------------------------------------------
// PHASE 2: PARTNER INVITATIONS & CONNECTION
// -------------------------------------------------------------

export function getAllInvitations(): PartnerInvitation[] {
  try {
    const raw = getStorageItem(STORAGE_KEYS.INVITATIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function createPartnerInvitation(inviter: User): PartnerInvitation {
  const invitations = getAllInvitations();
  // Generate friendly 6-char code e.g. "CW-9412"
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const code = `CW-${randomNum}`;

  const newInvitation: PartnerInvitation = {
    id: `inv_${Date.now()}`,
    code,
    inviterId: inviter.id,
    inviterName: inviter.name,
    inviterEmail: inviter.email,
    inviterRole: inviter.role,
    createdAt: new Date().toISOString(),
    status: 'pending'
  };

  invitations.push(newInvitation);
  setStorageItem(STORAGE_KEYS.INVITATIONS, JSON.stringify(invitations));
  return newInvitation;
}

export function getInvitationByCode(code: string): PartnerInvitation | null {
  const invitations = getAllInvitations();
  const clean = code.trim().toUpperCase();
  return invitations.find((inv) => inv.code.toUpperCase() === clean && inv.status === 'pending') || null;
}

export function getAllConnections(): PartnerConnection[] {
  try {
    const raw = getStorageItem(STORAGE_KEYS.CONNECTIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getPartnerConnectionForUser(userId: string): PartnerConnection | null {
  const connections = getAllConnections();
  return (
    connections.find(
      (c) =>
        (c.boyfriendId === userId || c.girlfriendId === userId) && c.status === 'connected'
    ) || null
  );
}

export function acceptPartnerInvitation(
  invitationCode: string,
  acceptingUser: User
): PartnerConnection {
  const invitations = getAllInvitations();
  const clean = invitationCode.trim().toUpperCase();
  const invIndex = invitations.findIndex(
    (inv) => inv.code.toUpperCase() === clean && inv.status === 'pending'
  );

  if (invIndex === -1) {
    throw new Error('Ungültiger oder bereits abgelaufener Einladungscode.');
  }

  const invitation = invitations[invIndex];

  if (invitation.inviterId === acceptingUser.id) {
    throw new Error('Du kannst deinen eigenen Einladungscode nicht selbst einlösen.');
  }

  // Determine roles
  let boyfriendId = '';
  let boyfriendName = '';
  let girlfriendId = '';
  let girlfriendName = '';

  if (invitation.inviterRole === 'boyfriend') {
    boyfriendId = invitation.inviterId;
    boyfriendName = invitation.inviterName;
    girlfriendId = acceptingUser.id;
    girlfriendName = acceptingUser.name;
  } else {
    girlfriendId = invitation.inviterId;
    girlfriendName = invitation.inviterName;
    boyfriendId = acceptingUser.id;
    boyfriendName = acceptingUser.name;
  }

  const newConnection: PartnerConnection = {
    id: `conn_${Date.now()}`,
    boyfriendId,
    boyfriendName,
    girlfriendId,
    girlfriendName,
    status: 'connected',
    createdAt: new Date().toISOString()
  };

  // Mark invitation as claimed
  invitations[invIndex].status = 'accepted';
  setStorageItem(STORAGE_KEYS.INVITATIONS, JSON.stringify(invitations));

  // Save connection
  const connections = getAllConnections().filter(
    (c) =>
      !(
        (c.boyfriendId === boyfriendId && c.girlfriendId === girlfriendId) ||
        (c.boyfriendId === girlfriendId && c.girlfriendId === boyfriendId)
      )
  );
  connections.push(newConnection);
  setStorageItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(connections));

  // Initialize sharing permissions with ALL SENSITIVE PERMISSIONS DEFAULTING TO FALSE
  getSharingPermissions(newConnection.id, girlfriendId);

  return newConnection;
}

export function disconnectPartner(userId: string): void {
  const connections = getAllConnections();
  const updated = connections.map((c) => {
    if ((c.boyfriendId === userId || c.girlfriendId === userId) && c.status === 'connected') {
      return { ...c, status: 'disconnected' as const };
    }
    return c;
  });
  setStorageItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(updated));
}

// -------------------------------------------------------------
// PHASE 2: GRANULAR CONSENT & SHARING PERMISSIONS
// -------------------------------------------------------------

export function getSharingPermissions(connectionId: string, girlfriendId: string): SharingPermissions {
  try {
    const raw = getStorageItem(`cyclewise_sharing_${connectionId}`);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }

  // PRIVACY BY DEFAULT: All sensitive permissions default to FALSE
  const defaultPerms: SharingPermissions = {
    connectionId,
    girlfriendId,
    shareGeneralPhase: false,
    shareApproximateNextPeriod: false,
    shareSelectedSymptoms: false,
    shareSupportPreferences: false,
    sharePrivateNotes: false,
    updatedAt: new Date().toISOString()
  };

  setStorageItem(`cyclewise_sharing_${connectionId}`, JSON.stringify(defaultPerms));
  return defaultPerms;
}

export function updateSharingPermissions(permissions: SharingPermissions): void {
  setStorageItem(
    `cyclewise_sharing_${permissions.connectionId}`,
    JSON.stringify({ ...permissions, updatedAt: new Date().toISOString() })
  );
}

// -------------------------------------------------------------
// PHASE 2: BOYFRIEND AUTHORIZED VIEW OF SHARED PARTNER DATA
// -------------------------------------------------------------

export function getSharedPartnerDataForBoyfriend(boyfriendId: string): {
  girlfriendName: string;
  cycleStatus?: CalculatedCycleStatus;
  symptoms?: string[];
  preferences?: string[];
  customWish?: string;
  notes?: string;
  hasAnySharedData: boolean;
  connectionId: string;
} | null {
  const connection = getPartnerConnectionForUser(boyfriendId);
  if (!connection || connection.status !== 'connected') {
    return null;
  }

  const permissions = getSharingPermissions(connection.id, connection.girlfriendId);
  const latestCycle = getLatestCycleEntry(connection.girlfriendId);
  const gfPreferences = getGirlfriendPreferences(connection.girlfriendId);

  let cycleStatus: CalculatedCycleStatus | undefined = undefined;
  if (permissions.shareGeneralPhase && latestCycle) {
    const calculated = calculateCycleStatus(
      latestCycle.startDate,
      latestCycle.cycleLengthDays,
      latestCycle.periodLengthDays
    );
    if (calculated) {
      cycleStatus = calculated;
      // If she did NOT share approximate next period, hide daysUntilNextPeriod and nextPeriodDate
      if (!permissions.shareApproximateNextPeriod) {
        cycleStatus = {
          ...cycleStatus,
          nextPeriodDate: '',
          daysUntilNextPeriod: -1
        };
      }
    }
  }

  const symptoms = permissions.shareSelectedSymptoms && latestCycle ? latestCycle.symptoms : undefined;
  const preferences = permissions.shareSupportPreferences ? gfPreferences.preferences : undefined;
  const customWish = permissions.shareSupportPreferences ? gfPreferences.customWish : undefined;
  const notes = permissions.sharePrivateNotes && latestCycle ? latestCycle.notes : undefined;

  const hasAnySharedData =
    Boolean(cycleStatus) ||
    Boolean(symptoms && symptoms.length > 0) ||
    Boolean(preferences && preferences.length > 0) ||
    Boolean(customWish) ||
    Boolean(notes);

  return {
    girlfriendName: connection.girlfriendName,
    cycleStatus,
    symptoms,
    preferences,
    customWish,
    notes,
    hasAnySharedData,
    connectionId: connection.id
  };
}

// GDPR: Data Export and Account Deletion
export function exportUserData(userId: string): string {
  const users = getAllUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error('Benutzer nicht gefunden.');

  const exportPayload = {
    exportDate: new Date().toISOString(),
    user,
    reminders: getReminders(userId),
    favorites: getFavorites(userId),
    customSupportIdeas: getCustomIdeas(userId),
    readArticles: getReadArticles(userId),
    quizResults: getQuizResults(userId),
    // Phase 2 additions:
    cycleEntries: getCycleEntries(userId),
    girlfriendPreferences: getGirlfriendPreferences(userId),
    partnerConnection: getPartnerConnectionForUser(userId)
  };

  return JSON.stringify(exportPayload, null, 2);
}

export function deleteUserAccount(userId: string): void {
  const users = getAllUsers();
  const updatedUsers = users.filter((u) => u.id !== userId);
  setStorageItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));

  // Disconnect any active partner connection first
  disconnectPartner(userId);

  removeStorageItem(`cyclewise_reminders_${userId}`);
  removeStorageItem(`cyclewise_favorites_${userId}`);
  removeStorageItem(`cyclewise_custom_ideas_${userId}`);
  removeStorageItem(`cyclewise_read_articles_${userId}`);
  removeStorageItem(`cyclewise_quiz_results_${userId}`);
  removeStorageItem(`cyclewise_cycles_${userId}`);
  removeStorageItem(`cyclewise_gf_prefs_${userId}`);

  if (getActiveUserId() === userId) {
    setActiveUserId(null);
  }
}
