import type { Campaign, CampaignRepository } from "./types";
import { getSafeFirestore } from '../../firebase';

async function firestoreModule() {
  const [database, firestore] = await Promise.all([
    getSafeFirestore(),
    import('firebase/firestore'),
  ]);
  if (!database) throw new Error('Firebase is not configured');
  return { database, firestore };
}

export class FirestoreCampaignRepository implements CampaignRepository {
  private collectionName = "campaigns";

  async getAll(): Promise<Campaign[]> {
    const { database, firestore } = await firestoreModule();
    const querySnapshot = await firestore.getDocs(firestore.collection(database, this.collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Campaign));
  }

  async getById(id: string): Promise<Campaign | null> {
    const { database, firestore } = await firestoreModule();
    const docRef = firestore.doc(database, this.collectionName, id);
    const docSnap = await firestore.getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Campaign;
    }
    return null;
  }

  async create(campaign: Omit<Campaign, 'id'>): Promise<Campaign> {
    const { database, firestore } = await firestoreModule();
    return await firestore.runTransaction(database, async (transaction) => {
      const docRef = firestore.doc(firestore.collection(database, this.collectionName));
      transaction.set(docRef, campaign);
      return { id: docRef.id, ...campaign };
    });
  }

  async update(id: string, campaign: Partial<Campaign>): Promise<void> {
    const { database, firestore } = await firestoreModule();
    await firestore.runTransaction(database, async (transaction) => {
      const docRef = firestore.doc(database, this.collectionName, id);
      transaction.update(docRef, campaign);
    });
  }

  async delete(id: string): Promise<void> {
    const { database, firestore } = await firestoreModule();
    const docRef = firestore.doc(database, this.collectionName, id);
    await firestore.deleteDoc(docRef);
  }
}
