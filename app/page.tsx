"use client"

import { useEffect, useMemo, useRef, useState } from "react"

type Item = {
  id: string
  label: string
  children?: Item[]
}

// Demo data
const data: Item[] = [
  {
    id: "fruits",
    label: "Fruits",
    children: [
      { id: "apple", label: "Apple" },
      { id: "banana", label: "Banana" },
      { id: "strawberry", label: "Strawberry" },
    ],
  },
  {
    id: "vegetables",
    label: "Vegetables",
    children: [
      { id: "carrot", label: "Carrot" },
      { id: "broccoli", label: "Broccoli" },
    ],
  },
  { id: "bread", label: "Bread" },
]

// Utility: collect all leaf IDs under a node (leaves = nodes without children)
function getLeafIds(node: Item): string[] {
  if (!node.children || node.children.length === 0) return [node.id]
  return node.children.flatMap(getLeafIds)
}

function getAllLeafIds(items: Item[]): string[] {
  return items.flatMap(getLeafIds)
}

type NodeState = {
  checked: boolean
  indeterminate: boolean
  totalLeaves: number
  selectedLeaves: number
}

// Compute checked/indeterminate by aggregating children
function computeNodeState(node: Item, selected: Set<string>): NodeState {
  if (!node.children || node.children.length === 0) {
    const checked = selected.has(node.id)
    return {
      checked,
      indeterminate: false,
      totalLeaves: 1,
      selectedLeaves: checked ? 1 : 0,
    }
  }

  let totalLeaves = 0
  let selectedLeaves = 0
  for (const child of node.children) {
    const state = computeNodeState(child, selected)
    totalLeaves += state.totalLeaves
    selectedLeaves += state.selectedLeaves
  }
  const checked = totalLeaves > 0 && selectedLeaves === totalLeaves
  const indeterminate = selectedLeaves > 0 && selectedLeaves < totalLeaves
  return { checked, indeterminate, totalLeaves, selectedLeaves }
}

function TreeNode({
  node,
  selected,
  setSelected,
  level = 0,
}: {
  node: Item
  selected: Set<string>
  setSelected: (next: Set<string>) => void
  level?: number
}) {
  const state = useMemo(() => computeNodeState(node, selected), [node, selected])
  const inputRef = useRef<HTMLInputElement>(null)
  const hasChildren = !!(node.children && node.children.length > 0)

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = state.indeterminate
  }, [state.indeterminate])

  const onParentToggle = () => {
    const selectAll = !(state.checked || state.indeterminate)
    const leaves = getLeafIds(node)
    const next = new Set(selected)
    if (selectAll) {
      for (const id of leaves) next.add(id)
    } else {
      for (const id of leaves) next.delete(id)
    }
    setSelected(next)
  }

  const onLeafToggle = (leafId: string) => {
    const next = new Set(selected)
    if (next.has(leafId)) next.delete(leafId)
    else next.add(leafId)
    setSelected(next)
  }

  const id = `cb-${node.id}`

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2" style={{ paddingLeft: level * 16 }}>
        <input
          ref={inputRef}
          id={id}
          type="checkbox"
          aria-checked={state.indeterminate ? "mixed" : state.checked}
          checked={state.checked}
          onChange={onParentToggle}
        />
        <label htmlFor={id} className="cursor-pointer">
          {node.label}
        </label>
        {hasChildren && (
          <span className="text-xs text-muted-foreground">
            {state.selectedLeaves}/{state.totalLeaves}
          </span>
        )}
      </div>

      {hasChildren && (
        <div className="flex flex-col gap-2">
          {node.children!.map((child) => {
            const childHasChildren = !!(child.children && child.children.length > 0)
            if (childHasChildren) {
              return (
                <TreeNode key={child.id} node={child} selected={selected} setSelected={setSelected} level={level + 1} />
              )
            }
            const childId = `cb-${child.id}`
            const checked = selected.has(child.id)
            return (
              <div key={child.id} className="flex items-center gap-2" style={{ paddingLeft: (level + 1) * 16 }}>
                <input id={childId} type="checkbox" checked={checked} onChange={() => onLeafToggle(child.id)} />
                <label htmlFor={childId} className="cursor-pointer">
                  {child.label}
                </label>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function SyntheticV0PageForDeployment() {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const allLeaves = useMemo(() => getAllLeafIds(data), [])
  const allSelected = selected.size === allLeaves.length

  const selectAll = () => setSelected(new Set(allLeaves))
  const clearAll = () => setSelected(new Set())

  return (
    <main className="mx-auto max-w-xl p-6">
      <header className="mb-6">
        <h1 className="text-balance text-2xl font-semibold">Nested tri-state checkboxes</h1>
        <p className="text-sm text-muted-foreground">
          Parent checkboxes become indeterminate when some but not all descendants are selected.
        </p>
      </header>

      <section className="mb-4 flex items-center gap-3">
        <button
          type="button"
          className="rounded border px-3 py-1 text-sm hover:bg-accent"
          onClick={allSelected ? clearAll : selectAll}
        >
          {allSelected ? "Clear all" : "Select all"}
        </button>
        <span className="text-xs text-muted-foreground">{selected.size} selected</span>
      </section>

      <section className="flex flex-col gap-3" aria-label="Grocery categories">
        {data.map((node) => (
          <TreeNode key={node.id} node={node} selected={selected} setSelected={setSelected} />
        ))}
      </section>
    </main>
  )
}
