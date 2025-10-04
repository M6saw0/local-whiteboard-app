import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { CanvasObject } from '../../../types';

interface ActorNodeData {
  object: CanvasObject;
  onTextEdit?: (id: string) => void;
}

const ActorNode = ({ data, selected }: NodeProps<ActorNodeData>) => {
  const { object, onTextEdit } = data;

  const handleStyle = {
    width: 6,
    height: 6,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: '1px solid white',
    borderRadius: '50%',
    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
    transition: 'all 0.2s',
  };

  return (
    <div
      style={{
        width: object.width,
        height: object.height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        cursor: 'move',
        padding: '10px',
        boxShadow: selected 
          ? '0 8px 24px rgba(33, 150, 243, 0.3), 0 0 0 3px #2196f3'
          : '0 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        transition: 'all 0.2s ease',
        backgroundColor: 'transparent',
      }}
      onDoubleClick={() => onTextEdit?.(object.id)}
    >
      {/* スティックフィギュア（アクター）のSVG */}
      <svg
        width="60"
        height="80"
        viewBox="0 0 60 80"
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
          transition: 'filter 0.2s ease',
        }}
      >
        {/* 頭 */}
        <circle
          cx="30"
          cy="15"
          r="10"
          fill="none"
          stroke={object.strokeColor}
          strokeWidth={object.strokeWidth}
        />
        {/* 体 */}
        <line
          x1="30"
          y1="25"
          x2="30"
          y2="50"
          stroke={object.strokeColor}
          strokeWidth={object.strokeWidth}
        />
        {/* 腕 */}
        <line
          x1="10"
          y1="35"
          x2="50"
          y2="35"
          stroke={object.strokeColor}
          strokeWidth={object.strokeWidth}
        />
        {/* 左足 */}
        <line
          x1="30"
          y1="50"
          x2="15"
          y2="75"
          stroke={object.strokeColor}
          strokeWidth={object.strokeWidth}
        />
        {/* 右足 */}
        <line
          x1="30"
          y1="50"
          x2="45"
          y2="75"
          stroke={object.strokeColor}
          strokeWidth={object.strokeWidth}
        />
      </svg>
      
      {/* ラベルテキスト */}
      <div
        style={{
          color: '#333',
          fontSize: '12px',
          fontWeight: 500,
          textAlign: 'center',
          wordBreak: 'break-word',
          marginTop: '8px',
          lineHeight: 1.4,
        }}
      >
        {object.text || 'Actor'}
      </div>
      
      {/* 接続ポイント */}
      <Handle type="source" position={Position.Top} id="top-source" style={handleStyle} />
      <Handle type="target" position={Position.Top} id="top-target" style={handleStyle} />

      <Handle type="source" position={Position.Bottom} id="bottom-source" style={handleStyle} />
      <Handle type="target" position={Position.Bottom} id="bottom-target" style={handleStyle} />

      <Handle type="source" position={Position.Left} id="left-source" style={handleStyle} />
      <Handle type="target" position={Position.Left} id="left-target" style={handleStyle} />

      <Handle type="source" position={Position.Right} id="right-source" style={handleStyle} />
      <Handle type="target" position={Position.Right} id="right-target" style={handleStyle} />
    </div>
  );
};

export default memo(ActorNode);

