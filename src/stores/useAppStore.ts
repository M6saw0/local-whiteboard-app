import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { AppState, Tool, Page, CanvasObject, Connection } from '../types';
import { getAllPages, savePage, deletePage as deletePageFromDB } from '../utils/database';

interface AppStore extends AppState {
  // ツール関連
  setCurrentTool: (tool: Tool) => void;
  
  // 選択関連
  selectObject: (id: string) => void;
  selectMultipleObjects: (ids: string[]) => void;
  deselectAll: () => void;
  
  // ページ関連
  createPage: (name?: string) => void;
  deletePage: (id: string) => void;
  switchPage: (id: string) => void;
  updatePageName: (id: string, name: string) => void;
  getCurrentPage: () => Page | null;
  
  // オブジェクト関連
  addObject: (object: Omit<CanvasObject, 'id'>) => void;
  updateObject: (id: string, updates: Partial<CanvasObject>) => void;
  deleteObject: (id: string) => void;
  deleteSelectedObjects: () => void;
  
  // 接続関連
  addConnection: (connection: Omit<Connection, 'id'>) => void;
  deleteConnection: (id: string) => void;
  
  // ビューポート関連
  setViewport: (x: number, y: number, zoom: number) => void;
  
  // 描画状態
  setIsDrawing: (isDrawing: boolean) => void;
  
  // データの保存・読み込み
  saveToDatabase: () => Promise<void>;
  loadFromDatabase: () => Promise<void>;
}

export const useAppStore = create<AppStore>((set, get) => ({
  // 初期状態
  currentTool: 'select',
  selectedObjectIds: [],
  currentPageId: null,
  pages: [],
  viewport: { x: 0, y: 0, zoom: 1 },
  isDrawing: false,

  // ツール関連
  setCurrentTool: (tool) => set({ currentTool: tool }),

  // 選択関連
  selectObject: (id) => set({ selectedObjectIds: [id] }),
  selectMultipleObjects: (ids) => set({ selectedObjectIds: ids }),
  deselectAll: () => set({ selectedObjectIds: [] }),

  // ページ関連
  createPage: (name) => {
    const newPage: Page = {
      id: uuidv4(),
      name: name || `New Page ${new Date().toLocaleString('en-US')}`,
      objects: [],
      connections: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({
      pages: [...state.pages, newPage],
      currentPageId: newPage.id,
    }));
  },

  deletePage: async (id) => {
    const { pages, currentPageId } = get();
    if (pages.length <= 1) {
      alert('Cannot delete the last page');
      return;
    }
    const newPages = pages.filter((p) => p.id !== id);
    const newCurrentId = currentPageId === id ? newPages[0]?.id || null : currentPageId;
    set({ pages: newPages, currentPageId: newCurrentId });
    
    // データベースからも削除
    try {
      await deletePageFromDB(id);
    } catch (error) {
      console.error('ページの削除に失敗:', error);
    }
  },

  switchPage: (id) => set({ currentPageId: id, selectedObjectIds: [] }),

  updatePageName: (id, name) => {
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === id ? { ...p, name, updatedAt: new Date() } : p
      ),
    }));
  },

  getCurrentPage: () => {
    const { pages, currentPageId } = get();
    return pages.find((p) => p.id === currentPageId) || null;
  },

  // オブジェクト関連
  addObject: (object) => {
    const { currentPageId, pages } = get();
    if (!currentPageId) return;

    const newObject: CanvasObject = {
      ...object,
      id: uuidv4(),
    };

    set({
      pages: pages.map((p) =>
        p.id === currentPageId
          ? { ...p, objects: [...p.objects, newObject], updatedAt: new Date() }
          : p
      ),
    });
  },

  updateObject: (id, updates) => {
    const { currentPageId, pages } = get();
    if (!currentPageId) return;

    set({
      pages: pages.map((p) =>
        p.id === currentPageId
          ? {
              ...p,
              objects: p.objects.map((obj) =>
                obj.id === id ? { ...obj, ...updates } : obj
              ),
              updatedAt: new Date(),
            }
          : p
      ),
    });
  },

  deleteObject: (id) => {
    const { currentPageId, pages } = get();
    if (!currentPageId) return;

    set({
      pages: pages.map((p) =>
        p.id === currentPageId
          ? {
              ...p,
              objects: p.objects.filter((obj) => obj.id !== id),
              // 関連する接続も削除
              connections: p.connections.filter(
                (conn) => conn.sourceId !== id && conn.targetId !== id
              ),
              updatedAt: new Date(),
            }
          : p
      ),
      selectedObjectIds: get().selectedObjectIds.filter((objId) => objId !== id),
    });
  },

  deleteSelectedObjects: () => {
    const { selectedObjectIds } = get();
    selectedObjectIds.forEach((id) => get().deleteObject(id));
    set({ selectedObjectIds: [] });
  },

  // 接続関連
  addConnection: (connection) => {
    const { currentPageId, pages } = get();
    if (!currentPageId) return;

    const newConnection: Connection = {
      ...connection,
      id: uuidv4(),
    };

    set({
      pages: pages.map((p) =>
        p.id === currentPageId
          ? { ...p, connections: [...p.connections, newConnection], updatedAt: new Date() }
          : p
      ),
    });
  },

  deleteConnection: (id) => {
    const { currentPageId, pages } = get();
    if (!currentPageId) return;

    set({
      pages: pages.map((p) =>
        p.id === currentPageId
          ? {
              ...p,
              connections: p.connections.filter((conn) => conn.id !== id),
              updatedAt: new Date(),
            }
          : p
      ),
    });
  },

  // ビューポート関連
  setViewport: (x, y, zoom) => set({ viewport: { x, y, zoom } }),

  // 描画状態
  setIsDrawing: (isDrawing) => set({ isDrawing }),

  // データの保存・読み込み
  saveToDatabase: async () => {
    const { pages } = get();
    try {
      // Save all pages
      await Promise.all(pages.map((page) => savePage(page)));
      console.log('✅ Data saved successfully');
    } catch (error) {
      console.error('❌ Failed to save data:', error);
      alert('Failed to save data');
    }
  },

  loadFromDatabase: async () => {
    try {
      const pages = await getAllPages();
      if (pages.length > 0) {
        set({
          pages,
          currentPageId: pages[0].id,
          selectedObjectIds: [],
        });
        console.log(`✅ Loaded ${pages.length} page(s) successfully`);
      } else {
        // Create default page if no data exists
        get().createPage('First Page');
        console.log('📝 Created default page');
      }
    } catch (error) {
      console.error('❌ Failed to load data:', error);
      // Create default page even if error occurs
      get().createPage('First Page');
    }
  },
}));

