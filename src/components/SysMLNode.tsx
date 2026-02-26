import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { useStore } from '../store';

const SysMLNode = memo(({ data, selected }: NodeProps) => {
  const element = useStore(state => state.elements[data.elementId as string]);

  if (!element) return <div className="p-2 border border-red-500 bg-red-100 text-xs">Missing Data</div>;

  let bgColor = 'bg-white';
  let borderColor = selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-800';
  let headerColor = 'bg-transparent';

  // Common Handles
  const Handles = () => (
    <>
      <Handle type="target" position={Position.Top} className="!bg-slate-800 w-10 h-10 -top-5 opacity-0 group-hover:opacity-50 transition-opacity rounded-full" />
      <Handle type="source" position={Position.Bottom} className="!bg-slate-800 w-10 h-10 -bottom-5 opacity-0 group-hover:opacity-50 transition-opacity rounded-full" />
      <Handle type="target" position={Position.Left} className="!bg-slate-800 w-10 h-10 -left-5 opacity-0 group-hover:opacity-50 transition-opacity rounded-full" />
      <Handle type="source" position={Position.Right} className="!bg-slate-800 w-10 h-10 -right-5 opacity-0 group-hover:opacity-50 transition-opacity rounded-full" />
    </>
  );

  // Common Description Component
  const DescriptionContent = () => (
    <div className="w-full">
      {element.description ? (
        <div className="text-xs text-slate-700 font-mono whitespace-pre-wrap leading-tight text-left">
          {element.description}
        </div>
      ) : (
        <div className="text-[10px] text-slate-400 italic text-center">No description</div>
      )}
    </div>
  );

  if (element.type === 'Start') {
    return (
      <div className={`relative group w-6 h-6 rounded-full bg-black border-2 border-slate-800 shadow-sm ${selected ? 'ring-2 ring-blue-400' : ''}`}>
        <Handles />
      </div>
    );
  }

  if (element.type === 'End') {
    return (
      <div className={`relative group w-8 h-8 rounded-full bg-white border-4 border-black flex items-center justify-center shadow-sm ${selected ? 'ring-2 ring-blue-400' : ''}`}>
        <div className="w-4 h-4 bg-black rounded-full" />
        <Handles />
      </div>
    );
  }

  if (element.type === 'Decision') {
    return (
      <div className={`relative group w-12 h-12 rotate-45 bg-[#FEF3C7] border-2 border-amber-600 flex items-center justify-center shadow-sm ${selected ? 'ring-2 ring-blue-400' : ''}`}>
        <div className="-rotate-45 text-xs font-bold text-amber-900">{element.name !== '?' ? element.name : ''}</div>
        <Handles />
      </div>
    );
  }

  if (element.type === 'Fork' || element.type === 'Join') {
    return (
      <div className={`relative group w-4 h-24 bg-slate-900 rounded-sm shadow-sm ${selected ? 'ring-2 ring-blue-400' : ''}`}>
        <Handles />
      </div>
    );
  }

  if (element.type === 'UseCase') {
    return (
      <div className={`relative group min-w-[140px] min-h-[70px] rounded-[50%] border ${borderColor} bg-[#F5F5F5] flex flex-col items-center justify-center shadow-sm px-6 py-4`}>
        <Handles />
        <div className="text-center mb-1">
          <div className="font-bold text-sm">{element.name}</div>
        </div>
        {element.description && (
          <div className="text-xs text-slate-700 font-mono whitespace-pre-wrap leading-tight text-center max-w-full overflow-hidden text-ellipsis">
            {element.description}
          </div>
        )}
      </div>
    );
  }

  if (element.type === 'Activity') {
    return (
      <div className={`relative group min-w-[140px] min-h-[80px] rounded-[20px] border-2 ${borderColor} bg-white flex flex-col items-center shadow-sm overflow-hidden`}>
        <Handles />
        <div className="w-full text-center p-2 border-b border-slate-100">
          <div className="text-[10px] italic text-slate-600">«activity»</div>
          <div className="font-bold text-sm">{element.name}</div>
        </div>
        <div className="w-full p-2 bg-slate-50/50 flex-1">
          <DescriptionContent />
        </div>
      </div>
    );
  }

  if (element.type === 'Package') {
    return (
      <div className="relative group min-w-[140px]">
        <Handles />
        <div className={`absolute -top-6 left-0 bg-[#FFF8DC] border border-b-0 ${borderColor} px-2 py-1 text-xs h-7 min-w-[60px] max-w-[120px] rounded-t-sm z-10 truncate`}>
          <span className="font-bold">{element.name}</span>
        </div>
        <div className={`bg-[#FFF8DC] border ${borderColor} rounded-sm rounded-tl-none min-h-[80px] shadow-sm pt-4 relative z-0`}>
          <div className="p-2">
            <DescriptionContent />
          </div>
        </div>
      </div>
    );
  }

  if (element.type === 'Block') bgColor = 'bg-[#FFF8DC]'; // Cornsilk
  if (element.type === 'Requirement') bgColor = 'bg-[#F0F8F0]'; // Honeydew

  return (
    <div className={`relative group min-w-[150px] rounded-sm border ${borderColor} ${bgColor} shadow-sm`}>
      <Handles />

      {/* Header */}
      <div className={`px-2 py-1 text-center border-b border-slate-800/20 ${headerColor}`}>
        <div className="text-[10px] italic text-slate-600">«{element.type.toLowerCase()}»</div>
        <div className="font-bold text-sm text-slate-900">{element.name}</div>
      </div>

      {/* Body */}
      <div className="p-2 min-h-[40px]">
        {element.description ? (
          <div className="text-xs text-slate-700 font-mono whitespace-pre-wrap leading-tight">
            {element.description}
          </div>
        ) : (
          <div className="text-[10px] text-slate-400 italic">No description</div>
        )}
      </div>
    </div>
  );
});

export default SysMLNode;
