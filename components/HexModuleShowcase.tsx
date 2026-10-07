"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./hex-module-showcase.css";

type ModuleItem = {
  id: string;
  title: string;
  description: string;
};

const modules: ModuleItem[] = [
  {
    id: "object-explorer",
    title: "Object Explorer",
    description:
      "Inspect SQL Server objects, source code, statistics, relations and object-level performance signals from a single interface.",
  },
  {
    id: "query-statistics",
    title: "Query Statistics",
    description:
      "Rank expensive queries by impact, duration, CPU, reads and execution count, with a risk score and plan-stability signal for each.",
  },
  {
    id: "index-advisor",
    title: "Index Advisor",
    description:
      "Review unused, duplicate, overlapping and risky existing indexes with explainable recommendations for safer tuning decisions.",
  },
  {
    id: "wait-statistics",
    title: "Wait Statistics",
    description:
      "Understand where SQL Server spends time waiting and distinguish CPU, IO, locking, memory and parallelism related bottlenecks.",
  },
  {
    id: "blocking-analysis",
    title: "Blocking Analysis",
    description:
      "Detect blocking chains, root blockers, waiting sessions and conflict patterns before they become production incidents.",
  },
  {
    id: "scheduled-jobs-review",
    title: "Scheduled Jobs",
    description:
      "Inspect SQL Agent jobs, recent failures, long-running executions and operational evidence on demand.",
  },
  {
    id: "security-audit",
    title: "Security Audit",
    description:
      "Review SQL Server security posture, risky permissions, weak settings and policy gaps, with CIS, ISO 27001 and NIST 800-53 references.",
  },
  {
    id: "ai-report",
    title: "Dashboard",
    description:
      "Refresh a snapshot of CPU, memory, workload, storage I/O and TempDB pressure on demand or with optional auto-refresh, with key health metrics rated against thresholds.",
  },
];

export default function HexModuleShowcase() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedModule = useMemo(
    () => modules.find((module) => module.id === selectedId) ?? null,
    [selectedId]
  );

  const isSelectedMode = selectedModule !== null;

  return (
    <section className={`hex-section ${isSelectedMode ? "selected-mode" : ""}`}>
      <div className="hex-stage">
        <motion.div className="hex-cluster" layout>
          {modules.map((module) => {
            const isActive = module.id === selectedId;

            return (
              <motion.button
                key={module.id}
                type="button"
                layout
                className={`hex-card ${isActive ? "active" : ""}`}
                onClick={() => setSelectedId(module.id)}
                aria-pressed={isActive}
                transition={{
                  type: "spring",
                  stiffness: 130,
                  damping: 20,
                  mass: 0.8,
                }}
                whileHover={{ scale: isSelectedMode ? 1.04 : 1.08 }}
                whileTap={{ scale: 0.96 }}
              >
                <span>{module.title}</span>
              </motion.button>
            );
          })}
        </motion.div>

        <AnimatePresence mode="wait">
          {selectedModule && (
            <motion.aside
              key={selectedModule.id}
              className="selected-panel"
              initial={{ opacity: 0, x: 90, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.92 }}
              transition={{
                type: "spring",
                stiffness: 110,
                damping: 20,
              }}
            >
              <div className="big-hex">
                <span>{selectedModule.title}</span>
              </div>

              <div className="selected-content">
                <span className="selected-label">Selected Module</span>
                <h2>{selectedModule.title}</h2>
                <p>{selectedModule.description}</p>

                <div className="selected-actions">
                  <button type="button" className="primary-action">
                    Explore Module
                  </button>

                  <button
                    type="button"
                    className="secondary-action"
                    onClick={() => setSelectedId(null)}
                  >
                    Back to all modules
                  </button>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
