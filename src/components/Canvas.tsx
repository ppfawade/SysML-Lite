import React from 'react';
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useStore } from '../store';
import SysMLNode from './SysMLNode';

const nodeTypes = {
  sysmlNode: SysMLNode,
};

export default function Canvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, selectElement, selectEdge } = useStore();

  return (
    <div className="w-full h-full bg-slate-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => selectElement(node.data.elementId as string)}
        onEdgeClick={(_, edge) => selectEdge(edge.id)}
        onPaneClick={() => { selectElement(null); selectEdge(null); }}
        fitView
      >
        <svg id="sysml-markers" style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0, pointerEvents: 'none' }}>
          <defs>
            <marker
              id="composition"
              viewBox="0 0 10 10"
              refX="10"
              refY="5"
              markerWidth="12"
              markerHeight="12"
              orient="auto-start-reverse"
            >
              <path d="M 0 5 L 5 0 L 10 5 L 5 10 z" fill="#333" stroke="#333" strokeWidth="1" />
            </marker>
            <marker
              id="aggregation"
              viewBox="0 0 10 10"
              refX="10"
              refY="5"
              markerWidth="12"
              markerHeight="12"
              orient="auto-start-reverse"
            >
              <path d="M 0 5 L 5 0 L 10 5 L 5 10 z" fill="white" stroke="#333" strokeWidth="1" />
            </marker>
            <marker
              id="generalization"
              viewBox="0 0 10 10"
              refX="10"
              refY="5"
              markerWidth="12"
              markerHeight="12"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="white" stroke="#333" strokeWidth="1" />
            </marker>
          </defs>
        </svg>
        <Background color="#cbd5e1" gap={20} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
