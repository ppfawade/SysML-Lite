import React from 'react';
import { useStore } from '../store';

export default function PropertiesPanel() {
  const { elements, selectedElementId, updateElement, selectedEdgeId, edges, updateEdge, selectEdge, selectElement } = useStore();
  
  const selectedElement = selectedElementId ? elements[selectedElementId] : null;
  const selectedEdge = selectedEdgeId ? edges.find(e => e.id === selectedEdgeId) : null;

  if (selectedEdge) {
    return (
      <div className="w-64 bg-white border-l border-slate-200 flex flex-col h-full shadow-xl z-10">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Edge Properties</h3>
          <button onClick={() => selectEdge(null)} className="text-xs text-blue-600 hover:underline">Close</button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Relationship</label>
            <select 
              value={selectedEdge.label as string || 'Dependency'}
              onChange={(e) => updateEdge(selectedEdge.id, { label: e.target.value })}
              className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Dependency">Dependency</option>
              <option value="satisfy">«satisfy»</option>
              <option value="verify">«verify»</option>
              <option value="Association">Association</option>
            </select>
          </div>
          <div className="text-xs text-slate-400">
            ID: {selectedEdge.id}
          </div>
        </div>
      </div>
    );
  }

  if (!selectedElement) {
    return (
      <div className="w-64 bg-slate-50 border-l border-slate-200 p-8 text-center text-slate-400 text-sm flex flex-col items-center justify-center">
        <div className="mb-2">Select an element or connector to edit properties</div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-white border-l border-slate-200 flex flex-col h-full shadow-xl z-10">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <h3 className="font-bold text-slate-800">Properties</h3>
        <button onClick={() => selectElement(null)} className="text-xs text-blue-600 hover:underline">Close</button>
      </div>
      
      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Name</label>
          <input 
            value={selectedElement.name}
            onChange={(e) => updateElement(selectedElement.id, { name: e.target.value })}
            className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Type</label>
          <div className="text-sm font-mono bg-slate-100 px-3 py-2 rounded text-slate-600">
            {selectedElement.type}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">ID</label>
          <div className="text-xs font-mono text-slate-400 truncate">
            {selectedElement.id}
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4 mt-2">
          <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase">Description</label>
          <textarea
            value={selectedElement.description}
            onChange={(e) => updateElement(selectedElement.id, { description: e.target.value })}
            placeholder="Enter description or properties..."
            className="w-full text-xs border border-slate-300 rounded px-2 py-2 min-h-[150px] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>
      </div>
    </div>
  );
}
