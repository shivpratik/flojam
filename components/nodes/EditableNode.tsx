"use client";

import {
  Handle,
  NodeResizer,
  NodeToolbar,
  Position,
  useReactFlow,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { memo, useState } from "react";

export const NODE_COLORS = [
  "#94A3B8",
  "#F87171",
  "#FB923C",
  "#FACC15",
  "#4ADE80",
  "#38BDF8",
  "#A78BFA",
  "#F472B6",
];

export type EditableNodeType = Node<{ label: string; color?: string }, "editable">;

export const EditableNode = memo(
  ({ id, data, selected }: NodeProps<EditableNodeType>) => {
    const { updateNodeData } = useReactFlow();
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(data.label);
    const color = data.color ?? NODE_COLORS[0];

    function startEditing() {
      setDraft(data.label);
      setEditing(true);
    }

    function commit() {
      setEditing(false);
      const label = draft.trim() || "Untitled";
      if (label !== data.label) updateNodeData(id, { label });
    }

    return (
      <>
        <NodeResizer
          isVisible={selected && !editing}
          minWidth={80}
          minHeight={40}
          color="#0ea5e9"
        />
        <NodeToolbar
          isVisible={selected && !editing}
          className="flex gap-1 rounded-full bg-white p-1 shadow-md ring-1 ring-black/10 dark:bg-neutral-800 dark:ring-white/10"
        >
          {NODE_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => updateNodeData(id, { color: c })}
              aria-label={`Set color ${c}`}
              aria-pressed={c === color}
              className="size-6 cursor-pointer rounded-full ring-offset-2 ring-offset-white hover:scale-110 aria-pressed:ring-2 aria-pressed:ring-neutral-900 dark:ring-offset-neutral-800 dark:aria-pressed:ring-white"
              style={{ backgroundColor: c }}
            />
          ))}
          <button
            type="button"
            onClick={startEditing}
            className="cursor-pointer rounded-full px-2 text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            Rename
          </button>
        </NodeToolbar>

        <Handle type="target" position={Position.Top} />
        <div
          onDoubleClick={startEditing}
          className="editable-node flex h-full w-full items-center justify-center rounded-lg border-2 bg-white px-3 py-2 text-sm text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
          style={{ borderColor: color, backgroundColor: `${color}1f` }}
        >
          {editing ? (
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onFocus={(e) => e.target.select()}
              onKeyDown={(e) => {
                if (e.key === "Enter") commit();
                if (e.key === "Escape") setEditing(false);
              }}
              maxLength={80}
              className="nodrag w-full bg-transparent text-center outline-none"
            />
          ) : (
            <span className="line-clamp-3 break-words text-center">
              {data.label}
            </span>
          )}
        </div>
        <Handle type="source" position={Position.Bottom} />
      </>
    );
  }
);
EditableNode.displayName = "EditableNode";
