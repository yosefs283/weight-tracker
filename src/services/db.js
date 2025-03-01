import { db } from '../config/firebase';
import {
    collection,
    query,
    orderBy,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    where,
    getDoc,
    setDoc
} from 'firebase/firestore';

export async function getAllEntries(userId) {
    try {
        const q = query(
            collection(db, 'weights'),
            where('userId', '==', userId)
        );

        const snapshot = await getDocs(q);
        const entries = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                weight: parseFloat(data.weight),
                date: data.date,
                userId: data.userId,
                createdAt: data.createdAt || new Date().toISOString()
            };
        });

        entries.sort((a, b) => new Date(b.date) - new Date(a.date));
        return entries;
    } catch (error) {
        return [];
    }
}

export async function addEntry(entry, userId) {
    try {
        const entryToAdd = {
            weight: parseFloat(entry.weight),
            date: entry.date,
            userId: userId,
            createdAt: new Date().toISOString()
        };

        const docRef = await addDoc(collection(db, 'weights'), entryToAdd);
        return {
            ...entryToAdd,
            id: docRef.id
        };
    } catch (error) {
        console.error('Error adding entry:', error);
        throw error;
    }
}

export async function updateEntry(entryId, entry) {
    const entryRef = doc(db, 'weights', entryId);
    const updateData = {
        ...entry,
        weight: parseFloat(entry.weight),
        updatedAt: new Date().toISOString()
    };
    await updateDoc(entryRef, updateData);
}

export async function deleteEntry(entryId) {
    try {
        const entryRef = doc(db, 'weights', entryId);
        await deleteDoc(entryRef);
        return true;
    } catch (error) {
        throw error;
    }
}

export async function getUserProfile(userId) {
    try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }
        return null;
    } catch (error) {
        console.error('Error getting user profile:', error);
        throw error;
    }
}

export async function updateUserProfile(userId, data) {
    try {
        const docRef = doc(db, 'users', userId);
        await setDoc(docRef, {
            ...data,
            updatedAt: new Date().toISOString()
        }, { merge: true });
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
}

export async function updateUserGoal(userId, goal) {
    try {
        await updateDoc(doc(db, 'users', userId), {
            weightGoal: goal,
            updatedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error updating goal:', error);
        throw error;
    }
} 