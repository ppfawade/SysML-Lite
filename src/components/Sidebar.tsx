import React, { useRef } from 'react';
import { useStore } from '../store';
import { Plus, Box, FileText, Layout, Activity, Package, Download, Upload, Image as ImageIcon, Code } from 'lucide-react';
import { toPng } from 'html-to-image';

export default function Sidebar() {
  const { addElement, nodes, edges, elements, loadState } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = JSON.stringify({ nodes, edges, elements }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sysml-model.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.nodes && json.edges && json.elements) {
          loadState(json);
        } else {
          alert('Invalid file format');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to parse JSON');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const getNodesBounds = (nodes: any[]) => {
    if (nodes.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    nodes.forEach(n => {
      const x = n.position.x;
      const y = n.position.y;
      const w = n.measured?.width || n.width || 150; 
      const h = n.measured?.height || n.height || 100;
      
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x + w > maxX) maxX = x + w;
      if (y + h > maxY) maxY = y + h;
    });

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  };

  const handleSaveImage = async () => {
    const viewport = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (!viewport) return;

    const bounds = getNodesBounds(nodes);
    const padding = 50;
    const width = bounds.width + padding * 2;
    const height = bounds.height + padding * 2;

    try {
      // Small delay to ensure rendering is stable
      await new Promise(resolve => setTimeout(resolve, 100));

      const dataUrl = await toPng(viewport, {
        backgroundColor: '#f8fafc',
        width: width,
        height: height,
        style: {
          width: `${width}px`,
          height: `${height}px`,
          transform: `translate(${-bounds.x + padding}px, ${-bounds.y + padding}px) scale(1)`,
        },
        filter: (node) => {
          // Exclude the minimap and controls from the export if they are inside the viewport
          const classList = (node as HTMLElement).classList;
          return !classList?.contains('react-flow__minimap') && !classList?.contains('react-flow__controls');
        }
      });

      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'sysml-diagram.png';
      a.click();
    } catch (err) {
      console.error('Failed to save image', err);
      alert('Failed to save image. Please try again.');
    }
  };

  const handleExportMermaid = () => {
    let mermaid = 'classDiagram\n';
    
    nodes.forEach(n => {
      const el = elements[n.data.elementId as string];
      if (!el) return;
      
      const safeName = el.name.replace(/[^a-zA-Z0-9_]/g, '_');
      const stereotype = el.type.toLowerCase();
      
      mermaid += `class ${safeName} {\n`;
      if (el.description) {
        // Sanitize description for mermaid notes/methods
        const descLines = el.description.split('\n');
        descLines.forEach(line => {
           if(line.trim()) mermaid += `  ${line.replace(/[{}]/g, '')}\n`;
        });
      }
      mermaid += `}\n`;
      mermaid += `<<${stereotype}>> ${safeName}\n`;
    });

    edges.forEach(e => {
      const sourceNode = nodes.find(n => n.id === e.source);
      const targetNode = nodes.find(n => n.id === e.target);
      
      if (sourceNode && targetNode) {
        const sEl = elements[sourceNode.data.elementId as string];
        const tEl = elements[targetNode.data.elementId as string];
        
        if (sEl && tEl) {
          const sName = sEl.name.replace(/[^a-zA-Z0-9_]/g, '_');
          const tName = tEl.name.replace(/[^a-zA-Z0-9_]/g, '_');
          
          let arrow = '-->'; // Default dependency
          if (e.label === 'Association') arrow = '--';
          else if (e.label === 'Composition') arrow = '*--';
          else if (e.label === 'Aggregation') arrow = 'o--';
          else if (e.label === 'Generalization') arrow = '<|--';
          else if (['satisfy', 'verify', 'refine', 'trace'].includes(e.label || '')) arrow = '..>';
          
          const label = e.label && !['Association', 'Composition', 'Aggregation', 'Generalization'].includes(e.label) ? `: ${e.label}` : '';
          
          mermaid += `${sName} ${arrow} ${tName} ${label}\n`;
        }
      }
    });

    const blob = new Blob([mermaid], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sysml-diagram.mmd';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shadow-xl z-10">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h1 className="font-bold text-slate-800 flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded text-white flex items-center justify-center text-xs">SL</div>
          SysML Lite
        </h1>
      </div>
      
      <div className="p-4 border-b border-slate-200 bg-white grid grid-cols-4 gap-2">
        <button onClick={handleExport} className="flex flex-col items-center justify-center p-2 rounded hover:bg-slate-100 text-slate-600 text-xs" title="Export JSON">
          <Download size={16} className="mb-1" />
          <span className="scale-75">JSON</span>
        </button>
        <button onClick={handleImportClick} className="flex flex-col items-center justify-center p-2 rounded hover:bg-slate-100 text-slate-600 text-xs" title="Import JSON">
          <Upload size={16} className="mb-1" />
          <span className="scale-75">Import</span>
        </button>
        <button onClick={handleSaveImage} className="flex flex-col items-center justify-center p-2 rounded hover:bg-slate-100 text-slate-600 text-xs" title="Save Image">
          <ImageIcon size={16} className="mb-1" />
          <span className="scale-75">PNG</span>
        </button>
        <button onClick={handleExportMermaid} className="flex flex-col items-center justify-center p-2 rounded hover:bg-slate-100 text-slate-600 text-xs" title="Export Mermaid">
          <Code size={16} className="mb-1" />
          <span className="scale-75">UML</span>
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept=".json"
        />
      </div>

      <div className="p-4 space-y-4 overflow-y-auto flex-1">
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

        <button 
          onClick={() => addElement('Activity')}
          className="w-full flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-orange-500 hover:shadow-md transition-all text-left group"
        >
          <div className="p-2 bg-orange-50 text-orange-600 rounded group-hover:bg-orange-600 group-hover:text-white transition-colors">
            <Activity size={18} />
          </div>
          <div>
            <div className="font-medium text-sm text-slate-900">Activity</div>
            <div className="text-xs text-slate-500">Action node</div>
          </div>
          <Plus size={14} className="ml-auto text-slate-300 group-hover:text-orange-500" />
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => addElement('Decision')}
            className="flex flex-col items-center gap-1 p-2 bg-white border border-slate-200 rounded-lg hover:border-amber-500 hover:shadow-md transition-all group"
          >
            <div className="w-6 h-6 rotate-45 border-2 border-amber-600 bg-amber-100 rounded-sm"></div>
            <div className="text-xs font-medium text-slate-700">Decision</div>
          </button>

          <button 
            onClick={() => addElement('Start')}
            className="flex flex-col items-center gap-1 p-2 bg-white border border-slate-200 rounded-lg hover:border-slate-800 hover:shadow-md transition-all group"
          >
            <div className="w-6 h-6 rounded-full bg-black"></div>
            <div className="text-xs font-medium text-slate-700">Start</div>
          </button>

          <button 
            onClick={() => addElement('End')}
            className="flex flex-col items-center gap-1 p-2 bg-white border border-slate-200 rounded-lg hover:border-slate-800 hover:shadow-md transition-all group"
          >
            <div className="w-6 h-6 rounded-full border-4 border-black bg-white flex items-center justify-center">
              <div className="w-2 h-2 bg-black rounded-full"></div>
            </div>
            <div className="text-xs font-medium text-slate-700">End</div>
          </button>

          <button 
            onClick={() => addElement('Fork')}
            className="flex flex-col items-center gap-1 p-2 bg-white border border-slate-200 rounded-lg hover:border-slate-800 hover:shadow-md transition-all group"
          >
            <div className="w-1 h-6 bg-black rounded-sm"></div>
            <div className="text-xs font-medium text-slate-700">Fork/Join</div>
          </button>
        </div>

        <button 
          onClick={() => addElement('Package')}
          className="w-full flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-yellow-500 hover:shadow-md transition-all text-left group"
        >
          <div className="p-2 bg-yellow-50 text-yellow-600 rounded group-hover:bg-yellow-600 group-hover:text-white transition-colors">
            <Package size={18} />
          </div>
          <div>
            <div className="font-medium text-sm text-slate-900">Package</div>
            <div className="text-xs text-slate-500">Grouping</div>
          </div>
          <Plus size={14} className="ml-auto text-slate-300 group-hover:text-yellow-500" />
        </button>
      </div>
    </div>
  );
}
