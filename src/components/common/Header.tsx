import { useAppStore } from '../../stores/useAppStore';
import './Header.css';

const Header = () => {
  const { getCurrentPage, saveToDatabase } = useAppStore();
  const currentPage = getCurrentPage();

  const handleSave = async () => {
    await saveToDatabase();
    alert('Saved successfully');
  };

  const handleExportPNG = () => {
    // Call export function from MainCanvas
    const exportFunc = (window as any).exportCanvasToPNG;
    if (exportFunc) {
      exportFunc();
    } else {
      alert('Export function not initialized. Please reload the page.');
    }
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="app-title">📊 Whiteboard</h1>
        {currentPage && (
          <span className="current-page-name">{currentPage.name}</span>
        )}
      </div>
      
      <div className="header-right">
        <button className="btn-save" onClick={handleSave}>
          💾 Save
        </button>
        <button className="btn-export" onClick={handleExportPNG}>
          📥 Export PNG
        </button>
      </div>
    </header>
  );
};

export default Header;
