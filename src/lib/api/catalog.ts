import { mockRequest } from "./client";
import {
  CollaborationLane,
  KnowledgeAsset,
  ModelCard,
  PilotTask,
  ProcessScheme,
  ProductionSnapshot,
  SimulationTask,
} from "./types";

export async function getProcessSchemes(): Promise<ProcessScheme[]> {
  return mockRequest([
    {
      id: "pd-1",
      name: "前舱铝合金 SPR 方案",
      model: "AL-SPR",
      project: "Gemini",
      status: "设计",
      version: "v2.3",
      tags: ["SUV", "轻量化"],
      owner: "工艺-马宁",
      progress: 62,
      updatedAt: "2024-05-05",
    },
    {
      id: "pd-2",
      name: "车门内板加强方案",
      model: "Steel-Heat",
      project: "Gemini",
      status: "仿真",
      version: "v1.8",
      tags: ["高强钢", "热处理"],
      owner: "工艺-李旸",
      progress: 48,
      updatedAt: "2024-05-04",
    },
    {
      id: "pd-3",
      name: "电池托盘 SPR 方案",
      model: "PACK-SPR",
      project: "Altair",
      status: "量产",
      version: "v3.1",
      tags: ["新能源", "电池包"],
      owner: "工艺-韩雪",
      progress: 100,
      updatedAt: "2024-05-02",
    },
    {
      id: "pd-4",
      name: "门环铆接降本方案",
      model: "Cost-Opt",
      project: "Gemini",
      status: "试验",
      version: "v1.2",
      tags: ["降本", "试验中"],
      owner: "工艺-徐野",
      progress: 73,
      updatedAt: "2024-05-03",
    },
  ]);
}

export async function getKnowledgeAssets(): Promise<KnowledgeAsset[]> {
  return mockRequest([
    {
      id: "kb-1",
      title: "铝合金 SPR 参数模板",
      type: "参数包",
      tags: ["铝合金", "轻量化"],
      owner: "工艺-马宁",
      updatedAt: "2024-05-05",
      description: "包含推荐铆接力、速度、压入深度的基线参数",
      usage: 24,
    },
    {
      id: "kb-2",
      title: "高强钢仿真报告",
      type: "仿真报告",
      tags: ["高强钢", "碰撞"],
      owner: "仿真-李晨",
      updatedAt: "2024-05-04",
      description: "最新碰撞 CAE 结果与 SPR 失效模式分析",
      usage: 15,
    },
    {
      id: "kb-3",
      title: "试验数据包-Q2",
      type: "试验数据",
      tags: ["疲劳", "强度"],
      owner: "试验-周逸",
      updatedAt: "2024-05-03",
      description: "Q2 试验批次的原始记录和结果汇总",
      usage: 8,
    },
    {
      id: "kb-4",
      title: "量产过程参数卡片",
      type: "量产数据",
      tags: ["总装", "SPC"],
      owner: "质量-王磊",
      updatedAt: "2024-05-02",
      description: "含关键特性上下限、控制计划与采样频率",
      usage: 30,
    },
  ]);
}

export async function getSimulationTasks(): Promise<SimulationTask[]> {
  return mockRequest([
    {
      id: "sim-1",
      model: "Transformer 异常检测",
      parameterSet: "Al-SPR baseline",
      status: "running",
      progress: 62,
      createdAt: "2024-05-05 09:00",
      updatedAt: "2024-05-05 10:15",
      outputs: ["logs.zip"],
      inputFiles: ["dataset.csv", "config.json"],
    },
    {
      id: "sim-2",
      model: "参数推荐 V3",
      parameterSet: "door-inner steel",
      status: "completed",
      progress: 100,
      createdAt: "2024-05-04 16:20",
      updatedAt: "2024-05-04 17:10",
      outputs: ["report.pdf", "result.csv"],
      inputFiles: ["door-inner.xlsx"],
    },
    {
      id: "sim-3",
      model: "RL 排产优化",
      parameterSet: "pack-line",
      status: "failed",
      progress: 35,
      createdAt: "2024-05-05 07:30",
      updatedAt: "2024-05-05 08:00",
      inputFiles: ["pack-line.json"],
    },
  ]);
}

