import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { BellRing, CheckCircle2, Filter, ShieldCheck, Trash2 } from "lucide-react";
import { getDashboardAlerts } from "@/lib/api/dashboard";
import { queryKeys } from "@/lib/api/queryKeys";
import { AlertItem } from "@/lib/api/types";

const levelLabel: Record<AlertItem["level"], string> = {
  critical: "紧急",
  warning: "预警",
  info: "提示",
};

const statusLabel: Record<AlertItem["status"], string> = {
  open: "待处理",
  acknowledged: "已关注",
  resolved: "已关闭",
};

export default function Alerts() {
  const [levelFilter, setLevelFilter] = useState<AlertItem["level"] | "all">("all");
  const [statusFilter, setStatusFilter] = useState<AlertItem["status"] | "all">("all");
  const [keyword, setKeyword] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.dashboard.alerts,
    queryFn: getDashboardAlerts,
  });
  const [selected, setSelected] = useState<string[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  useEffect(() => {
    if (data) {
      setAlerts(data);
      setSelected([]);
    }
  }, [data]);

  const filtered = useMemo(() => {
    return (alerts || []).filter((alert) => {
      if (levelFilter !== "all" && alert.level !== levelFilter) return false;
      if (statusFilter !== "all" && alert.status !== statusFilter) return false;
      if (keyword && !alert.title.toLowerCase().includes(keyword.toLowerCase())) return false;
      return true;
    });
  }, [alerts, levelFilter, statusFilter, keyword]);

  const toggleSelect = (id: string, checked: boolean) => {
    setSelected((prev) => (checked ? [...prev, id] : prev.filter((item) => item !== id)));
  };

  const selectAllFiltered = (checked: boolean) => {
    setSelected(checked ? filtered.map((item) => item.id) : []);
  };

  const bulkUpdateStatus = (status: AlertItem["status"]) => {
    setAlerts((prev) =>
      prev.map((alert) => (selected.includes(alert.id) ? { ...alert, status } : alert))
    );
    setSelected([]);
  };

  const singleUpdate = (id: string, status: AlertItem["status"]) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, status } : alert)));
    setSelected((prev) => prev.filter((item) => item !== id));
  };

  const selectedAllOnPage =
    filtered.length > 0 && filtered.every((item) => selected.includes(item.id));
  const partiallySelected = selected.length > 0 && !selectedAllOnPage;

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
              <BreadcrumbPage>异常预警</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">异常告警中心</h1>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">批量处置</Badge>
        </div>
        <p className="text-muted-foreground">查看告警列表、筛选级别/状态，支持批量操作与处置。</p>
      </div>

      <Card className="bg-card border-border/50 shadow-card">
        <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5 text-primary" /> 告警筛选
          </CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full">
            <Input
              placeholder="搜索告警标题/规则"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="h-9"
            />
            <Select value={levelFilter} onValueChange={(v) => setLevelFilter(v as typeof levelFilter)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="级别" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部级别</SelectItem>
                <SelectItem value="critical">紧急</SelectItem>
                <SelectItem value="warning">预警</SelectItem>
                <SelectItem value="info">提示</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="open">待处理</SelectItem>
                <SelectItem value="acknowledged">已关注</SelectItem>
                <SelectItem value="resolved">已关闭</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="secondary"
              className="h-9"
              onClick={() => bulkUpdateStatus("acknowledged")}
              disabled={selected.length === 0}
            >
              <ShieldCheck className="h-4 w-4 mr-1" /> 批量处置
            </Button>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedAllOnPage}
                onCheckedChange={(v) => selectAllFiltered(Boolean(v))}
                aria-label="全选当前列表"
                className={partiallySelected ? "data-[state=indeterminate]:bg-primary/50" : ""}
              />
              <span>
                已选 {selected.length} / {alerts.length} 条
              </span>
            </div>
            <Badge variant="outline" className="bg-muted/60 border-muted/50">
              仅当前筛选范围
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)
              : filtered.map((alert) => (
                  <Card key={alert.id} className="border-border/50 hover:shadow-elegant transition-smooth">
                    <CardContent className="py-4 flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            aria-label="选择"
                            checked={selected.includes(alert.id)}
                            onCheckedChange={(v) => toggleSelect(alert.id, Boolean(v))}
                          />
                          <Badge
                            variant="outline"
                            className={
                              alert.level === "critical"
                                ? "bg-destructive/10 text-destructive border-destructive/30"
                                : alert.level === "warning"
                                ? "bg-warning/10 text-warning border-warning/30"
                                : "bg-primary/10 text-primary border-primary/30"
                            }
                          >
                            {levelLabel[alert.level]}
                          </Badge>
                          <p className="font-semibold text-foreground">{alert.title}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{alert.time}</span>
                          <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-muted/40">
                            {statusLabel[alert.status]}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span>规则：{alert.rule}</span>
                        <span>来源：{alert.source}</span>
                        {alert.owner && <span>责任人：{alert.owner}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8"
                          onClick={() => singleUpdate(alert.id, "acknowledged")}
                          disabled={alert.status === "acknowledged"}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" /> 确认
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8"
                          onClick={() => singleUpdate(alert.id, "resolved")}
                          disabled={alert.status === "resolved"}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> 关闭
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8">
                          <BellRing className="h-4 w-4 mr-1" /> 工单/处置
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
          {!isLoading && filtered.length === 0 && (
            <div className="text-center text-muted-foreground py-8">暂无告警，调整筛选或等待新告警</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
