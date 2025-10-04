import { useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import Header from './components/common/Header';
import Toolbar from './components/Toolbar/Toolbar';
import MainCanvas from './components/Canvas/MainCanvas';
import Sidebar from './components/Sidebar/Sidebar';
import PropertiesPanel from './components/Properties/PropertiesPanel';
import { useAppStore } from './stores/useAppStore';
import './App.css';

function App() {
  const { pages, createPage, loadFromDatabase, saveToDatabase } = useAppStore();

  useEffect(() => {
    // Initialize: load from database or create default page
    const initialize = async () => {
      await loadFromDatabase();
      
      // Create initial page if no pages exist
      const currentPages = useAppStore.getState().pages;
      if (currentPages.length === 0) {
        createPage('First Page');
      }
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on first render

  // Auto-save: Save when page data changes
  useEffect(() => {
    if (pages.length > 0) {
      // Auto-save with debounce (save 2 seconds after change)
      const timer = setTimeout(() => {
        saveToDatabase();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [pages, saveToDatabase]);

  return (
    <ReactFlowProvider>
      <div className="app">
        <Header />
        <div className="app-body">
          <Toolbar />
          <div className="canvas-container">
            <MainCanvas />
          </div>
          <div className="right-panel">
            <PropertiesPanel />
            <Sidebar />
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default App;
