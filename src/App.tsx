import React from 'react';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100">
      <div className="flex flex-1 overflow-hidden w-full">
        <Sidebar />
        <div className="flex-1 relative h-full">
          <Canvas />
        </div>
        <PropertiesPanel />
      </div>
      <Footer />
    </div>
  );
}
