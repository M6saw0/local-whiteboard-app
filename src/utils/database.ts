import type { Page } from '../types';

const DB_NAME = 'MiroLikeAppDB';
const DB_VERSION = 1;
const STORE_NAME = 'pages';

/**
 * IndexedDBを開く
 */
const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('データベースを開けませんでした'));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // ページストアを作成
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        objectStore.createIndex('createdAt', 'createdAt', { unique: false });
        objectStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
    };
  });
};

/**
 * すべてのページを取得
 */
export const getAllPages = async (): Promise<Page[]> => {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.getAll();

    request.onsuccess = () => {
      resolve(request.result || []);
    };

    request.onerror = () => {
      reject(new Error('ページの取得に失敗しました'));
    };
  });
};

/**
 * ページを保存（新規作成または更新）
 */
export const savePage = async (page: Page): Promise<void> => {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.put(page);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(new Error('ページの保存に失敗しました'));
    };
  });
};

/**
 * ページを削除
 */
export const deletePage = async (pageId: string): Promise<void> => {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.delete(pageId);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(new Error('ページの削除に失敗しました'));
    };
  });
};

/**
 * 特定のページを取得
 */
export const getPage = async (pageId: string): Promise<Page | null> => {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.get(pageId);

    request.onsuccess = () => {
      resolve(request.result || null);
    };

    request.onerror = () => {
      reject(new Error('ページの取得に失敗しました'));
    };
  });
};

/**
 * すべてのページを削除（デバッグ用）
 */
export const clearAllPages = async (): Promise<void> => {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.clear();

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(new Error('ページのクリアに失敗しました'));
    };
  });
};

