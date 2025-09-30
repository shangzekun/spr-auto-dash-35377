import { MetricCard } from "@/components/dashboard/MetricCard";
import { AnnouncementCard } from "@/components/dashboard/AnnouncementCard";
import { HistoryTable } from "@/components/dashboard/HistoryTable";
import { Activity, Database, Zap, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

// 模拟数据
const mockMetrics = [{
  title: "运行效率",
  value: "98.5%",
  change: "+2.1% 较昨日",
  changeType: "positive" as const,
  icon: TrendingUp,
  description: "系统整体运行效率"
}, {
  title: "处理任务",
  value: "1,247",
  change: "+156 今日新增",
  changeType: "positive" as const,
  icon: Activity,
  description: "累计处理工艺任务数"
}, {
  title: "数据量",
  value: "2.4TB",
  change: "+0.3TB 本周",
  changeType: "neutral" as const,
  icon: Database,
  description: "工艺数据存储总量"
}, {
  title: "响应时间",
  value: "1.2s",
  change: "-0.3s 优化后",
  changeType: "positive" as const,
  icon: Zap,
  description: "平均系统响应时间"
}];
const mockAnnouncements = [{
  id: "1",
  title: "系统维护通知",
  content: "系统将于本周五晚上22:00-24:00进行例行维护，期间可能会影响服务使用，请提前做好准备。",
  type: "warning" as const,
  timestamp: "2024-01-15 14:30",
  isNew: true
}, {
  id: "2",
  title: "新功能上线",
  content: "SPR工艺自动优化算法v2.1已上线，提升了处理效率和准确性，欢迎体验。",
  type: "success" as const,
  timestamp: "2024-01-14 09:15",
  isNew: true
}, {
  id: "3",
  title: "性能优化完成",
  content: "数据导入模块性能优化已完成，导入速度提升50%，大文件处理更加稳定。",
  type: "info" as const,
  timestamp: "2024-01-12 16:45"
}];
const mockHistoryRecords = [{
  id: "1",
  taskName: "工艺参数优化分析",
  type: "参数优化",
  status: "completed" as const,
  progress: 100,
  startTime: "2024-01-15 10:30",
  endTime: "2024-01-15 12:45",
  duration: "2h 15m",
  operator: "张工程师"
}, {
  id: "2",
  taskName: "质量检测模型训练",
  type: "模型训练",
  status: "running" as const,
  progress: 67,
  startTime: "2024-01-15 14:20",
  operator: "李工程师"
}, {
  id: "3",
  taskName: "生产数据清洗",
  type: "数据处理",
  status: "completed" as const,
  progress: 100,
  startTime: "2024-01-15 08:15",
  endTime: "2024-01-15 09:30",
  duration: "1h 15m",
  operator: "王工程师"
}, {
  id: "4",
  taskName: "工艺流程仿真",
  type: "仿真分析",
  status: "pending" as const,
  progress: 0,
  startTime: "2024-01-15 16:00",
  operator: "陈工程师"
}, {
  id: "5",
  taskName: "异常检测算法",
  type: "异常检测",
  status: "failed" as const,
  progress: 45,
  startTime: "2024-01-14 15:30",
  endTime: "2024-01-14 16:15",
  duration: "45m",
  operator: "刘工程师"
}];
export default function Dashboard() {
  return <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
          <Activity className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">系统概览</h1>
          
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* 左侧：指标卡片和历史记录 */}
        <div className="xl:col-span-3 space-y-6">
          {/* 指标卡片区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockMetrics.map((metric, index) => <MetricCard key={index} {...metric} />)}
          </div>

          {/* 历史分析记录 */}
          <HistoryTable records={mockHistoryRecords} />
        </div>

        {/* 右侧：更新公告 */}
        <div className="xl:col-span-1">
          <AnnouncementCard announcements={mockAnnouncements} />
        </div>
      </div>

      {/* 状态指示器 */}
      
    </div>;
}