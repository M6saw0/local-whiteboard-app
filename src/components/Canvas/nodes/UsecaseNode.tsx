import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { CanvasObject } from '../../../types';

interface UsecaseNodeData {
  object: CanvasObject;
  onTextEdit?: (id: string) => void;
}

const UsecaseNode = ({ data, selected }: NodeProps<UsecaseNodeData>) => {
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
        backgroundColor: object.fillColor,
        border: `${object.strokeWidth}px solid ${object.strokeColor}`,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        position: 'relative',
        boxShadow: selected 
          ? '0 8px 24px rgba(33, 150, 243, 0.3), 0 0 0 3px #2196f3'
          : '0 4px 12px rgba(0, 0, 0, 0.1)',
        cursor: 'move',
        transition: 'all 0.2s ease',
        background: `linear-gradient(135deg, ${object.fillColor} 0%, ${object.fillColor}dd 100%)`,
      }}
      onDoubleClick={() => onTextEdit?.(object.id)}
    >
      <div
        style={{
          color: '#333',
          fontSize: '14px',
          fontWeight: 500,
          textAlign: 'center',
          wordBreak: 'break-word',
          overflow: 'hidden',
          lineHeight: 1.5,
        }}
      >
        {object.text || 'Use Case'}
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

export default memo(UsecaseNode);

