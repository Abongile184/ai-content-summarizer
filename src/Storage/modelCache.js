const DB_NAME = "ai-model-cache";
const STORE = "models";
const VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);

    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE);
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function hasModel(key) {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE);
    const req = tx.objectStore(STORE).get(key);
    req.onsuccess = () => resolve(!!req.result);
  });
}

export async function markModelCached(key) {
  const db = await openDB();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).put(true, key);
}
