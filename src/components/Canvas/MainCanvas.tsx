import { useCallback, useEffect, useState, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  type Connection,
  type Node,
  type Edge,
  type NodeChange,
} from '@xyflow/react';
import { toPng } from 'html-to-image';
import '@xyflow/react/dist/style.css';
import { useAppStore } from '../../stores/useAppStore';
import { nodeTypes } from './nodes';
import TextEditModal from './TextEditModal';

const MainCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [editingObjectId, setEditingObjectId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const lastPanelClickTime = useRef<number>(0);
  
  const { screenToFlowPosition } = useReactFlow();

  const { 
    getCurrentPage, 
    updateObject, 
    deleteObject,
    currentTool, 
    addObject,
    addConnection,
    deleteConnection,
    selectMultipleObjects,
  } = useAppStore();
  
  const currentPage = getCurrentPage();

  // PNGエクスポート機能
  const exportToPNG = useCallback(async () => {
    const viewportElement = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (!viewportElement) {
      alert('エクスポートに失敗しました');
      return;
    }

    try {
      // 現在のビューポート全体をキャプチャ
      const dataUrl = await toPng(viewportElement, {
        backgroundColor: '#f5f5f5',
        cacheBust: true,
        pixelRatio: 2, // 高解像度
      });

      const link = document.createElement('a');
      link.download = `${currentPage?.name || 'canvas'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('PNG エクスポートエラー:', error);
      alert('PNGエクスポートに失敗しました。もう一度お試しください。');
    }
  }, [currentPage]);

  // エクスポート関数をグローバルに登録
  useEffect(() => {
    (window as any).exportCanvasToPNG = exportToPNG;
    (window as any).notifyPanelClick = () => {
      lastPanelClickTime.current = Date.now();
    };
    return () => {
      delete (window as any).exportCanvasToPNG;
      delete (window as any).notifyPanelClick;
    };
  }, [exportToPNG]);

  // ストアのオブジェクトをReact Flowのノードに変換
  useEffect(() => {
    if (!currentPage) return;

    const reactFlowNodes: Node[] = currentPage.objects.map((obj) => ({
      id: obj.id,
      type: obj.type,
      position: { x: obj.x, y: obj.y },
      data: {
        object: obj,
        onTextEdit: (id: string) => {
          setEditingObjectId(id);
        },
      },
    }));

    setNodes(reactFlowNodes);

    // 接続をエッジに変換（From → To の矢印）
    const reactFlowEdges: Edge[] = currentPage.connections.map((conn) => ({
      id: conn.id,
      source: conn.sourceId,  // From（開始点）
      target: conn.targetId,  // To（終了点）
      sourceHandle: conn.sourceHandle,
      targetHandle: conn.targetHandle,
      animated: false,
      type: 'smoothstep',  // スムーズな線
      selectable: true,  // エッジを選択可能にする
      markerStart: {
        type: 'arrowclosed',  // 開始点に矢印を表示（逆向き）
        width: 20,
        height: 20,
        color: conn.strokeColor,
      },
      style: {
        stroke: conn.strokeColor,
        strokeWidth: conn.strokeWidth,
      },
      // 選択時のスタイルを設定
      className: 'custom-edge',
    }));

    setEdges(reactFlowEdges);
    
    // 初回レンダリングが完了したことをマーク
    if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [currentPage?.objects, currentPage?.connections, setNodes, setEdges, isInitialized]);

  // ノードが変更されたときの処理
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);
      
      changes.forEach((change) => {
        // 位置変更の場合、ストアを更新
        if (change.type === 'position' && change.position && !change.dragging) {
          updateObject(change.id, {
            x: change.position.x,
            y: change.position.y,
          });
        }
        
        // 削除の場合、ストアからも削除
        if (change.type === 'remove') {
          deleteObject(change.id);
        }
      });
    },
    [onNodesChange, updateObject, deleteObject]
  );

  // 選択状態が変更されたときの処理（React Flow公式のイベント）
  const handleSelectionChange = useCallback(
    ({ nodes: selectedNodes }: { nodes: Node[] }) => {
      const selectedNodeIds = selectedNodes.map((node) => node.id);
      
      // 現在の選択状態と比較して、実際に変更があった場合のみ更新
      const currentSelected = useAppStore.getState().selectedObjectIds;
      
      console.log('🔍 Selection change detected:', {
        new: selectedNodeIds,
        current: currentSelected,
        timeSinceLastPanelClick: Date.now() - lastPanelClickTime.current,
      });
      
      // プロパティパネルクリック直後（500ms以内）に選択が解除される場合は無視
      const isRecentPanelClick = Date.now() - lastPanelClickTime.current < 500;
      const isDeselecting = selectedNodeIds.length === 0 && currentSelected.length > 0;
      
      if (isRecentPanelClick && isDeselecting) {
        console.log('🚫 Ignoring deselection - recent panel click detected');
        return;
      }
      
      const hasChanged = 
        selectedNodeIds.length !== currentSelected.length ||
        selectedNodeIds.some((id, index) => id !== currentSelected[index]);
      
      if (hasChanged) {
        console.log('✅ Updating selection');
        selectMultipleObjects(selectedNodeIds);
      } else {
        console.log('⏭️ No change, skipping update');
      }
    },
    [selectMultipleObjects]
  );

  // エッジが変更されたときの処理
  const handleEdgesChange = useCallback(
    (changes: any[]) => {
      onEdgesChange(changes);
      
      changes.forEach((change: any) => {
        // 削除の場合、ストアからも削除
        if (change.type === 'remove') {
          deleteConnection(change.id);
        }
      });
    },
    [onEdgesChange, deleteConnection]
  );

  // エッジが作成されたときにストアに追加
  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;
      
      console.log('接続作成 (From → To):', {
        from: params.source,
        fromHandle: params.sourceHandle,
        to: params.target,
        toHandle: params.targetHandle,
      });
      
      // 矢印付きのエッジを作成（From → To）
      const newEdge = {
        ...params,
        source: params.source,  // ドラッグ開始点
        target: params.target,  // ドラッグ終了点
        sourceHandle: params.sourceHandle || null,
        targetHandle: params.targetHandle || null,
        type: 'smoothstep',  // スムーズな線
        markerStart: {
          type: 'arrowclosed' as const,  // 開始点に矢印（逆向き）
          width: 20,
          height: 20,
          color: '#000000',
        },
        style: {
          strokeWidth: 2,
          stroke: '#000000',
        },
      };
      
      setEdges((eds) => addEdge(newEdge, eds));
      
      // ストアに接続を追加（実際の接続方向で保存）
      addConnection({
        sourceId: params.source,  // ドラッグ開始点
        targetId: params.target,  // ドラッグ終了点
        sourceHandle: params.sourceHandle || null,
        targetHandle: params.targetHandle || null,
        strokeColor: '#000000',
        strokeWidth: 2,
        arrowType: 'arrow',
      });
    },
    [setEdges, addConnection]
  );

  // キャンバスをクリックしたときにオブジェクトを追加（画面中心に配置）
  const handlePaneClick = useCallback(
    (event: React.MouseEvent) => {
      if (currentTool === 'select' || currentTool === 'pan' || currentTool === 'connection') return;

      // クリック位置をReact Flowの座標系に変換
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // デフォルトサイズ
      const defaultSizes: Record<string, { width: number; height: number }> = {
        rectangle: { width: 120, height: 80 },
        circle: { width: 100, height: 100 },
        diamond: { width: 120, height: 120 },
        text: { width: 150, height: 50 },
        'sticky-note': { width: 150, height: 150 },
        actor: { width: 80, height: 120 },
        usecase: { width: 140, height: 70 },
      };

      const size = defaultSizes[currentTool] || { width: 100, height: 100 };

      // オブジェクトの中心をクリック位置に合わせる
      addObject({
        type: currentTool as any,
        x: position.x - size.width / 2,
        y: position.y - size.height / 2,
        width: size.width,
        height: size.height,
        rotation: 0,
        text: '',
        fillColor: '#ffffff',
        strokeColor: '#000000',
        strokeWidth: 2,
        zIndex: 0,
      });
    },
    [currentTool, addObject, screenToFlowPosition]
  );

  // Deleteキーでオブジェクトを削除
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // テキスト編集中は削除処理を無効化
      if (editingObjectId !== null) {
        return;
      }
      
      if (event.key === 'Delete' || event.key === 'Backspace') {
        // 選択されたノードを削除
        const selectedNodes = nodes.filter((node) => node.selected);
        selectedNodes.forEach((node) => {
          deleteObject(node.id);
        });
        
        // 選択されたエッジを削除
        const selectedEdges = edges.filter((edge) => edge.selected);
        selectedEdges.forEach((edge) => {
          if (edge.id) deleteConnection(edge.id);
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nodes, edges, deleteObject, deleteConnection, editingObjectId]);

  return (
    <>
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        {/* Connection tool hint */}
        {currentTool === 'connection' && (
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(33, 150, 243, 0.9)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            pointerEvents: 'none',
          }}>
            💡 Drag connection points (circles) to connect objects
          </div>
        )}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          onPaneClick={handlePaneClick}
          onSelectionChange={handleSelectionChange}
          nodeTypes={nodeTypes}
          fitView={false}
          style={{ 
            background: '#f5f5f5',
            cursor: currentTool === 'connection' ? 'crosshair' : currentTool === 'pan' ? 'grab' : 'default'
          }}
          deleteKeyCode={null}
          connectionMode="loose"
          panOnDrag={currentTool === 'pan' || currentTool === 'select'}
          nodesConnectable={currentTool === 'connection' || currentTool === 'select'}
          nodesDraggable={currentTool === 'select'}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
      
      {/* テキスト編集モーダル */}
      {editingObjectId && (
        <TextEditModal
          objectId={editingObjectId}
          onClose={() => setEditingObjectId(null)}
        />
      )}
    </>
  );
};

export default MainCanvas;
