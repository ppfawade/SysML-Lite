import { create } from 'zustand';
import { 
  Node, 
  Edge, 
  NodeChange, 
  EdgeChange, 
  Connection, 
  applyNodeChanges, 
  applyEdgeChanges, 
  addEdge 
} from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';

// --- Types ---

export type SysMLElementType = 'Block' | 'Requirement' | 'Actor' | 'UseCase' | 'Activity' | 'Package';

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
  { id: 'edge-1', source: 'node-1', target: 'node-2', label: 'satisfy', type: 'default', animated: true, style: { strokeDasharray: '5,5' } }
];

// --- Store ---

export const useStore = create<AppState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  elements: initialElements,
  selectedElementId: null,
  selectedEdgeId: null,

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
      edges: addEdge({ ...connection, type: 'default', label: 'dependency', animated: true, style: { strokeDasharray: '5,5' } }, get().edges),
    });
  },

  addElement: (type) => {
    const id = uuidv4();
    const nodeId = `node-${id}`;
    
    const newElement: SysMLElement = {
      id,
      type,
      name: `New ${type}`,
      description: ''
    };

    const newNode: Node = {
      id: nodeId,
      type: 'sysmlNode',
      position: { x: Math.random() * 400 + 50, y: Math.random() * 400 + 50 },
      data: { elementId: id }
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

  selectElement: (id) => set({ selectedElementId: id, selectedEdgeId: null }),
  
  selectEdge: (id) => set({ selectedEdgeId: id, selectedElementId: null }),

  updateEdge: (id, data) => {
    set(state => ({
      edges: state.edges.map(edge => {
        if (edge.id !== id) return edge;
        
        // Apply SysML styling based on "type" (which we store in label or a custom field, but here we simplify)
        // Actually, let's use the 'data' passed in to configure the edge
        let newEdge = { ...edge, ...data };
        
        // Helper to style based on label/type intent
        if (data.label === 'Association') {
           newEdge.animated = false;
           newEdge.style = { strokeDasharray: undefined };
        } else if (['Dependency', 'satisfy', 'verify', 'refine', 'trace'].includes(data.label || '')) {
           newEdge.animated = true;
           newEdge.style = { strokeDasharray: '5,5' };
        } else if (['Aggregation', 'Composition', 'Containment'].includes(data.label || '')) {
           newEdge.animated = false;
           newEdge.style = { strokeDasharray: undefined };
           // Note: Actual diamond markers require custom edge types or SVG definitions, 
           // but for now we just handle the line style.
        } else if (data.label === 'Generalization') {
           newEdge.animated = false;
           newEdge.style = { strokeDasharray: undefined };
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
