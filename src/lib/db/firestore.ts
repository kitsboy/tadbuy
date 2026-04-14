import { db } from "../../firebase.ts";
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, runTransaction } from "firebase/firestore";
import { Campaign, CampaignRepository } from "./types";

export class FirestoreCampaignRepository implements CampaignRepository {
  private collectionName = "campaigns";

  async getAll(): Promise<Campaign[]> {
    const querySnapshot = await getDocs(collection(db, this.collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Campaign));
  }

  async getById(id: string): Promise<Campaign | null> {
    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Campaign;
    }
    return null;
  }

  async create(campaign: Omit<Campaign, 'id'>): Promise<Campaign> {
    return await runTransaction(db, async (transaction) => {
      const docRef = doc(collection(db, this.collectionName));
      transaction.set(docRef, campaign);
      return { id: docRef.id, ...campaign };
    });
  }

  async update(id: string, campaign: Partial<Campaign>): Promise<void> {
    await runTransaction(db, async (transaction) => {
      const docRef = doc(db, this.collectionName, id);
      transaction.update(docRef, campaign);
    });
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
  }
}
