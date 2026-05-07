/**
 * Server-side Firestore repository using firebase-admin SDK.
 * Use this in server.ts (Node.js context) instead of FirestoreCampaignRepository
 * which uses the client SDK and relies on import.meta.env (Vite-only).
 */
import admin from 'firebase-admin';
import type { Campaign, CampaignRepository } from './types';

function getAdminDb(): FirebaseFirestore.Firestore {
  if (!admin.apps.length) {
    const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!key) throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not set');
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(key)) });
  }
  return admin.firestore();
}

export class AdminFirestoreCampaignRepository implements CampaignRepository {
  private get db() { return getAdminDb(); }
  private get col() { return this.db.collection('campaigns'); }

  async getAll(): Promise<Campaign[]> {
    try {
      const snap = await this.col.orderBy('createdAt', 'desc').get();
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Campaign));
    } catch {
      return [];
    }
  }

  async getByUserId(userId: string): Promise<Campaign[]> {
    try {
      const snap = await this.col
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Campaign));
    } catch {
      return [];
    }
  }

  async getById(id: string): Promise<Campaign | null> {
    try {
      const docSnap = await this.col.doc(id).get();
      return docSnap.exists ? { id: docSnap.id, ...docSnap.data() } as Campaign : null;
    } catch {
      return null;
    }
  }

  async create(campaign: Omit<Campaign, 'id'>): Promise<Campaign> {
    const data = { ...campaign, createdAt: campaign.createdAt || new Date().toISOString() };
    const ref = await this.col.add(data);
    return { id: ref.id, ...data } as Campaign;
  }

  async update(id: string, campaign: Partial<Campaign>): Promise<void> {
    await this.col.doc(id).update({ ...campaign, updatedAt: new Date().toISOString() });
  }

  async delete(id: string): Promise<void> {
    await this.col.doc(id).delete();
  }
}

export { getAdminDb };
