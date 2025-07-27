import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Sign Up and create user profile in Firestore
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    // Create a user document in the 'users' collection
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      createdAt: new Date(),
      carbonFootprintEntries: [],
    });
    return { user };
  } catch (error) {
    return { error };
  }
};

// Sign In
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user };
  } catch (error) {
    return { error };
  }
};

// Password Reset
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {};
  } catch (error) {
    return { error };
  }
};

// Sign Out
export const userSignOut = async () => {
  try {
    await signOut(auth);
    return {};
  } catch (error) {
    return { error };
  }
};

export const logActivity = async (userId, activityData) => {
  try {
    const activityRef = collection(db, 'users', userId, 'activities');
    await addDoc(activityRef, {
      ...activityData,
      createdAt: serverTimestamp(),
    });
    return {};
  } catch (error) {
    console.error("Error logging activity: ", error);
    return { error };
  }
};