import { MetricCard } from "@/components/dashboard/MetricCard";
import { AnnouncementCard } from "@/components/dashboard/AnnouncementCard";
import { HistoryTable } from "@/components/dashboard/HistoryTable";
import { Activity, Database, Zap, TrendingUp } from "lucide-react";

// 模拟数据
const mockMetrics = [
  {
    title: "运行效率",
    value: "98.5%",
    change: "+2.1% 较昨日",
    changeType: "positive" as const,
    icon: TrendingUp,
    description: "系统整体运行效率",
  },
  {
    title: "处理任务",
    value: "1,247",
    change: "+156 今日新增",
    changeType: "positive" as const,
    icon: Activity,
    description: "累计处理工艺任务数",
  },
  {
    title: "数据量",
    value: "2.4TB",
    change: "+0.3TB 本周",
    changeType: "neutral" as const,
    icon: Database,
    description: "工艺数据存储总量",
  },
  {
    title: "响应时间",
    value: "1.2s",
    change: "-0.3s 优化后",
    changeType: "positive" as const,
    icon: Zap,
    description: "平均系统响应时间",
  },
];

const mockAnnouncements = [
  {
    id: "1",
    title: "系统维护通知",
    content:
      "系统将于本周五晚上22:00-24:00进行例行维护，期间可能会影响服务使用，请提前做好准备。",
    type: "warning" as const,
    timestamp: "2024-01-15 14:30",
    isNew: true,
  },
  {
    id: "2",
    title: "新功能上线",
    content:
      "SPR工艺自动优化算法v2.1已上线，提升了处理效率和准确性，欢迎体验。",
    type: "success" as const,
    timestamp: "2024-01-14 09:15",
    isNew: true,
  },
  {
    id: "3",
    title: "性能优化完成",
    content:
      "数据导入模块性能优化已完成，导入速度提升50%，大文件处理更加稳定。",
    type: "info" as const,
    timestamp: "2024-01-12 16:45",
  },
  {
    id: "4",
    title: "系统维护通知",
    content:
      "系统将于2025-08-25 18:00进行维护，请关注维护时间，避免影响业务使用。",
    type: "info" as const,
    timestamp: "2025-08-24 09:00",
  },
  {
    id: "5",
    title: "BUG修复",
    content:
      "修复数据导入时会出现数据丢失的BUG。",
    type: "info" as const,
    timestamp: "2024-01-12 16:45",
  },
  {
    id: "6",
    title: "功能优化",
    content:
      "优化连接质量预测模型，质量预测精确度进一步提升。",
    type: "info" as const,
    timestamp: "2024-01-12 16:45",
  },
];

