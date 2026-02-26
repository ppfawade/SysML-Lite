import React from 'react';
import { useStore } from '../store';
import { Plus, Box, FileText, User, Layout } from 'lucide-react';

export default function Sidebar() {
  const addElement = useStore(state => state.addElement);

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shadow-xl z-10">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h1 className="font-bold text-slate-800 flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded text-white flex items-center justify-center text-xs">SL</div>
          SysML Lite
        </h1>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Toolbox</div>
        
        <button 
          onClick={() => addElement('Block')}
          className="w-full flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-left group"
        >
          <div className="p-2 bg-blue-50 text-blue-600 rounded group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Box size={18} />
          </div>
          <div>
            <div className="font-medium text-sm text-slate-900">Block</div>
            <div className="text-xs text-slate-500">Structural element</div>
          </div>
          <Plus size={14} className="ml-auto text-slate-300 group-hover:text-blue-500" />
        </button>

        <button 
          onClick={() => addElement('Requirement')}
          className="w-full flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-amber-500 hover:shadow-md transition-all text-left group"
        >
          <div className="p-2 bg-amber-50 text-amber-600 rounded group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <FileText size={18} />
          </div>
          <div>
            <div className="font-medium text-sm text-slate-900">Requirement</div>
            <div className="text-xs text-slate-500">Functional req</div>
          </div>
          <Plus size={14} className="ml-auto text-slate-300 group-hover:text-amber-500" />
        </button>

        <button 
          onClick={() => addElement('UseCase')}
          className="w-full flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-purple-500 hover:shadow-md transition-all text-left group"
        >
          <div className="p-2 bg-purple-50 text-purple-600 rounded group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <Layout size={18} />
          </div>
          <div>
            <div className="font-medium text-sm text-slate-900">Use Case</div>
            <div className="text-xs text-slate-500">Behavior</div>
          </div>
          <Plus size={14} className="ml-auto text-slate-300 group-hover:text-purple-500" />
        </button>
      </div>
    </div>
  );
}
