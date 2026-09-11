"use client";

import { shallow } from "@liveblocks/client";
import {
  useCanRedo,
  useCanUndo,
  useOther,
  useRedo,
  useUndo,
} from "@liveblocks/react/suspense";
import {
  Cursors,
  useLiveblocksFlow,
  type CursorsCursorProps,
} from "@liveblocks/react-flow";
import { Cursor } from "@liveblocks/react-ui";
import {
  Background,
  BackgroundVariant,
  ControlButton,
  Controls,
  MiniMap,
  ReactFlow,
  type BuiltInEdge,
} from "@xyflow/react";
import {
  EditableNode,
  NODE_COLORS,
  type EditableNodeType,
} from "./nodes/EditableNode";
import { EmojiNode, type EmojiNodeType } from "./nodes/EmojiNode";
import { useTheme } from "./ThemeProvider";
import { Toolbar } from "./Toolbar";

export type FlowchartNode = EditableNodeType | EmojiNodeType;

const nodeTypes = {
  editable: EditableNode,
  emoji: EmojiNode,
};

// New rooms start with a single node; Liveblocks only uses this when Storage is empty.
const initialNodes: FlowchartNode[] = [
  {
    id: "start",
    type: "editable",
    position: { x: 0, y: 0 },
    data: { label: "Start here — double-click to edit", color: NODE_COLORS[5] },
    width: 240,
    height: 64,
  },
];

const initialEdges: BuiltInEdge[] = [];

/**
 * Names and colors come from each user's auth token (`info`), so we read them
 * from the connection instead of resolving users through an API.
 */
function UserCursor({ connectionId }: CursorsCursorProps) {
  const info = useOther(connectionId, (other) => other.info, shallow);
  return <Cursor color={info.color} label={info.name} />;
}

export function Flowchart() {
  const { theme } = useTheme();
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<FlowchartNode>({
      suspense: true,
      nodes: { initial: initialNodes },
      edges: { initial: initialEdges },
    });
  const undo = useUndo();
  const redo = useRedo();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDelete={onDelete}
      nodeTypes={nodeTypes}
      defaultEdgeOptions={{ type: "smoothstep" }}
      deleteKeyCode={["Backspace", "Delete"]}
      colorMode={theme}
      fitView
      fitViewOptions={{ maxZoom: 1 }}
    >
      <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
      <Cursors components={{ Cursor: UserCursor }} />
      <Toolbar />
      <Controls>
        <ControlButton onClick={undo} disabled={!canUndo} title="Undo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <path d="m11.983 5.626-4.641 4.643H21.36a9.358 9.358 0 0 1 0 18.714h-5.356V25.27h5.356a5.642 5.642 0 1 0 0-11.286H7.342l4.641 4.643-2.626 2.626-7.813-7.812a1.86 1.86 0 0 1 0-2.627L9.357 3z" />
          </svg>
        </ControlButton>
        <ControlButton onClick={redo} disabled={!canRedo} title="Redo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <path d="m19.735 5.626 4.642 4.643H10.358a9.358 9.358 0 0 0 0 18.714h5.357V25.27h-5.357a5.642 5.642 0 1 1 0-11.286h14.019l-4.642 4.643 2.626 2.626 7.814-7.812a1.86 1.86 0 0 0 0-2.627L22.36 3z" />
          </svg>
        </ControlButton>
      </Controls>
      <MiniMap
        zoomable
        pannable
        className="hidden sm:block"
        nodeColor={(node) =>
          node.type === "editable"
            ? ((node.data as EditableNodeType["data"]).color ?? NODE_COLORS[0])
            : "#a3a3a3"
        }
      />
    </ReactFlow>
  );
}