const mockHistoryRecords = [
  {
    id: "1",
    taskName: "工艺参数优化分析",
    type: "参数优化",
    status: "completed" as const,
    progress: 100,
    startTime: "2024-01-15 10:30",
    endTime: "2024-01-15 12:45",
    duration: "2h 15m",
    operator: "张工程师",
  },
  {
    id: "2",
    taskName: "质量检测模型训练",
    type: "模型训练",
    status: "running" as const,
    progress: 67,
    startTime: "2024-01-15 14:20",
    operator: "李工程师",
  },
  {
    id: "3",
    taskName: "生产数据清洗",
    type: "数据处理",
    status: "completed" as const,
    progress: 100,
    startTime: "2024-01-15 08:15",
    endTime: "2024-01-15 09:30",
    duration: "1h 15m",
    operator: "王工程师",
  },
  {
    id: "4",
    taskName: "工艺流程仿真",
    type: "仿真分析",
    status: "pending" as const,
    progress: 0,
    startTime: "2024-01-15 16:00",
    operator: "陈工程师",
  },
  {
    id: "5",
    taskName: "异常检测算法",
    type: "异常检测",
    status: "failed" as const,
    progress: 45,
    startTime: "2024-01-14 15:30",
    endTime: "2024-01-14 16:15",
    duration: "45m",
    operator: "刘工程师",
  },
  {
    id: "6",
    taskName: "材料强度测试",
    type: "质量检测",
    status: "completed" as const,
    progress: 100,
    startTime: "2024-01-14 13:00",
    endTime: "2024-01-14 14:30",
    duration: "1h 30m",
    operator: "赵工程师",
  },
  {
    id: "7",
    taskName: "焊接工艺优化",
    type: "参数优化",
    status: "running" as const,
    progress: 45,
    startTime: "2024-01-15 15:00",
    operator: "孙工程师",
  },
  {
    id: "8",
    taskName: "自动化流程设计",
    type: "流程设计",
    status: "completed" as const,
    progress: 100,
    startTime: "2024-01-14 10:00",
    endTime: "2024-01-14 12:00",
    duration: "2h",
    operator: "周工程师",
  },
  {
    id: "9",
    taskName: "质量预测模型",
    type: "模型训练",
    status: "pending" as const,
    progress: 0,
    startTime: "2024-01-15 17:00",
    operator: "吴工程师",
  },
  {
    id: "10",
    taskName: "设备故障诊断",
    type: "异常检测",
    status: "completed" as const,
    progress: 100,
    startTime: "2024-01-14 09:00",
    endTime: "2024-01-14 10:45",
    duration: "1h 45m",
    operator: "郑工程师",
  },
  {
    id: "11",
    taskName: "生产效率分析",
    type: "数据分析",
    status: "completed" as const,
    progress: 100,
    startTime: "2024-01-13 14:00",
    endTime: "2024-01-13 16:30",
    duration: "2h 30m",
    operator: "王工程师",
  },
  {
    id: "12",
    taskName: "新工艺验证",
    type: "仿真分析",
    status: "running" as const,
    progress: 78,
    startTime: "2024-01-15 11:00",
    operator: "李工程师",
  },
  {
    id: "13",
    taskName: "成本优化方案",
    type: "参数优化",
    status: "completed" as const,
    progress: 100,
    startTime: "2024-01-13 10:00",
    endTime: "2024-01-13 13:00",
    duration: "3h",
    operator: "张工程师",
  },
  {
    id: "14",
    taskName: "质量控制模型",
    type: "模型训练",
    status: "failed" as const,
    progress: 32,
    startTime: "2024-01-14 16:00",
    endTime: "2024-01-14 17:00",
    duration: "1h",
    operator: "陈工程师",
  },
  {
    id: "15",
    taskName: "工艺稳定性分析",
    type: "数据分析",
    status: "completed" as const,
    progress: 100,
    startTime: "2024-01-13 09:00",
    endTime: "2024-01-13 11:15",
    duration: "2h 15m",
    operator: "刘工程师",
  },
  {
    id: "16",
    taskName: "设备性能评估",
    type: "性能测试",
    status: "pending" as const,
    progress: 0,
    startTime: "2024-01-15 18:00",
    operator: "赵工程师",
  },
  {
    id: "17",
    taskName: "工艺路线规划",
    type: "流程设计",
    status: "running" as const,
    progress: 55,
    startTime: "2024-01-15 13:00",
    operator: "孙工程师",
  },
  {
    id: "18",
    taskName: "材料性能测试",
    type: "质量检测",
    status: "completed" as const,
    progress: 100,
    startTime: "2024-01-13 15:00",
    endTime: "2024-01-13 16:30",
    duration: "1h 30m",
    operator: "周工程师",
  },
  {
    id: "19",
    taskName: "智能排产算法",
    type: "算法优化",
    status: "completed" as const,
    progress: 100,
    startTime: "2024-01-12 10:00",
    endTime: "2024-01-12 14:00",
    duration: "4h",
    operator: "吴工程师",
  },
  {
    id: "20",
    taskName: "能耗优化分析",
    type: "参数优化",
    status: "running" as const,
    progress: 62,
    startTime: "2024-01-15 12:00",
    operator: "郑工程师",
  },
];

export default function Dashboard() {
  return (
    <div className="h-full flex flex-col space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
          <Activity className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">系统概览</h1>
        </div>
      </div>

      {/* 主体内容区域 */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 flex-1 min-h-0">
        {/* 左侧：指标 + 历史记录 */}
        <div className="xl:col-span-3 flex flex-col gap-6 min-w-0 min-h-0">
          {/* 指标卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-shrink-0">
            {mockMetrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          {/* 历史记录表格（带滚动） */}
          <div className="flex-1 min-h-0">
            <HistoryTable records={mockHistoryRecords} />
          </div>
        </div>

        {/* 右侧：公告栏 */}
        <div className="xl:col-span-1 min-h-0">
          <AnnouncementCard announcements={mockAnnouncements} />
        </div>
      </div>
    </div>
  );
}
