import { Activity, BarChart3, GaugeCircle, ShieldAlert } from "lucide-react";
import { mockRequest } from "./client";
import { AlertItem, AlertTrendPoint, DashboardKpi, HealthScore, RunHistoryRecord } from "./types";

export async function getDashboardKpis(): Promise<DashboardKpi[]> {
  return mockRequest([
    {
      id: "yield",
      title: "良率",
      value: "98.4%",
      change: "+0.6% 环比",
      changeType: "positive",
      icon: BarChart3,
      description: "关键工序累计良率",
    },
    {
      id: "takt",
      title: "节拍",
      value: "42s",
      change: "-1.3s 改善",
      changeType: "positive",
      icon: Activity,
      description: "产线平均节拍",
    },
    {
      id: "alerts",
      title: "告警趋势",
      value: "12 次/天",
      change: "-18%",
      changeType: "positive",
      icon: ShieldAlert,
      description: "近7日异常命中率",
    },
    {
      id: "health",
      title: "工艺健康度",
      value: "87",
      change: "-2 需要关注",
      changeType: "negative",
      icon: GaugeCircle,
      description: "综合稳定性评分",
    },
  ]);
}

export async function getDashboardAlerts(): Promise<AlertItem[]> {
  return mockRequest([
    {
      id: "a1",
      title: "点焊枪温度偏高",
      level: "critical",
      source: "焊装二线",
      rule: "温度上浮3σ",
      time: "2024-05-05 10:20",
      status: "open",
      owner: "质量-赵凯",
    },
    {
      id: "a2",
      title: "节拍波动",
      level: "warning",
      source: "总装AGV",
      rule: "节拍异常趋势",
      time: "2024-05-05 10:05",
      status: "acknowledged",
      owner: "IE-刘颖",
    },
    {
      id: "a3",
      title: "能耗异常",
      level: "info",
      source: "涂装供能",
      rule: "耗能偏离5%",
      time: "2024-05-05 09:50",
      status: "resolved",
      owner: "设备-王磊",
    },
  ]);
}

export async function getAlertTrends(): Promise<AlertTrendPoint[]> {
  return mockRequest([
    { date: "周一", critical: 6, warning: 10, info: 4 },
    { date: "周二", critical: 4, warning: 9, info: 6 },
    { date: "周三", critical: 3, warning: 7, info: 5 },
    { date: "周四", critical: 5, warning: 6, info: 4 },
    { date: "周五", critical: 4, warning: 8, info: 7 },
  ]);
}

export async function getHealthScore(): Promise<HealthScore> {
  return mockRequest({
    score: 87,
    comment: "关键工序稳定，但需关注节拍波动与告警关闭效率。",
    risks: ["压机温度波动", "节拍抖动", "AGV 等待时间"],
    tags: ["SPC", "Poka-Yoke", "自动巡检"],
  });
}

export async function getRunHistory(): Promise<RunHistoryRecord[]> {
  return mockRequest([
    {
      id: "1",
      taskName: "工艺参数优化分析",
      processType: "参数优化",
      status: "completed",
      progress: 100,
      startTime: "2024-05-05 08:30",
      endTime: "2024-05-05 09:45",
      duration: "1h 15m",
      operator: "张工程师",
    },
    {
      id: "2",
      taskName: "质量检测模型训练",
      processType: "模型训练",
      status: "running",
      progress: 68,
      startTime: "2024-05-05 09:20",
      operator: "李工程师",
    },
    {
      id: "3",
      taskName: "生产数据清洗",
      processType: "数据处理",
      status: "completed",
      progress: 100,
      startTime: "2024-05-04 20:15",
      endTime: "2024-05-04 21:00",
      duration: "45m",
      operator: "王工程师",
    },
    {
      id: "4",
      taskName: "工艺流程仿真",
      processType: "仿真分析",
      status: "pending",
      progress: 0,
      startTime: "2024-05-05 10:30",
      operator: "陈工程师",
    },
    {
      id: "5",
      taskName: "异常检测算法",
      processType: "异常检测",
      status: "failed",
      progress: 42,
      startTime: "2024-05-04 15:30",
      endTime: "2024-05-04 16:00",
      duration: "30m",
      operator: "刘工程师",
    },
    {
      id: "6",
      taskName: "材料强度测试",
      processType: "质量检测",
      status: "completed",
      progress: 100,
      startTime: "2024-05-04 13:00",
      endTime: "2024-05-04 14:20",
      duration: "1h 20m",
      operator: "赵工程师",
    },
    {
      id: "7",
      taskName: "焊接工艺优化",
      processType: "参数优化",
      status: "running",
      progress: 52,
      startTime: "2024-05-05 07:50",
      operator: "孙工程师",
    },
    {
      id: "8",
      taskName: "自动化流程设计",
      processType: "流程设计",
      status: "completed",
      progress: 100,
      startTime: "2024-05-04 10:00",
      endTime: "2024-05-04 12:00",
      duration: "2h",
      operator: "周工程师",
    },
    {
      id: "9",
      taskName: "质量预测模型",
      processType: "模型训练",
      status: "pending",
      progress: 0,
      startTime: "2024-05-05 11:00",
      operator: "吴工程师",
    },
    {
      id: "10",
      taskName: "设备故障诊断",
      processType: "异常检测",
      status: "completed",
      progress: 100,
      startTime: "2024-05-04 09:00",
      endTime: "2024-05-04 10:10",
      duration: "1h 10m",
      operator: "郑工程师",
    },
  ]);
}
