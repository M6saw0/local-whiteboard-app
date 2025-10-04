// オブジェクトの種類
export type ObjectType = 
  | 'rectangle' 
  | 'circle' 
  | 'diamond' 
  | 'text' 
  | 'sticky-note'
  | 'actor'
  | 'usecase';

// キャンバス上のオブジェクト
export interface CanvasObject {
  id: string;
  type: ObjectType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  text: string;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  zIndex: number;
}

// オブジェクト間の接続（矢印）
export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  sourceHandle: string | null; // どの接続ポイントから（top-source, bottom-source等）
  targetHandle: string | null; // どの接続ポイントへ（top-target, bottom-target等）
  strokeColor: string;
  strokeWidth: number;
  arrowType: 'arrow' | 'line';
}

// ページ
export interface Page {
  id: string;
  name: string;
  objects: CanvasObject[];
  connections: Connection[];
  createdAt: Date;
  updatedAt: Date;
}

// ビューポート（キャンバスの表示状態）
export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

// ツールの種類
export type Tool = 
  | 'select'
  | 'rectangle'
  | 'circle'
  | 'diamond'
  | 'text'
  | 'sticky-note'
  | 'actor'
  | 'usecase'
  | 'connection'
  | 'pan';

// アプリケーションの状態
export interface AppState {
  currentTool: Tool;
  selectedObjectIds: string[];
  currentPageId: string | null;
  pages: Page[];
  viewport: Viewport;
  isDrawing: boolean;
}
