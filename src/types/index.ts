/**
 * CycleWise Duo - Data Models and Type Definitions
 * Phase 1: Complete Boyfriend-Focused MVP
 * Extensible for Phase 2 (Partner Connection & Private Cycle Tracking)
 */

export type UserRole = 'boyfriend' | 'girlfriend';

export interface UserPreferences {
  language: 'de' | 'en';
  relationshipGoals: string[];
  areasToImprove: string[];
  communicationStyle: string;
  reminderFrequency: 'daily' | 'weekly' | 'occasional';
  theme: 'dark' | 'light';
  partnerName?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  partnerId?: string | null;
  onboardingComplete: boolean;
  preferences: UserPreferences;
  createdAt: string;
}

export type ArticleCategory = 'basics' | 'phases' | 'symptoms' | 'communication' | 'myths';

export interface EducationArticle {
  id: string;
  title: string;
  category: ArticleCategory;
  categoryLabel: string;
  readingTimeMinutes: number;
  summary: string;
  phaseNumber?: number; // 1: Menstruation, 2: Follicular, 3: Ovulation, 4: Luteal
  phaseDays?: string;
  sections: {
    heading: string;
    body: string;
    bulletPoints?: string[];
    boyfriendTip?: string;
  }[];
  keyTakeaways: string[];
  isFeatured?: boolean;
}

export interface EducationProgress {
  userId: string;
  articleId: string;
  completedAt: string;
  isFavorite?: boolean;
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  takeaway: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  questions: QuizQuestion[];
}

export interface QuizResult {
  userId: string;
  quizId: string;
  score: number;
  total: number;
  completedAt: string;
}

export type SupportCategory = 'gesture' | 'listening' | 'practical' | 'comfort' | 'appreciation';

export interface SupportSuggestion {
  id: string;
  title: string;
  category: SupportCategory;
  categoryLabel: string;
  description: string;
  iconName: string;
  timeToExecute: string;
  whyItHelps: string;
}

export interface CustomSupportIdea {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: SupportCategory;
  createdAt: string;
}

export type ReminderCategory = 'date' | 'occasion' | 'gesture' | 'household' | 'goals' | 'personal';

export interface PersonalReminder {
  id: string;
  userId: string;
  title: string;
  category: ReminderCategory;
  categoryLabel: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:MM
  recurring: 'none' | 'daily' | 'weekly' | 'monthly';
  notes?: string;
  isCompleted: boolean;
  createdAt: string;
}

// Phase 2: Girlfriend Companion, Private Cycle Tracker & Consent Management
export interface CycleEntry {
  id: string;
  userId: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  cycleLengthDays: number; // e.g. 28
  periodLengthDays: number; // e.g. 5
  symptoms: string[]; // e.g. 'cramps', 'headache', 'fatigue', 'bloating', 'breast_tenderness'
  mood?: string; // 'calm' | 'sensitive' | 'energetic' | 'exhausted' | 'irritable'
  energyLevel?: 'low' | 'medium' | 'high';
  sleepQuality?: 'poor' | 'fair' | 'good';
  notes?: string;
  updatedAt: string;
}

export interface GirlfriendSupportPreferences {
  userId: string;
  preferences: string[];
  customWish?: string;
  updatedAt: string;
}

export interface PartnerInvitation {
  id: string;
  code: string; // e.g. "CW-4892"
  inviterId: string;
  inviterName: string;
  inviterEmail: string;
  inviterRole: UserRole;
  createdAt: string;
  status: 'pending' | 'accepted' | 'expired';
}

export interface PartnerConnection {
  id: string;
  boyfriendId: string;
  boyfriendName: string;
  girlfriendId: string;
  girlfriendName: string;
  status: 'connected' | 'disconnected';
  createdAt: string;
}

export interface SharingPermissions {
  connectionId: string;
  girlfriendId: string;
  // All sensitive permissions default strictly to FALSE
  shareGeneralPhase: boolean;
  shareApproximateNextPeriod: boolean;
  shareSelectedSymptoms: boolean;
  shareSupportPreferences: boolean;
  sharePrivateNotes: boolean;
  updatedAt: string;
}

export interface CalculatedCycleStatus {
  currentDay: number;
  phaseNumber: number; // 1: Menstruation, 2: Follicular, 3: Ovulation, 4: Luteal
  phaseName: string;
  phaseSeason: string;
  nextPeriodDate: string;
  daysUntilNextPeriod: number;
  uncertaintyDisclaimer: string;
}

// Scientific Research & Peer-Reviewed Evidence Models
export type ScientificDomain = 
  | 'hormones_brain' 
  | 'pain_physiology' 
  | 'sleep_circadian' 
  | 'metabolism_nutrition' 
  | 'psychology_empathy';

export interface ScientificStudy {
  id: string;
  title: string;
  shortTitle: string;
  domain: ScientificDomain;
  domainLabel: string;
  journal: string;
  year: number;
  authors: string;
  doi?: string;
  pmid?: string;
  externalUrl: string;
  evidenceLevel: 'Randomized Controlled Trial (RCT)' | 'Systematische Meta-Analyse' | 'Klinische Kohortenstudie' | 'Neurobiologische MRT-Studie' | 'Cochrane Review';
  sampleSize: string;
  keyFinding: string;
  biologicalMechanism: string;
  practicalTakeaway: string;
  tags: string[];
  // Rich study reading & website fields
  fullAbstract?: {
    background: string;
    methods: string;
    results: string;
    conclusions: string;
  };
  fullMethodology?: string;
  detailedResults?: string;
  studyLimitations?: string;
  meshTerms?: string[];
  citationApa?: string;
  citationBibtex?: string;
  citationVancouver?: string;
  figuresOrStats?: {
    label: string;
    value: string;
    description: string;
  }[];
}

export interface HormonePathway {
  id: string;
  name: string;
  chemicalName: string;
  origin: string;
  targetReceptors: string[];
  primaryFunction: string;
  cycleBehavior: string;
  scientificFact: string;
  accentColor: string;
}

export interface ScientificMythbuster {
  id: string;
  myth: string;
  scientificFact: string;
  studyCitation: string;
  biologicalExplanation: string;
}

export interface EuropePmcArticle {
  id: string;
  title: string;
  authorString: string;
  journalTitle?: string;
  pubYear?: string;
  doi?: string;
  pmid?: string;
  citedByCount?: number;
  isOpenAccess?: string;
}

