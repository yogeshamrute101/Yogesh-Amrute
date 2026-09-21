import React, { useEffect, useMemo, useState } from "react";

type Module = {
  name: string;
  status: "ACTIVE" | "READY" | "MONITORING";
  purpose: string;
};

const modules: Module[] = [
  { name: "MasterMind", status: "ACTIVE", purpose: "Central reasoning, planning and orchestration" },
  { name: "Universal Core", status: "ACTIVE", purpose: "Universal capability foundation" },
  { name: "Multi-Tasking", status: "ACTIVE", purpose: "Parallel task execution and dependencies" },
  { name: "24×7 Always-On", status: "MONITORING", purpose: "Heartbeat, health and recovery" },
  { name: "Gap Utilization", status: "ACTIVE", purpose: "Find empty, unused and incomplete resources" },
  { name: "System Integrity", status: "ACTIVE", purpose: "Find missing capabilities and system gaps" },
  { name: "Safety Intelligence", status: "ACTIVE", purpose: "Preventive and corrective safety workflow" },
  { name: "World Intelligence", status: "READY", purpose: "World, environment and infrastructure understanding" },
  { name: "Scientific Research", status: "READY", purpose: "Research, evidence, hypotheses and validation" },
  { name: "Long-Term Thinking", status: "ACTIVE", purpose: "Goals, risks, dependencies and replanning" },
  { name: "Physical AI", status: "READY", purpose: "Simulation-first physical system orchestration" },
  { name: "Connectivity", status: "READY", purpose: "Authorized network, API and device connectivity" },
  { name: "Capability Control", status: "ACTIVE", purpose: "Permission, resource and execution control" },
  { name: "Human-Computer Command", status: "ACTIVE", purpose: "Natural-language command interface" },
  { name: "Learning", status: "ACTIVE", purpose: "Verification, feedback and continuous improvement" },
];

export default function SystemFrontline() {
  const [uptime, setUptime] = useState(0);
  const [runningTasks, setRunningTasks] = useState(0);
  const [message, setMessage] = useState("System operating normally.");

  useEffect(() => {
    const started = Date.now();
    const timer = setInterval(() => {
      setUptime(Date.now() - started);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const active = useMemo(
    () => modules.filter((m) => m.status === "ACTIVE").length,
    []
  );

  const formatUptime = (ms: number) => {
    const sec = Math.floor(ms / 1000);
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const runScan = () => {
    setMessage("Full system scan completed. Checking gaps, resources and capabilities.");
  };

  const runTask = () => {
    setRunningTasks((v) => v + 1);
    setMessage("Multi-tasking engine accepted a new task.");
  };

  const recover = () => {
    setMessage("Recovery workflow initiated. System remains in safe operating mode.");
  };

  return (
    <section style={{ padding: 24, color: "inherit" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
        flexWrap: "wrap",
        marginBottom: 24
      }}>
        <div>
          <h1 style={{ margin: 0 }}>System Frontline</h1>
          <p style={{ opacity: 0.7, marginTop: 8 }}>
            Unified command center for the complete VidoAI system.
          </p>
        </div>

        <div style={{
          padding: "10px 16px",
          borderRadius: 12,
          border: "1px solid rgba(0,255,120,.35)"
        }}>
          ● SYSTEM ONLINE
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
        gap: 12,
        marginBottom: 24
      }}>
        {[
          ["Modules Active", active],
          ["Tasks Running", runningTasks],
          ["24×7", "ON"],
          ["Uptime", formatUptime(uptime)],
        ].map(([label, value]) => (
          <div key={label} style={{
            padding: 18,
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,.12)"
          }}>
            <div style={{ opacity: 0.65, fontSize: 13 }}>{label}</div>
            <div style={{ fontSize: 25, fontWeight: 700, marginTop: 6 }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        marginBottom: 20
      }}>
        <button onClick={runScan}>Run Full Scan</button>
        <button onClick={runTask}>Start Multi-Task</button>
        <button onClick={recover}>Recovery Check</button>
      </div>

      <div style={{
        padding: 14,
        borderRadius: 12,
        marginBottom: 20,
        border: "1px solid rgba(255,255,255,.12)"
      }}>
        {message}
      </div>

      <h2>System Capabilities</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
        gap: 12
      }}>
        {modules.map((module) => (
          <div key={module.name} style={{
            padding: 16,
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,.12)"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 8
            }}>
              <strong>{module.name}</strong>
              <small>{module.status}</small>
            </div>
            <p style={{ opacity: 0.7, fontSize: 13 }}>
              {module.purpose}
            </p>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 24,
        padding: 18,
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,.12)"
      }}>
        <h2 style={{ marginTop: 0 }}>Master System Flow</h2>
        <p style={{ lineHeight: 1.8, opacity: 0.8 }}>
          OBSERVE → UNDERSTAND → REMEMBER → REASON → PLAN → MULTI-TASK
          → ACT → VERIFY → RECOVER → LEARN → IMPROVE
        </p>
      </div>
    </section>
  );
}
