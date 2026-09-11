"use client";

import {
  Handle,
  NodeToolbar,
  Position,
  useReactFlow,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { memo } from "react";

export const EMOJIS = ["🚀", "🔥", "✨", "💡", "✅", "❓"] as const;

export type EmojiNodeType = Node<{ emoji: string }, "emoji">;

export const EmojiNode = memo(({ id, data, selected }: NodeProps<EmojiNodeType>) => {
  const { emoji = EMOJIS[0] } = data;
  const { updateNodeData } = useReactFlow();

  return (
    <>
      <NodeToolbar
        isVisible={selected}
        className="flex gap-1 rounded-full bg-white p-1 shadow-md ring-1 ring-black/10 dark:bg-neutral-800 dark:ring-white/10"
      >
        {EMOJIS.map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => updateNodeData(id, { emoji: e })}
            aria-label={`Select emoji ${e}`}
            aria-pressed={e === emoji}
            className="size-8 cursor-pointer rounded-full hover:bg-neutral-100 aria-pressed:bg-neutral-200 dark:hover:bg-neutral-700 dark:aria-pressed:bg-neutral-700"
          >
            {e}
          </button>
        ))}
      </NodeToolbar>
      <div className="flex h-full w-full items-center justify-center rounded-lg border-2 border-neutral-300 bg-white text-3xl dark:border-neutral-700 dark:bg-neutral-900">
        {emoji}
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </>
  );
});
EmojiNode.displayName = "EmojiNode";
