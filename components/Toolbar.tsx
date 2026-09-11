"use client";

import { Panel, useReactFlow, useStore, useStoreApi } from "@xyflow/react";
import { nanoid } from "nanoid";
import type { FlowchartNode } from "./Flowchart";

const buttonClass =
  "inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent dark:hover:bg-neutral-800";

export function Toolbar() {
  const { addNodes, deleteElements, getNodes, getEdges, getViewport } =
    useReactFlow<FlowchartNode>();
  const store = useStoreApi();
  const hasSelection = useStore(
    (s) => s.nodes.some((n) => n.selected) || s.edges.some((e) => e.selected)
  );

  /** Canvas coordinates of the viewport center, slightly jittered so nodes don't stack. */
  function centerPosition(width: number, height: number) {
    const { x, y, zoom } = getViewport();
    const { width: w, height: h } = store.getState();
    const jitter = () => (Math.random() - 0.5) * 60;
    return {
      x: (w / 2 - x) / zoom - width / 2 + jitter(),
      y: (h / 2 - y) / zoom - height / 2 + jitter(),
    };
  }

  function addBox() {
    addNodes({
      id: nanoid(),
      type: "editable",
      position: centerPosition(160, 56),
      data: { label: "New step" },
      width: 160,
      height: 56,
    });
  }

  function addEmoji() {
    addNodes({
      id: nanoid(),
      type: "emoji",
      position: centerPosition(72, 72),
      data: { emoji: "🚀" },
      width: 72,
      height: 72,
    });
  }

  function deleteSelected() {
    deleteElements({
      nodes: getNodes().filter((n) => n.selected),
      edges: getEdges().filter((e) => e.selected),
    });
  }

  return (
    <Panel
      position="top-left"
      className="flex items-center gap-1 rounded-xl border border-neutral-200 bg-white p-1 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
    >
      <button type="button" onClick={addBox} className={buttonClass}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
          <rect x="3" y="6" width="18" height="12" rx="2" />
        </svg>
        Add step
      </button>
      <button type="button" onClick={addEmoji} className={buttonClass}>
        <span aria-hidden>🚀</span>
        Emoji
      </button>
      <div className="mx-1 h-5 w-px bg-neutral-200 dark:bg-neutral-700" />
      <button
        type="button"
        onClick={deleteSelected}
        disabled={!hasSelection}
        className={`${buttonClass} text-red-600 dark:text-red-400`}
        title="Delete selected (Backspace)"
      >
        Delete
      </button>
    </Panel>
  );
}
