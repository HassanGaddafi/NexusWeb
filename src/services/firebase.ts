/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { GraphSettings, HistoryItem, Network, Website } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore with specific databaseId if provided
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export interface UserCloudData {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  websites: Website[];
  networks: Network[];
  settings: GraphSettings;
  history: HistoryItem[];
  updatedAt: string;
}

// Authentication Helpers
export async function loginWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function loginWithEmail(email: string, password: string): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function registerWithEmail(
  email: string,
  password: string,
  displayName?: string
): Promise<User> {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName && result.user) {
    try {
      await updateProfile(result.user, { displayName });
    } catch (e) {
      console.warn('Failed to set displayName on profile:', e);
    }
  }
  return result.user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

// Firestore Data Operations
export async function fetchUserData(userId: string): Promise<UserCloudData | null> {
  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as UserCloudData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user data from Firestore:', error);
    return null;
  }
}

export async function saveUserDataToCloud(
  userId: string,
  data: {
    websites: Website[];
    networks: Network[];
    settings: GraphSettings;
    history: HistoryItem[];
  },
  userInfo?: { email?: string | null; displayName?: string | null; photoURL?: string | null }
): Promise<boolean> {
  try {
    const userDocRef = doc(db, 'users', userId);
    const payload: UserCloudData = {
      uid: userId,
      email: userInfo?.email || auth.currentUser?.email || null,
      displayName: userInfo?.displayName || auth.currentUser?.displayName || null,
      photoURL: userInfo?.photoURL || auth.currentUser?.photoURL || null,
      websites: data.websites,
      networks: data.networks,
      settings: data.settings,
      history: data.history,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(userDocRef, payload, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving user data to Firestore:', error);
    return false;
  }
}

export function subscribeToUserData(
  userId: string,
  onData: (data: UserCloudData) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const userDocRef = doc(db, 'users', userId);
  return onSnapshot(
    userDocRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onData(snapshot.data() as UserCloudData);
      }
    },
    (error) => {
      console.warn('Firestore real-time subscription error:', error);
      if (onError) onError(error);
    }
  );
}
