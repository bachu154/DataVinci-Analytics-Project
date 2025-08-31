"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

const STORAGE_STATE_KEY = "dv_children_state_v1"
const STORAGE_EXPANDED_KEY = "dv_children_expanded_v1"

const DEFAULT_CHILDREN = {
  optionA: false,
  optionB: false,
  optionC: false,
}

function readJSON(key, fallback) {
  if (typeof window === "undefined") return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(key, value) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore quota or serialization errors
  }
}

// Memoized child checkbox to avoid unnecessary re-renders
const ChildItem = React.memo(function ChildItem({ id, label, checked, onChange }) {
  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15 }}
    >
      <div className="checkbox">
        <input type="checkbox" id={id} checked={checked} onChange={onChange} />
        <label htmlFor={id}>{label}</label>
      </div>
    </motion.li>
  )
})

function App() {
  const [childrenState, setChildrenState] = useState(() => readJSON(STORAGE_STATE_KEY, DEFAULT_CHILDREN))
  const [expanded, setExpanded] = useState(() => readJSON(STORAGE_EXPANDED_KEY, true))

  const parentRef = useRef(null)

  const { totalChildren, checkedCount, allChecked, noneChecked, someChecked } = useMemo(() => {
    const total = Object.keys(childrenState).length
    const checked = Object.values(childrenState).filter(Boolean).length
    return {
      totalChildren: total,
      checkedCount: checked,
      allChecked: checked === total && total > 0,
      noneChecked: checked === 0,
      someChecked: checked > 0 && checked < total,
    }
  }, [childrenState])

  // Keep native indeterminate in sync
  useEffect(() => {
    if (parentRef.current) {
      parentRef.current.indeterminate = someChecked
      parentRef.current.setAttribute("aria-checked", someChecked ? "mixed" : String(allChecked))
    }
  }, [someChecked, allChecked])

  // Persist checkbox and expanded state
  useEffect(() => {
    writeJSON(STORAGE_STATE_KEY, childrenState)
  }, [childrenState])

  useEffect(() => {
    writeJSON(STORAGE_EXPANDED_KEY, expanded)
  }, [expanded])

  const handleParentChange = useCallback(
    (e) => {
      const { checked } = e.target
      const updated = Object.keys(childrenState).reduce((acc, key) => {
        acc[key] = checked
        return acc
      }, {})
      setChildrenState(updated)
    },
    [childrenState],
  )

  const handleChildChange = useCallback(
    (key) => (e) => {
      const { checked } = e.target
      setChildrenState((prev) => {
        if (prev[key] === checked) return prev // no-op to prevent extra renders
        return { ...prev, [key]: checked }
      })
    },
    [],
  )

  const toggleExpanded = useCallback(() => {
    setExpanded((v) => !v)
  }, [])

  // Single button that toggles all on/off
  const handleSelectToggle = useCallback(() => {
    const target = !allChecked
    const updated = Object.keys(childrenState).reduce((acc, key) => {
      acc[key] = target
      return acc
    }, {})
    setChildrenState(updated)
  }, [allChecked, childrenState])

  return (
    <main className="app" role="main">
      <header className="app-header" role="banner">
        <h1 className="title text-balance">Data Vinci</h1>
        <p className="subtitle">Responsive nested checkbox demo</p>
      </header>

      <section className="card" aria-labelledby="preferences-heading">
        <div className="toolbar" role="toolbar" aria-label="Quick actions">
          <button type="button" className="btn" onClick={handleSelectToggle} aria-pressed={allChecked}>
            {allChecked ? "Clear All" : "Select All"}
          </button>
        </div>

        <h2 id="preferences-heading" className="sr-only">
          Preferences
        </h2>

        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <fieldset className="fieldset">
            <legend className="legend">Select items</legend>

            <div className="responsive-row">
              <div className="parent-block">
                <div className="checkbox">
                  <input
                    ref={parentRef}
                    type="checkbox"
                    id="parent-checkbox"
                    checked={allChecked}
                    onChange={handleParentChange}
                    aria-controls="children-group"
                  />
                  <label htmlFor="parent-checkbox">Select All</label>

                  <button
                    type="button"
                    className="expander-btn"
                    aria-expanded={expanded}
                    aria-controls="children-group"
                    onClick={toggleExpanded}
                  >
                    {expanded ? "Collapse" : "Expand"}
                  </button>
                </div>

                <p id="helper" className="helper" aria-live="polite">
                  {allChecked
                    ? "All items selected"
                    : someChecked
                      ? `${checkedCount} of ${totalChildren} selected`
                      : "No items selected"}
                </p>
              </div>

              <div style={{ width: "100%" }}>
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.ul
                      key="children-list"
                      id="children-group"
                      className="children-list"
                      role="group"
                      aria-label="Options"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <ChildItem
                        id="child-a"
                        label="Option A"
                        checked={childrenState.optionA}
                        onChange={handleChildChange("optionA")}
                      />
                      <ChildItem
                        id="child-b"
                        label="Option B"
                        checked={childrenState.optionB}
                        onChange={handleChildChange("optionB")}
                      />
                      <ChildItem
                        id="child-c"
                        label="Option C"
                        checked={childrenState.optionC}
                        onChange={handleChildChange("optionC")}
                      />
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </fieldset>
        </form>
      </section>

      <footer className="app-footer" role="contentinfo">
        <small>Built with React useState, Framer Motion, and localStorage</small>
      </footer>
    </main>
  )
}

export default App
