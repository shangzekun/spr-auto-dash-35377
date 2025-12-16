import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertOctagon, Factory, Gauge, RadioTower, ThermometerSun } from "lucide-react";
import { getProductionSnapshot } from "@/lib/api/catalog";
import { queryKeys } from "@/lib/api/queryKeys";
import { ProductionSnapshot } from "@/lib/api/types";

const statusColor: Record<ProductionSnapshot["status"], string> = {
  online: "bg-success/10 text-success border-success/20",
  paused: "bg-muted/60 text-muted-foreground border-muted/80",
  alert: "bg-destructive/10 text-destructive border-destructive/30",
};

export default function ProductionMonitor() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.production.overview,
    queryFn: getProductionSnapshot,
  });
  const [lines, setLines] = useState<ProductionSnapshot[]>([]);
  const [statusFilter, setStatusFilter] = useState<ProductionSnapshot["status"] | "all">("all");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  useEffect(() => {
    if (data) setLines(data);
  }, [data]);

  const filtered = useMemo(() => {
    return (lines || []).filter((line) => (statusFilter === "all" ? true : line.status === statusFilter));
  }, [lines, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">首页</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>生产监控</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">量产监控</h1>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">实时趋势</Badge>
        </div>
        <p className="text-muted-foreground">查看产线节拍、良率、过程参数与当前报警，预留数据流趋势与规则命中。</p>
      </div>

      <div className="flex items-center gap-3">
        <Button size="sm" variant={viewMode === "card" ? "default" : "outline"} onClick={() => setViewMode("card")}>
          卡片
        </Button>
        <Button size="sm" variant={viewMode === "table" ? "default" : "outline"} onClick={() => setViewMode("table")}>
          表格
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setStatusFilter("all")}>全部</Button>
        <Button size="sm" variant="ghost" onClick={() => setStatusFilter("online")}>在线</Button>
        <Button size="sm" variant="ghost" onClick={() => setStatusFilter("alert")}>告警</Button>
      </div>

      {viewMode === "card" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)
            : filtered.map((line) => (
                <Card key={line.line} className="border-border/50 shadow-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Factory className="h-5 w-5 text-primary" /> {line.line}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Gauge className="h-4 w-4" /> 节拍：<span className="text-foreground font-semibold">{line.taktTime}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <ThermometerSun className="h-4 w-4" /> 良率：<span className="text-foreground font-semibold">{line.yieldRate}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <RadioTower className="h-4 w-4" /> WIP：<span className="text-foreground font-semibold">{line.wip}</span>
                    </div>
                    <Badge variant="outline" className={statusColor[line.status]}>
                      {line.status === "online" ? "运行中" : line.status === "alert" ? "告警" : "暂停"}
                    </Badge>
                    {line.issues && line.issues.length > 0 && (
                      <div className="text-xs text-destructive">问题：{line.issues.join("；")}</div>
                    )}
                  </CardContent>
                </Card>
              ))}
        </div>
      ) : (
        <div className="rounded-md border border-border/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-3 py-2 text-left">产线</th>
                <th className="px-3 py-2 text-left">节拍</th>
                <th className="px-3 py-2 text-left">良率</th>
                <th className="px-3 py-2 text-left">参数</th>
                <th className="px-3 py-2 text-left">告警/问题</th>
                <th className="px-3 py-2 text-left">状态</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-4">
                    <Skeleton className="h-10 w-full" />
                  </td>
                </tr>
              ) : (
                filtered.map((line) => (
                  <tr key={line.line} className="border-b border-border/50">
                    <td className="px-3 py-2 font-medium">{line.line}</td>
                    <td className="px-3 py-2">{line.taktTime}</td>
                    <td className="px-3 py-2">{line.yieldRate}</td>
                    <td className="px-3 py-2">
                      <div className="space-y-1">
                        {line.parameters?.map((p) => (
                          <div key={p.name} className="flex justify-between">
                            <span>{p.name}</span>
                            <span className="text-muted-foreground">{p.value}（{p.trend}）</span>
                          </div>
                        )) || "-"}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {line.issues?.length ? line.issues.join("；") : "—"}
                    </td>
                    <td className="px-3 py-2">
                      <Badge variant="outline" className={statusColor[line.status]}>
                        {line.status === "online" ? "运行中" : line.status === "alert" ? "告警" : "暂停"}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="h-64 border-border/50 bg-card/60">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertOctagon className="h-5 w-5 text-primary" /> 当前报警趋势（占位）
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-full text-muted-foreground">
            图表占位：接入过程参数/报警趋势
          </CardContent>
        </Card>
        <Card className="h-64 border-border/50 bg-card/60">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertOctagon className="h-5 w-5 text-primary" /> 预警规则命中（占位）
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-full text-muted-foreground">
            预警列表占位，后续可对接后端规则命中与工单
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
