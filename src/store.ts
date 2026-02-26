import { create } from 'zustand';
import { 
  Node, 
  Edge, 
  NodeChange, 
  EdgeChange, 
  Connection, 
  applyNodeChanges, 
  applyEdgeChanges, 
  addEdge,
  MarkerType
} from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';

// --- Types ---

export type SysMLElementType = 'Block' | 'Requirement' | 'Actor' | 'UseCase' | 'Activity' | 'Package' | 'Decision' | 'Start' | 'End' | 'Fork' | 'Join';

export interface SysMLElement {
  id: string;
  type: SysMLElementType;
  name: string;
  stereotype?: string;
  description: string;
}

interface AppState {
  nodes: Node[];
  edges: Edge[];
  elements: Record<string, SysMLElement>;
  
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  
  addElement: (type: SysMLElementType) => void;
  updateElement: (id: string, updates: Partial<SysMLElement>) => void;
  
  selectedElementId: string | null;
  selectElement: (id: string | null) => void;
  
  selectedEdgeId: string | null;
  selectEdge: (id: string | null) => void;
  updateEdge: (id: string, data: { label?: string; type?: string }) => void;
  removeEdge: (id: string) => void;
  
  loadState: (state: Partial<AppState>) => void;
}

// --- Initial Data (Proof of Life) ---

const initialBlockId = 'elem-1';
const initialReqId = 'elem-2';

const initialElements: Record<string, SysMLElement> = {
  [initialBlockId]: { id: initialBlockId, type: 'Block', name: 'Main System', description: 'power: Real\nmass: Real' },
  [initialReqId]: { id: initialReqId, type: 'Requirement', name: 'Performance Req', description: 'id: REQ-001\ntext: The system shall be fast.' },
};

const initialNodes: Node[] = [
  { id: 'node-1', type: 'sysmlNode', position: { x: 100, y: 100 }, data: { elementId: initialBlockId } },
  { id: 'node-2', type: 'sysmlNode', position: { x: 400, y: 100 }, data: { elementId: initialReqId } },
];

const initialEdges: Edge[] = [
  { 
    id: 'edge-1', 
    source: 'node-1', 
    target: 'node-2', 
    label: 'satisfy', 
    animated: false, 
    style: { strokeDasharray: '5,5' },
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed }
  }
];

export const useStore = create<AppState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  elements: initialElements,

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    set({
      edges: addEdge({ 
        ...connection, 
        type: 'smoothstep', // Orthogonal routing
        label: '', // Default no label
        animated: false,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#333' }, // Standard arrow
        style: { strokeWidth: 1.5, stroke: '#333' },
        labelBgStyle: { fill: '#ffffff', fillOpacity: 0.95 },
        labelStyle: { fill: '#1e293b', fontWeight: 500, fontSize: 12 }
      }, get().edges),
    });
  },

  addElement: (type) => {
    const id = uuidv4();
    const nodeId = `node-${id}`;
    
    let width = 150;
    let height = 100;
    let name = `New ${type}`;

    // Sizing based on type for better UX
    if (type === 'Decision') { width = 60; height = 60; name = '?'; }
    if (type === 'Start' || type === 'End') { width = 40; height = 40; name = ''; }
    if (type === 'Fork' || type === 'Join') { width = 10; height = 100; name = ''; }
    
    const newElement: SysMLElement = {
      id,
      type,
      name,
      description: ''
    };

    const newNode: Node = {
      id: nodeId,
      type: 'sysmlNode',
      position: { x: Math.random() * 400 + 50, y: Math.random() * 400 + 50 },
      data: { elementId: id },
      width, // Store initial dimensions
      height
    };

    set(state => ({
      elements: { ...state.elements, [id]: newElement },
      nodes: [...state.nodes, newNode]
    }));
  },

  updateElement: (id, updates) => {
    set(state => ({
      elements: {
        ...state.elements,
        [id]: { ...state.elements[id], ...updates }
      }
    }));
  },

  selectedElementId: null,
  selectElement: (id) => set({ selectedElementId: id, selectedEdgeId: null }),
  
  selectedEdgeId: null,
  selectEdge: (id) => set({ selectedEdgeId: id, selectedElementId: null }),

  updateEdge: (id, data) => {
    set(state => ({
      edges: state.edges.map(edge => {
        if (edge.id !== id) return edge;
        
        let newEdge = { ...edge, ...data };
        
        // Reset styles first
        newEdge.markerEnd = { type: MarkerType.ArrowClosed };
        newEdge.style = { strokeDasharray: undefined, strokeWidth: 1.5 };
        newEdge.animated = false;

        const label = data.label || edge.label || '';

        // SysML/UML Standard Styles
        if (label === 'Association') {
           newEdge.markerEnd = undefined; // Open line or specific arrow? usually open for simple association
        } else if (['Dependency', 'satisfy', 'verify', 'refine', 'trace'].includes(label)) {
           newEdge.style = { ...newEdge.style, strokeDasharray: '5,5' };
           newEdge.markerEnd = { type: MarkerType.ArrowClosed }; // Should be open arrow technically, but ArrowClosed is closest in default
           newEdge.animated = false; // Disable animation for export visibility
        } else if (label === 'Composition') {
           newEdge.markerStart = 'composition'; // Requires custom marker, fallback to standard for now
           newEdge.markerEnd = undefined;
        } else if (label === 'Aggregation') {
           newEdge.markerStart = 'aggregation';
           newEdge.markerEnd = undefined;
        } else if (label === 'Generalization') {
           newEdge.markerEnd = { type: MarkerType.ArrowClosed }; // Should be hollow triangle
        }

        return newEdge;
      })
    }));
  },

  removeEdge: (id) => {
    set(state => ({
      edges: state.edges.filter(e => e.id !== id),
      selectedEdgeId: null
    }));
  },

  loadState: (newState) => {
    set(state => ({
      ...state,
      ...newState,
      // Ensure we don't overwrite functions
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      onConnect: state.onConnect,
      addElement: state.addElement,
      updateElement: state.updateElement,
      selectElement: state.selectElement,
      selectEdge: state.selectEdge,
      updateEdge: state.updateEdge,
      removeEdge: state.removeEdge,
      loadState: state.loadState,
    }));
  }
}));
