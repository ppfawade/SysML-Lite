import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { useStore } from '../store';

const SysMLNode = memo(({ data, selected }: NodeProps) => {
  const element = useStore(state => state.elements[data.elementId as string]);

  if (!element) return <div className="p-2 border border-red-500 bg-red-100 text-xs">Missing Data</div>;

  let bgColor = 'bg-white';
  let borderColor = selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-800';
  let headerColor = 'bg-transparent';

  if (element.type === 'Block') bgColor = 'bg-[#FFF8DC]'; // Cornsilk
  if (element.type === 'Requirement') bgColor = 'bg-[#F0F8F0]'; // Honeydew
  if (element.type === 'UseCase') {
    bgColor = 'bg-[#F5F5F5]';
    return (
      <div className={`relative group min-w-[120px] min-h-[60px] rounded-[50%] border ${borderColor} ${bgColor} flex items-center justify-center shadow-sm px-4`}>
        <Handle type="target" position={Position.Top} className="!bg-slate-800 w-3 h-3 -top-1.5" />
        <Handle type="source" position={Position.Bottom} className="!bg-slate-800 w-3 h-3 -bottom-1.5" />
        <div className="text-center">
          <div className="font-bold text-sm">{element.name}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative group min-w-[150px] rounded-sm border ${borderColor} ${bgColor} shadow-sm`}>
      {/* Handles - Increased size for easier snapping */}
      <Handle type="target" position={Position.Top} className="!bg-slate-800 w-3 h-3 -top-1.5" />
      <Handle type="source" position={Position.Bottom} className="!bg-slate-800 w-3 h-3 -bottom-1.5" />
      <Handle type="target" position={Position.Left} className="!bg-slate-800 w-3 h-3 -left-1.5" />
      <Handle type="source" position={Position.Right} className="!bg-slate-800 w-3 h-3 -right-1.5" />

      {/* Header */}
      <div className={`px-2 py-1 text-center border-b border-slate-800/20 ${headerColor}`}>
        <div className="text-[10px] italic text-slate-600">«{element.type.toLowerCase()}»</div>
        <div className="font-bold text-sm text-slate-900">{element.name}</div>
      </div>

      {/* Body */}
      <div className="p-2 min-h-[40px]">
        {element.properties.map((prop, i) => (
          <div key={i} className="text-xs text-slate-700 font-mono">{prop}</div>
        ))}
        {element.properties.length === 0 && <div className="text-[10px] text-slate-400 italic">No properties</div>}
      </div>
    </div>
  );
});

export default SysMLNode;
