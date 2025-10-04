import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import './TextEditModal.css';

interface TextEditModalProps {
  objectId: string;
  onClose: () => void;
}

const TextEditModal = ({ objectId, onClose }: TextEditModalProps) => {
  const { getCurrentPage, updateObject } = useAppStore();
  const currentPage = getCurrentPage();
  const object = currentPage?.objects.find((obj) => obj.id === objectId);
  
  const [text, setText] = useState(object?.text || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // モーダルが開いたらテキストエリアにフォーカス
    textareaRef.current?.focus();
  }, []);

  const handleSave = () => {
    updateObject(objectId, { text });
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
    // Ctrl+Enter または Cmd+Enter で保存
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSave();
    }
  };

  if (!object) {
    onClose();
    return null;
  }

  return (
    <div className="text-edit-modal-overlay" onClick={onClose}>
      <div className="text-edit-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Edit Text</h3>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter text..."
          rows={5}
        />
        <div className="modal-buttons">
          <button className="btn-save" onClick={handleSave}>
            Save (Ctrl+Enter)
          </button>
          <button className="btn-cancel" onClick={onClose}>
            Cancel (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextEditModal;

