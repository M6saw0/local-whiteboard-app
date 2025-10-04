import { useState } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import './Sidebar.css';

const Sidebar = () => {
  const { pages, currentPageId, createPage, switchPage, deletePage, updatePageName } = useAppStore();
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleCreatePage = () => {
    createPage();
  };

  const handleDeletePage = (id: string) => {
    if (confirm('Are you sure you want to delete this page?')) {
      deletePage(id);
    }
  };

  const handleStartEdit = (id: string, currentName: string) => {
    setEditingPageId(id);
    setEditingName(currentName);
  };

  const handleSaveEdit = () => {
    if (editingPageId && editingName.trim()) {
      updatePageName(editingPageId, editingName.trim());
      setEditingPageId(null);
      setEditingName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingPageId(null);
    setEditingName('');
  };

  // Prevent click events from propagating to the canvas
  const handlePanelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  const handlePanelMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('🛡️ Sidebar clicked - maintaining selection');
    
    // Notify MainCanvas that panel was clicked
    const notifyFunc = (window as any).notifyPanelClick;
    if (notifyFunc) {
      notifyFunc();
    }
  };

  return (
    <div className="sidebar" onMouseDown={handlePanelMouseDown} onClick={handlePanelClick} onPointerDown={handlePanelMouseDown}>
      <div className="sidebar-header">
        <h3>Pages</h3>
        <button className="btn-create-page" onClick={handleCreatePage} title="New Page">
          ➕
        </button>
      </div>
      
      <div className="page-list">
        {pages.length === 0 ? (
          <p className="empty-message">No pages</p>
        ) : (
          pages.map((page) => (
            <div
              key={page.id}
              className={`page-item ${currentPageId === page.id ? 'active' : ''}`}
            >
              {editingPageId === page.id ? (
                <div className="page-edit">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit();
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    autoFocus
                  />
                  <button onClick={handleSaveEdit}>✓</button>
                  <button onClick={handleCancelEdit}>✕</button>
                </div>
              ) : (
                <>
                  <div
                    className="page-name"
                    onClick={() => switchPage(page.id)}
                    onDoubleClick={() => handleStartEdit(page.id, page.name)}
                  >
                    {page.name}
                  </div>
                  <div className="page-actions">
                    <button
                      className="btn-edit"
                      onClick={() => handleStartEdit(page.id, page.name)}
                      title="Edit Name"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeletePage(page.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;


