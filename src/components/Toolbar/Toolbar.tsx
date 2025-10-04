import { useAppStore } from '../../stores/useAppStore';
import type { Tool } from '../../types';
import './Toolbar.css';

const Toolbar = () => {
  const { currentTool, setCurrentTool } = useAppStore();

  const tools: { id: Tool; label: string; icon: string }[] = [
    { id: 'select', label: 'Select', icon: '🖱️' },
    { id: 'rectangle', label: 'Rectangle', icon: '⬜' },
    { id: 'circle', label: 'Circle', icon: '⭕' },
    { id: 'diamond', label: 'Diamond', icon: '🔶' },
    { id: 'text', label: 'Text', icon: '📝' },
    { id: 'sticky-note', label: 'Sticky Note', icon: '📋' },
    { id: 'actor', label: 'Actor', icon: '👤' },
    { id: 'usecase', label: 'Use Case', icon: '🎯' },
    { id: 'connection', label: 'Connection', icon: '➡️' },
    { id: 'pan', label: 'Pan', icon: '✋' },
  ];

  return (
    <div className="toolbar">
      <h3>Tools</h3>
      <div className="tool-list">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className={`tool-button ${currentTool === tool.id ? 'active' : ''}`}
            onClick={() => setCurrentTool(tool.id)}
            title={tool.label}
          >
            <span className="tool-icon">{tool.icon}</span>
            <span className="tool-label">{tool.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Toolbar;

