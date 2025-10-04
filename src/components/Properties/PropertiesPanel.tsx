import { useAppStore } from '../../stores/useAppStore';
import './PropertiesPanel.css';

const PropertiesPanel = () => {
  const { getCurrentPage, updateObject, selectedObjectIds } = useAppStore();
  const currentPage = getCurrentPage();
  
  // Prevent click events from propagating to the canvas
  const handlePanelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  const handlePanelMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Maintain current selection when clicking on properties panel
    console.log('🛡️ Properties panel clicked - maintaining selection');
    
    // Notify MainCanvas that panel was clicked
    const notifyFunc = (window as any).notifyPanelClick;
    if (notifyFunc) {
      notifyFunc();
    }
  };
  
  if (!currentPage || selectedObjectIds.length === 0) {
    return (
      <div className="properties-panel" onMouseDown={handlePanelMouseDown} onClick={handlePanelClick} onPointerDown={handlePanelMouseDown}>
        <h3>Properties</h3>
        <p className="empty-message">Select an object</p>
      </div>
    );
  }

  // Edit properties of the first selected object
  const selectedObject = currentPage.objects.find(
    (obj) => obj.id === selectedObjectIds[0]
  );

  if (!selectedObject) {
    return (
      <div className="properties-panel">
        <h3>Properties</h3>
        <p className="empty-message">Object not found</p>
      </div>
    );
  }

  const handleColorChange = (property: 'fillColor' | 'strokeColor', value: string) => {
    updateObject(selectedObject.id, { [property]: value });
  };

  const handleStrokeWidthChange = (value: number) => {
    updateObject(selectedObject.id, { strokeWidth: value });
  };
  
  // Input elements event handlers to prevent propagation
  const handleInputInteraction = (e: React.MouseEvent | React.PointerEvent | React.TouchEvent) => {
    e.stopPropagation();
    const notifyFunc = (window as any).notifyPanelClick;
    if (notifyFunc) {
      notifyFunc();
    }
  };

  const handleSizeChange = (property: 'width' | 'height', value: number) => {
    if (value > 0) {
      // Diamond and circle shapes should always be square (width = height)
      if (selectedObject.type === 'diamond' || selectedObject.type === 'circle') {
        updateObject(selectedObject.id, { width: value, height: value });
      } else {
        updateObject(selectedObject.id, { [property]: value });
      }
    }
  };

  return (
    <div className="properties-panel" onMouseDown={handlePanelMouseDown} onClick={handlePanelClick} onPointerDown={handlePanelMouseDown}>
      <h3>Properties</h3>
      
      <div className="property-section">
        <label>Fill Color</label>
        <div className="color-input-group">
          <input
            type="color"
            value={selectedObject.fillColor}
            onChange={(e) => handleColorChange('fillColor', e.target.value)}
            onMouseDown={handleInputInteraction}
            onPointerDown={handleInputInteraction}
          />
          <input
            type="text"
            value={selectedObject.fillColor}
            onChange={(e) => handleColorChange('fillColor', e.target.value)}
            placeholder="#ffffff"
            onMouseDown={handleInputInteraction}
            onPointerDown={handleInputInteraction}
          />
        </div>
      </div>

      <div className="property-section">
        <label>Stroke Color</label>
        <div className="color-input-group">
          <input
            type="color"
            value={selectedObject.strokeColor}
            onChange={(e) => handleColorChange('strokeColor', e.target.value)}
            onMouseDown={handleInputInteraction}
            onPointerDown={handleInputInteraction}
          />
          <input
            type="text"
            value={selectedObject.strokeColor}
            onChange={(e) => handleColorChange('strokeColor', e.target.value)}
            placeholder="#000000"
            onMouseDown={handleInputInteraction}
            onPointerDown={handleInputInteraction}
          />
        </div>
      </div>

      <div className="property-section">
        <label>Stroke Width: {selectedObject.strokeWidth}px</label>
        <input
          type="range"
          min="1"
          max="10"
          value={selectedObject.strokeWidth}
          onChange={(e) => handleStrokeWidthChange(Number(e.target.value))}
          onMouseDown={handleInputInteraction}
          onPointerDown={handleInputInteraction}
          onTouchStart={handleInputInteraction}
        />
      </div>

      <div className="property-section">
        <label>Size</label>
        {selectedObject.type === 'diamond' ? (
          // Diamond shapes: single size input (always square)
          <div className="size-inputs">
            <div className="size-input-item">
              <label>Size</label>
              <input
                type="number"
                min="10"
                max="1000"
                value={Math.round(selectedObject.width)}
                onChange={(e) => handleSizeChange('width', Number(e.target.value))}
                onMouseDown={handleInputInteraction}
                onPointerDown={handleInputInteraction}
              />
              <span>px</span>
            </div>
            <p style={{ fontSize: '12px', color: '#999', margin: '8px 0 0 0' }}>
              ⬥ Diamonds are always square
            </p>
          </div>
        ) : selectedObject.type === 'circle' ? (
          // Circle shapes: single size input (diameter)
          <div className="size-inputs">
            <div className="size-input-item">
              <label>Diameter</label>
              <input
                type="number"
                min="10"
                max="1000"
                value={Math.round(Math.min(selectedObject.width, selectedObject.height))}
                onChange={(e) => {
                  const size = Number(e.target.value);
                  updateObject(selectedObject.id, { width: size, height: size });
                }}
                onMouseDown={handleInputInteraction}
                onPointerDown={handleInputInteraction}
              />
              <span>px</span>
            </div>
          </div>
        ) : (
          // Other shapes: separate width and height
          <div className="size-inputs">
            <div className="size-input-item">
              <label>Width</label>
              <input
                type="number"
                min="10"
                max="1000"
                value={Math.round(selectedObject.width)}
                onChange={(e) => handleSizeChange('width', Number(e.target.value))}
                onMouseDown={handleInputInteraction}
                onPointerDown={handleInputInteraction}
              />
              <span>px</span>
            </div>
            <div className="size-input-item">
              <label>Height</label>
              <input
                type="number"
                min="10"
                max="1000"
                value={Math.round(selectedObject.height)}
                onChange={(e) => handleSizeChange('height', Number(e.target.value))}
                onMouseDown={handleInputInteraction}
                onPointerDown={handleInputInteraction}
              />
              <span>px</span>
            </div>
          </div>
        )}
      </div>

      {selectedObjectIds.length > 1 && (
        <div className="multi-select-info">
          {selectedObjectIds.length} objects selected
        </div>
      )}
    </div>
  );
};

export default PropertiesPanel;

