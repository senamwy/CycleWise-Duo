import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createPartnerInvitation,
  acceptPartnerInvitation,
  getPartnerConnectionForUser,
  getSharingPermissions,
  updateSharingPermissions,
  getSharedPartnerDataForBoyfriend,
  disconnectPartner,
  saveCycleEntry,
  saveGirlfriendPreferences
} from './storage';
import { User } from '../types';

// Mock localStorage for node test environment
const memoryStore = new Map<string, string>();
(globalThis as any).localStorage = {
  getItem: (k: string) => memoryStore.get(k) ?? null,
  setItem: (k: string, v: string) => memoryStore.set(k, v),
  removeItem: (k: string) => memoryStore.delete(k),
  clear: () => memoryStore.clear()
};

test('createPartnerInvitation generates unique CW-XXXX code', () => {
  const boyfriend: User = {
    id: 'test_bf_1',
    email: 'bf1@example.com',
    name: 'Ben',
    role: 'boyfriend',
    onboardingComplete: true,
    preferences: {} as any,
    createdAt: new Date().toISOString()
  };

  const inv = createPartnerInvitation(boyfriend);
  assert.ok(inv.code.startsWith('CW-'));
  assert.equal(inv.inviterId, 'test_bf_1');
  assert.equal(inv.status, 'pending');
});

test('acceptPartnerInvitation creates connection and initializes privacy-by-default', () => {
  const boyfriend: User = {
    id: 'test_bf_2',
    email: 'bf2@example.com',
    name: 'Leo',
    role: 'boyfriend',
    onboardingComplete: true,
    preferences: {} as any,
    createdAt: new Date().toISOString()
  };

  const girlfriend: User = {
    id: 'test_gf_2',
    email: 'gf2@example.com',
    name: 'Sarah',
    role: 'girlfriend',
    onboardingComplete: true,
    preferences: {} as any,
    createdAt: new Date().toISOString()
  };

  const inv = createPartnerInvitation(boyfriend);
  const conn = acceptPartnerInvitation(inv.code, girlfriend);

  assert.equal(conn.status, 'connected');
  assert.equal(conn.boyfriendId, 'test_bf_2');
  assert.equal(conn.girlfriendId, 'test_gf_2');

  // Verify privacy by default: all permissions MUST be false initially
  const perms = getSharingPermissions(conn.id, girlfriend.id);
  assert.equal(perms.shareGeneralPhase, false);
  assert.equal(perms.shareApproximateNextPeriod, false);
  assert.equal(perms.shareSelectedSymptoms, false);
  assert.equal(perms.shareSupportPreferences, false);
  assert.equal(perms.sharePrivateNotes, false);

  // Boyfriend queries shared data: must have hasAnySharedData = false!
  const sharedBefore = getSharedPartnerDataForBoyfriend(boyfriend.id);
  assert.ok(sharedBefore !== null);
  assert.equal(sharedBefore.hasAnySharedData, false);
  assert.equal(sharedBefore.cycleStatus, undefined);
  assert.equal(sharedBefore.symptoms, undefined);
});

test('granting and revoking consent works immediately in real-time', () => {
  const bfId = 'test_bf_2';
  const gfId = 'test_gf_2';
  const conn = getPartnerConnectionForUser(bfId);
  assert.ok(conn !== null);

  // Girlfriend logs a cycle entry starting today (Day 1 -> Menstruation)
  const todayStr = new Date().toISOString().split('T')[0];
  saveCycleEntry(gfId, {
    startDate: todayStr,
    cycleLengthDays: 28,
    periodLengthDays: 5,
    symptoms: ['cramps', 'fatigue'],
    notes: 'Geheime persönliche Notiz'
  });

  saveGirlfriendPreferences(gfId, ['Mag Wärmflasche', 'Braucht Ruhe'], 'Lieblings-Kuchen backen');

  // Girlfriend grants permission ONLY for general cycle phase and support preferences
  updateSharingPermissions({
    connectionId: conn.id,
    girlfriendId: gfId,
    shareGeneralPhase: true,
    shareApproximateNextPeriod: false,
    shareSelectedSymptoms: false, // NOT shared
    shareSupportPreferences: true, // SHARED
    sharePrivateNotes: false, // NOT shared
    updatedAt: new Date().toISOString()
  });

  // Boyfriend views data
  const shared = getSharedPartnerDataForBoyfriend(bfId);
  assert.ok(shared !== null);
  assert.equal(shared.hasAnySharedData, true);
  assert.ok(shared.cycleStatus !== undefined);
  assert.equal(shared.cycleStatus?.phaseName, 'Menstruation');
  // Approximate next period was not allowed:
  assert.equal(shared.cycleStatus?.nextPeriodDate, '');
  // Symptoms not allowed:
  assert.equal(shared.symptoms, undefined);
  // Private notes not allowed:
  assert.equal(shared.notes, undefined);
  // Preferences allowed:
  assert.ok(shared.preferences !== undefined);
  assert.equal(shared.preferences?.length, 2);
  assert.equal(shared.customWish, 'Lieblings-Kuchen backen');

  // Now girlfriend revokes ALL permissions:
  updateSharingPermissions({
    connectionId: conn.id,
    girlfriendId: gfId,
    shareGeneralPhase: false,
    shareApproximateNextPeriod: false,
    shareSelectedSymptoms: false,
    shareSupportPreferences: false,
    sharePrivateNotes: false,
    updatedAt: new Date().toISOString()
  });

  const sharedRevoked = getSharedPartnerDataForBoyfriend(bfId);
  assert.ok(sharedRevoked !== null);
  assert.equal(sharedRevoked.hasAnySharedData, false);
  assert.equal(sharedRevoked.cycleStatus, undefined);
  assert.equal(sharedRevoked.preferences, undefined);
});

test('disconnectPartner immediately terminates partner view access', () => {
  const bfId = 'test_bf_2';
  disconnectPartner(bfId);

  const shared = getSharedPartnerDataForBoyfriend(bfId);
  assert.equal(shared, null);
});
