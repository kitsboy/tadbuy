import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Placeholder configuration - will be updated once user provides real config
const firebaseConfig = {
  apiKey: "TODO_KEYHERE",
  authDomain: "TODO_AUTH_DOMAIN",
  projectId: "TODO_PROJECT_ID",
  appId: "TODO_APP_ID",
  firestoreDatabaseId: "TODO_FIRESTORE_DATABASE_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();
