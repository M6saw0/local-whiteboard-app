import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { CanvasObject } from '../../../types';

interface DiamondNodeData {
  object: CanvasObject;
  onTextEdit?: (id: string) => void;
}

const DiamondNode = ({ data, selected }: NodeProps<DiamondNodeData>) => {
  const { object, onTextEdit } = data;

  const handleStyle = {
    width: 6,
    height: 6,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: '1px solid white',
    borderRadius: '50%',
    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
    transition: 'all 0.2s',
    position: 'absolute' as const,
  };

  // ひし形の頂点の位置を計算（45度回転した四角形）
  // 45度回転した正方形の頂点は、元のボックスの辺から約20.7%外側に出ます
  // (sqrt(2)/2 - 0.5) ≈ 0.207 = 20.7%
  const vertexOutside = '-20.7%'; // 辺から20.7%外側

  return (
    <div
      style={{
        width: object.width,
        height: object.height,
        position: 'relative',
        cursor: 'move',
      }}
      onDoubleClick={() => onTextEdit?.(object.id)}
    >
      {/* 菱形の形状 */}
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: object.fillColor,
          border: `${object.strokeWidth}px solid ${object.strokeColor}`,
          transform: 'rotate(45deg)',
          boxShadow: selected 
            ? '0 8px 24px rgba(33, 150, 243, 0.3), 0 0 0 3px #2196f3'
            : '0 4px 12px rgba(0, 0, 0, 0.1)',
          position: 'absolute',
          transition: 'all 0.2s ease',
          background: `linear-gradient(135deg, ${object.fillColor} 0%, ${object.fillColor}dd 100%)`,
        }}
      />
      
      {/* テキストエリア */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#333',
          fontSize: '14px',
          fontWeight: 500,
          textAlign: 'center',
          wordBreak: 'break-word',
          maxWidth: '70%',
          zIndex: 1,
          lineHeight: 1.5,
        }}
      >
        {object.text || 'Double click to edit text'}
      </div>
      
      {/* 接続ポイント - ひし形の実際の頂点（45度回転後の角）に配置 */}
      {/* 上の頂点（元の左上角が回転後に上の頂点になる） */}
      <Handle 
        type="source" 
        position={Position.Top} 
        id="top-source" 
        style={{ 
          ...handleStyle, 
          top: vertexOutside, 
          left: '50%', 
          transform: 'translate(-50%, 0)'
        }}
      />
      <Handle 
        type="target" 
        position={Position.Top} 
        id="top-target" 
        style={{ 
          ...handleStyle, 
          top: vertexOutside, 
          left: '50%', 
          transform: 'translate(-50%, 0)'
        }}
      />

      {/* 右の頂点（元の右上角が回転後に右の頂点になる） */}
      <Handle 
        type="source" 
        position={Position.Right} 
        id="right-source" 
        style={{ 
          ...handleStyle, 
          right: vertexOutside, 
          top: '50%', 
          transform: 'translate(0, -50%)'
        }}
      />
      <Handle 
        type="target" 
        position={Position.Right} 
        id="right-target" 
        style={{ 
          ...handleStyle, 
          right: vertexOutside, 
          top: '50%', 
          transform: 'translate(0, -50%)'
        }}
      />

      {/* 下の頂点（元の右下角が回転後に下の頂点になる） */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="bottom-source" 
        style={{ 
          ...handleStyle, 
          bottom: vertexOutside, 
          left: '50%', 
          transform: 'translate(-50%, 0)'
        }}
      />
      <Handle 
        type="target" 
        position={Position.Bottom} 
        id="bottom-target" 
        style={{ 
          ...handleStyle, 
          bottom: vertexOutside, 
          left: '50%', 
          transform: 'translate(-50%, 0)'
        }}
      />

      {/* 左の頂点（元の左下角が回転後に左の頂点になる） */}
      <Handle 
        type="source" 
        position={Position.Left} 
        id="left-source" 
        style={{ 
          ...handleStyle, 
          left: vertexOutside, 
          top: '50%', 
          transform: 'translate(0, -50%)'
        }}
      />
      <Handle 
        type="target" 
        position={Position.Left} 
        id="left-target" 
        style={{ 
          ...handleStyle, 
          left: vertexOutside, 
          top: '50%', 
          transform: 'translate(0, -50%)'
        }}
      />
    </div>
  );
};

export default memo(DiamondNode);
