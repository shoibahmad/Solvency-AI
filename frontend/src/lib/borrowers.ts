import { collection, addDoc, getDocs, doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type Borrower = any;

export async function getBorrowers() {
  const colRef = collection(db, "borrowers");
  const snapshot = await getDocs(colRef);

  if (snapshot.empty) {
    return [];
  }

  const borrowers = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  // Sort by date descending
  return borrowers.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function addBorrower(borrower: any) {
  const newBorrower = {
    ...borrower,
    date: new Date().toISOString().split('T')[0],
    riskTier: "Pending Analysis",
    probability: 0,
  };

  const colRef = collection(db, "borrowers");
  const docRef = await addDoc(colRef, newBorrower);
  return docRef.id;
}

export async function getBorrowerById(id: string) {
  const docRef = doc(db, "borrowers", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

export async function updateBorrower(id: string, updates: any) {
  const docRef = doc(db, "borrowers", id);
  await updateDoc(docRef, updates);
}