export async function getPilotSchedule(): Promise<PilotTask[]> {
  return mockRequest([
    {
      id: "pt-1",
      name: "电池包疲劳试验",
      start: "2024-05-05 09:00",
      end: "2024-05-08 18:00",
      priority: "高",
      risk: "场地冲突",
      owner: "试验-赵璇",
      status: "running",
      location: "A2 实验室",
    },
    {
      id: "pt-2",
      name: "门环强度验证",
      start: "2024-05-06 08:00",
      end: "2024-05-07 20:00",
      priority: "中",
      owner: "试验-郭鸿",
      status: "pending",
      location: "B3 台架",
    },
    {
      id: "pt-3",
      name: "B 面焊点复验",
      start: "2024-05-04 10:00",
      end: "2024-05-04 22:00",
      priority: "高",
      risk: "资源紧张",
      owner: "质量-周倩",
      status: "completed",
      location: "焊装线2",
    },
  ]);
}

export async function getProductionSnapshot(): Promise<ProductionSnapshot[]> {
  return mockRequest([
    {
      line: "焊装一线",
      taktTime: "42s",
      yieldRate: "98.4%",
      wip: 14,
      status: "online",
      issues: ["节拍波动轻微"],
      parameters: [
        { name: "枪口温度", value: "72℃", trend: "稳定" },
        { name: "铆接力", value: "8.2kN", trend: "上升" },
      ],
    },
    {
      line: "涂装线",
      taktTime: "55s",
      yieldRate: "97.2%",
      wip: 11,
      status: "alert",
      issues: ["色差报警", "溶剂压力偏低"],
      parameters: [
        { name: "色差ΔE", value: "2.1", trend: "异常" },
        { name: "溶剂压力", value: "0.9MPa", trend: "下降" },
      ],
    },
    {
      line: "总装线",
      taktTime: "48s",
      yieldRate: "99.0%",
      wip: 9,
      status: "online",
      issues: [],
      parameters: [
        { name: "扭矩合格率", value: "99.2%", trend: "稳定" },
        { name: "AGV 等待", value: "14s", trend: "下降" },
      ],
    },
  ]);
}

export async function getModelCatalog(): Promise<ModelCard[]> {
  return mockRequest([
    {
      id: "m1",
      name: "Transformer 异常检测",
      type: "质量/监控",
      version: "v3.2",
      status: "online",
      metrics: [
        { label: "F1", value: "0.92" },
        { label: "延迟", value: "320ms" },
      ],
      scope: "焊装、总装异常预警",
      datasets: ["weld-2024Q1", "assy-2024Q1"],
      defaultVersion: true,
    },
    {
      id: "m2",
      name: "参数推荐",
      type: "工艺优化",
      version: "v2.1",
      status: "testing",
      metrics: [
        { label: "MAE", value: "0.14" },
        { label: "覆盖率", value: "87%" },
      ],
      scope: "SPR 工艺参数",
      datasets: ["spr-lab", "spr-prod"],
    },
    {
      id: "m3",
      name: "RL 排产优化",
      type: "排产/资源",
      version: "v1.4",
      status: "offline",
      metrics: [
        { label: "提升", value: "+6%" },
        { label: "稳定性", value: "B+" },
      ],
      scope: "总装 AGV 调度",
      datasets: ["agv-2024q2"],
    },
  ]);
}

export async function getCollaborationLanes(): Promise<CollaborationLane[]> {
  return mockRequest([
    {
      id: "lane-1",
      title: "工艺设计",
      owner: "工艺-马宁",
      status: "running",
      todos: ["审核门环方案", "输出仿真边界条件"],
      due: "2024-05-06",
      notes: ["与供应商确认材料牌号"],
    },
    {
      id: "lane-2",
      title: "仿真验证",
      owner: "仿真-李晨",
      status: "pending",
      todos: ["启动 CAE 计算", "准备材料曲线"],
      due: "2024-05-07",
      notes: ["等待新网格模型"],
    },
    {
      id: "lane-3",
      title: "试验执行",
      owner: "试验-赵璇",
      status: "delayed",
      todos: ["场地协调", "设备预热"],
      due: "2024-05-05",
      notes: ["机台维护预计1h"],
    },
    {
      id: "lane-4",
      title: "量产监控",
      owner: "质量-王磊",
      status: "completed",
      todos: ["异常复盘", "优化预警阈值"],
      due: "2024-05-04",
      notes: ["输出周报"],
    },
  ]);
}
