// Firebase initialization using Realtime Database
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getDatabase, ref as dbRef, push, set, update, remove, get, child,
  onValue, query, orderByChild, runTransaction, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
import {
  getStorage, ref as sRef, uploadBytes, getDownloadURL, deleteObject
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBCdSPOM47RDoQpH2uIOlGpphS6RAiyWao",
  authDomain: "skill2jobvisitcount.firebaseapp.com",
  databaseURL: "https://skill2jobvisitcount-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "skill2jobvisitcount",
  storageBucket: "skill2jobvisitcount.firebasestorage.app",
  messagingSenderId: "765089407089",
  appId: "1:765089407089:web:a410facdd7dfb6e1fbbbd0",
  measurementId: "G-S5X1VJQS79"
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storage = getStorage(app);

// Re-export database and storage functions for convenience
export {
  dbRef,
  push,
  set,
  update,
  remove,
  get,
  child,
  onValue,
  query,
  orderByChild,
  runTransaction,
  serverTimestamp,
  sRef,
  uploadBytes,
  getDownloadURL,
  deleteObject
};

// Namespaced paths – avoids collisions if the DB is shared
const NS = "erp_bfa";
export const PATH = {
  students: `${NS}/students`,
  teachers: `${NS}/teachers`,
  fees: `${NS}/fees`,
  salaries: `${NS}/salaries`,
  counters: `${NS}/counters`
};

/**
 * Atomic counter using RTDB transactions.
 * @param {string} name - Counter name (e.g., "admissionId")
 * @param {string} prefix - Prefix for the generated ID (e.g., "ADM-")
 * @param {number} pad - Number of digits to pad to (default: 4)
 * @returns {Promise<string>} Formatted counter value.
 */
export async function nextCounter(name, prefix, pad = 4) {
  const cRef = dbRef(db, `${PATH.counters}/${name}`);
  const result = await runTransaction(cRef, (current) => (Number(current) || 0) + 1);
  const value = result.snapshot.val();
  return `${prefix}${String(value).padStart(pad, "0")}`;
}

/**
 * Upload a photo file to Firebase Storage; returns download URL.
 * Falls back to base64 if upload fails.
 * @param {string} kind - Entity type (e.g., "students", "teachers")
 * @param {string} id - Document ID
 * @param {File} file - The file to upload
 * @returns {Promise<string|null>} Download URL or null.
 */
export async function uploadPhoto(kind, id, file) {
  if (!file) return null;
  try {
    const path = `${NS}/${kind}/${id}/${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const r = sRef(storage, path);
    await uploadBytes(r, file);
    return await getDownloadURL(r);
  } catch (e) {
    console.warn("Photo upload failed; falling back to base64", e?.message);
    return await fileToDataUrl(file);
  }
}

/**
 * Convert a file to a data URL (base64).
 * @param {File} file
 * @returns {Promise<string>} Data URL.
 */
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}

/**
 * Health probe – checks if the database is reachable.
 * @returns {Promise<boolean>} True if reachable, false otherwise.
 */
export async function firebaseHealthCheck() {
  try {
    await get(dbRef(db, `${NS}/_meta`));
    return true;
  } catch (e) {
    console.warn("Realtime DB health check failed:", e?.message || e);
    return false;
  }
}

/**
 * Delete a file from Firebase Storage by its download URL.
 * @param {string} url - The download URL of the file to delete.
 */
export async function deleteFile(url) {
  if (!url) return;
  try {
    // Extract the path from the URL
    const decodedUrl = decodeURIComponent(url);
    // Pattern: /o/path/to/file?alt=media&token=...
    const match = decodedUrl.match(/\/o\/(.+?)\?/);
    if (!match) return;
    const path = match[1];
    const fileRef = sRef(storage, path);
    await deleteObject(fileRef);
  } catch (e) {
    console.warn("Failed to delete file:", e.message);
    // Silently fail – the file may already be gone
  }
}
