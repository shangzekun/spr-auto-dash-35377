import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)
          : data?.map((line) => (
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
                </CardContent>
              </Card>
            ))}
      </div>

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
