import React from 'react';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';

export default function App() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100">
      <Sidebar />
      <div className="flex-1 relative h-full">
        <Canvas />
      </div>
      <PropertiesPanel />
    </div>
  );
}
