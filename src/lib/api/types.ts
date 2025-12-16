import { LucideIcon } from "lucide-react";

export type KPIChangeType = "positive" | "negative" | "neutral";

export type DashboardKpi = {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: KPIChangeType;
  icon: LucideIcon;
  description?: string;
};

export type AlertLevel = "critical" | "warning" | "info";
export type AlertStatus = "open" | "acknowledged" | "resolved";

export type AlertItem = {
  id: string;
  title: string;
  level: AlertLevel;
  source: string;
  rule: string;
  time: string;
  status: AlertStatus;
  owner?: string;
};

export type RunHistoryRecord = {
  id: string;
  taskName: string;
  processType: string;
  status: "completed" | "running" | "failed" | "pending" | "delayed";
  progress: number;
  startTime: string;
  endTime?: string;
  duration?: string;
  operator: string;
};

export type AlertTrendPoint = {
  date: string;
  critical: number;
  warning: number;
  info: number;
};

export type HealthScore = {
  score: number;
  comment: string;
  risks: string[];
  tags: string[];
};

export type ProcessScheme = {
  id: string;
  name: string;
  model: string;
  project: string;
  status: "设计" | "仿真" | "试验" | "量产";
  version: string;
  tags: string[];
  updatedAt: string;
};

export type KnowledgeAsset = {
  id: string;
  title: string;
  type: "工艺模板" | "参数包" | "仿真报告" | "试验数据" | "量产数据";
  tags: string[];
  owner: string;
  updatedAt: string;
  description: string;
};

export type SimulationTask = {
  id: string;
  model: string;
  parameterSet: string;
  status: RunHistoryRecord["status"];
  progress: number;
  createdAt: string;
  updatedAt?: string;
  outputs?: string[];
};

export type PilotTask = {
  id: string;
  name: string;
  start: string;
  end: string;
  priority: "高" | "中" | "低";
  risk?: string;
  owner: string;
  status: RunHistoryRecord["status"];
};

export type ProductionSnapshot = {
  line: string;
  taktTime: string;
  yieldRate: string;
  wip: number;
  status: "online" | "paused" | "alert";
};

export type ModelCard = {
  id: string;
  name: string;
  type: string;
  version: string;
  status: "online" | "offline" | "testing";
  metrics: { label: string; value: string }[];
  scope: string;
};

export type CollaborationLane = {
  id: string;
  title: string;
  owner: string;
  status: RunHistoryRecord["status"];
  todos: string[];
  due: string;
};
