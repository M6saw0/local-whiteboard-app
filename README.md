# 📊 Whiteboard App

A whiteboard application for creating flowcharts, diagrams, and visual documentation. Built for local use with browser-based storage.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178C6.svg?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.0.3-646CFF.svg?logo=vite)

## ✨ Features

### Core Features
- 🎨 **Multiple Object Types**: Rectangle, Circle, Diamond, Text, Sticky Note, Actor, Use Case
- ✏️ **Text Editing**: Double-click any object to add/edit text
- 🔗 **Connections**: Create directional arrows between objects with smooth lines
- 🎯 **Smart Selection**: Click to select, drag to move, multi-select support
- 🎨 **Customization**: Change colors, stroke width, and sizes via Properties Panel
- 📐 **Canvas Navigation**: Pan, zoom, and navigate large workspaces
- 💾 **Auto-Save**: Automatic persistence to IndexedDB every 2 seconds
- 📄 **Multi-Page Support**: Create and manage multiple pages/diagrams
- 📸 **Export**: Export diagrams as PNG images

### User Experience
- ⌨️ **Keyboard Shortcuts**: 
  - `Backspace/Delete`: Delete selected objects
  - `Escape`: Cancel text editing
  - `Ctrl+Enter`: Save text while editing
- 🎨 **Modern UI**: Gradient backgrounds, shadows, and smooth animations
- 📱 **Responsive Design**: Optimized for desktop use
- 🌐 **No Account Required**: Fully local, no server or authentication needed

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (comes with Node.js)

You can check your versions:
```bash
node --version
npm --version
```

### Installation

1. **Clone the repository** (or download the source code)
   ```bash
   git clone <repository-url>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   The application will be available at:
   ```
   http://localhost:5173
   ```

### Building for Production

To create an optimized production build:

```bash
npm run build
```

The built files will be in the `frontend/dist` directory. You can serve them with any static file server.

To preview the production build locally:
```bash
npm run preview
```

## 📖 Usage Guide

### Getting Started

1. **Select a Tool**: Click a tool from the left toolbar
   - 🖱️ **Select**: Click and drag objects, connect them
   - ⬜ **Rectangle**: Click canvas to add rectangles
   - ⭕ **Circle**: Click canvas to add circles
   - 🔶 **Diamond**: Click canvas to add diamonds
   - 📝 **Text**: Click canvas to add text boxes
   - 📋 **Sticky Note**: Click canvas to add sticky notes
   - 👤 **Actor**: Click canvas to add actor symbols (for UML)
   - 🎯 **Use Case**: Click canvas to add use case ellipses
   - ➡️ **Connection**: Drag from one object's handle to another
   - ✋ **Pan**: Click and drag to move the canvas

2. **Add Objects**: 
   - Select a tool (Rectangle, Circle, etc.)
   - Click anywhere on the canvas
   - The object will appear at the click position

3. **Edit Text**:
   - Double-click any object
   - Type your text in the modal
   - Press `Ctrl+Enter` to save or click "Save"

4. **Connect Objects**:
   - Select the "Connection" tool or use "Select" tool
   - Drag from a connection point (small circle) on one object
   - Drop on a connection point of another object
   - An arrow will be created pointing from source to target

5. **Customize Objects**:
   - Select an object
   - Use the Properties Panel on the right to adjust:
     - **Fill Color**: Background color
     - **Stroke Color**: Border/line color
     - **Stroke Width**: Border thickness (1-10px)
     - **Size**: Width and height (or diameter for circles)

### Managing Pages

- **Create New Page**: Click the ➕ button in the Pages panel
- **Switch Pages**: Click on a page name
- **Rename Page**: Click the ✏️ button next to a page
- **Delete Page**: Click the 🗑️ button (you must have at least one page)

### Saving and Exporting

- **Auto-Save**: Changes are automatically saved to your browser every 2 seconds
- **Manual Save**: Click the 💾 **Save** button in the header
- **Export PNG**: Click the 📥 **Export PNG** button to download current page as image

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Backspace` or `Delete` | Delete selected objects/connections |
| `Escape` | Close text editing modal |
| `Ctrl+Enter` | Save text (while editing) |
| `Double-click` | Edit object text |

## 🏗️ Technical Stack

### Frontend
- **React** 18.3.1 - UI library
- **TypeScript** 5.6.2 - Type safety
- **Vite** 6.0.3 - Build tool and dev server
- **React Flow** (@xyflow/react) 12.3.8 - Canvas and node management
- **Zustand** 5.0.2 - State management
- **html-to-image** 1.11.11 - PNG export functionality

### Storage
- **IndexedDB** - Browser-based local storage (no backend required)

### Styling
- **CSS3** - Custom styling with modern features (gradients, shadows, animations)

## 📁 Project Structure

```
├── src/
│   ├── components/      # React components
│   │   ├── Canvas/      # Canvas and nodes
│   │   ├── Properties/  # Properties panel
│   │   ├── Sidebar/     # Page management
│   │   ├── Toolbar/     # Tool selection
│   │   └── common/      # Header and shared components
│   ├── stores/          # Zustand state management
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions (IndexedDB)
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Entry point
├── public/              # Static assets
├── package.json         # Dependencies
├── vite.config.ts       # Vite configuration
└── README.md                # This file
```

## 💾 Data Storage

All data is stored locally in your browser using IndexedDB:

- **Location**: Browser storage (not in files)
- **Persistence**: Data persists across browser sessions
- **Clearing Data**: Clearing browser data will delete all diagrams
- **Backup**: Use the Export PNG feature to save important diagrams

### Database Schema

**Pages Table**:
- `id`: Unique page identifier
- `name`: Page name
- `objects`: Array of objects (rectangles, circles, etc.)
- `connections`: Array of arrow connections
- `createdAt`: Creation timestamp
- `updatedAt`: Last modification timestamp

## 🛠️ Development

### Running Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` with hot module replacement.

### Building for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## 🐛 Known Issues

- ⚠️ Browser storage limits vary by browser (typically 50MB-1GB)
- ⚠️ Export PNG may not work properly on very large canvases
- ⚠️ Multi-tab editing not supported (changes in one tab won't reflect in another)

## 📝 License

This project is created for internal company use. All rights reserved.

## 🙏 Acknowledgments

- Built with [React Flow](https://reactflow.dev/) for the interactive canvas
- Icons and emojis for improved UX
- Inspired by [Miro](https://miro.com/) for modern-style whiteboarding app

---

**Version**: 1.0.0  
**Last Updated**: October 2025  

