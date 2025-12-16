import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Activity, BellRing } from "lucide-react";

import { MetricCard } from "@/components/dashboard/MetricCard";
import { AnnouncementCard } from "@/components/dashboard/AnnouncementCard";
import { HistoryTable } from "@/components/dashboard/HistoryTable";
import { AlertsCard } from "@/components/dashboard/AlertsCard";
import { HealthScoreCard } from "@/components/dashboard/HealthScoreCard";
import { AlertTrendCard } from "@/components/dashboard/AlertTrendCard";
import {
  getAlertTrends,
  getDashboardAlerts,
  getDashboardKpis,
  getHealthScore,
  getRunHistory,
} from "@/lib/api/dashboard";
import { queryKeys } from "@/lib/api/queryKeys";

export default function Dashboard() {
  const kpiQuery = useQuery({
    queryKey: queryKeys.dashboard.kpis,
    queryFn: getDashboardKpis,
  });

  const alertQuery = useQuery({
    queryKey: queryKeys.dashboard.alerts,
    queryFn: getDashboardAlerts,
  });

  const healthQuery = useQuery({
    queryKey: queryKeys.dashboard.health,
    queryFn: getHealthScore,
  });

  const trendQuery = useQuery({
    queryKey: queryKeys.dashboard.trends,
    queryFn: getAlertTrends,
  });

  const historyQuery = useQuery({
    queryKey: queryKeys.dashboard.history,
    queryFn: getRunHistory,
  });

  const announcements = useMemo(
    () => [
      {
        id: "1",
        title: "监控升级",
        content: "实时监控 + 预警已接入工艺健康度评分与告警趋势。",
        type: "success" as const,
        timestamp: "2024-05-05 10:00",
        isNew: true,
      },
      {
        id: "2",
        title: "后端联调提示",
        content: "当前为模拟数据接口，可在 api 层切换为真实后端。",
        type: "info" as const,
        timestamp: "2024-05-04 18:10",
      },
    ],
    []
  );

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
          <Activity className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">实时监控 + 预警</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <BellRing className="h-4 w-4" />
            关键 KPI、告警趋势与运行记录，已接入模拟 API
          </p>
        </div>
      </div>

      {/* 主体内容区域 */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 flex-1 min-h-0">
        {/* 左侧：指标 + 历史记录 */}
        <div className="xl:col-span-3 flex flex-col gap-6 min-w-0 min-h-0">
          {/* 指标卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-shrink-0">
            {kpiQuery.isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-[140px] rounded-xl bg-muted/40 animate-pulse border border-border/50"
                  />
                ))
              : kpiQuery.data?.map((metric) => <MetricCard key={metric.id} {...metric} />)}
          </div>

          {/* 历史记录表格（带滚动） */}
          <div className="flex-1 min-h-0">
            <HistoryTable records={historyQuery.data || []} isLoading={historyQuery.isLoading} />
          </div>
        </div>

        {/* 右侧：告警/健康/趋势/公告 */}
        <div className="xl:col-span-1 min-h-0 space-y-4">
          <AlertsCard alerts={alertQuery.data} isLoading={alertQuery.isLoading} />
          <HealthScoreCard
            {...(healthQuery.data || { score: 0, comment: "--", risks: [], tags: [] })}
          />
          <AlertTrendCard data={trendQuery.data} isLoading={trendQuery.isLoading} />
          <AnnouncementCard announcements={announcements} />
        </div>
      </div>

      {/* 底部提示 */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 border border-border/50 rounded-lg px-3 py-2">
        <AlertCircle className="h-3.5 w-3.5" />
        如需接入真实后端，可在 <code className="px-1 py-0.5 rounded bg-card border border-border/50">src/lib/api</code> 中替换 mock 服务。
      </div>
    </div>
  );
}
