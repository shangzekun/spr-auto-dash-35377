import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AlarmClock, CalendarClock, MapPinned, PlayCircle } from "lucide-react";
import { getPilotSchedule } from "@/lib/api/catalog";
import { queryKeys } from "@/lib/api/queryKeys";
import { PilotTask } from "@/lib/api/types";
import { TaskStatusBadge } from "@/components/common/TaskStatusBadge";

const priorityColor: Record<PilotTask["priority"], string> = {
  高: "bg-destructive/10 text-destructive border-destructive/30",
  中: "bg-warning/10 text-warning border-warning/30",
  低: "bg-muted/60 text-muted-foreground border-muted/80",
};

export default function PilotTest() {
  const [keyword, setKeyword] = useState("");
  const [priority, setPriority] = useState<PilotTask["priority"] | "all">("all");
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.tests,
    queryFn: getPilotSchedule,
  });

  const filtered = useMemo(() => {
    return (data || []).filter((task) => {
      if (priority !== "all" && task.priority !== priority) return false;
      if (keyword && !task.name.toLowerCase().includes(keyword.toLowerCase())) return false;
      return true;
    });
  }, [data, priority, keyword]);

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
              <BreadcrumbPage>试验排程</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">试验执行排程</h1>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">甘特/矩阵视图</Badge>
        </div>
        <p className="text-muted-foreground">展示试验计划、优先级与延迟风险，可替换为甘特或矩阵视图。</p>
      </div>

      <Card className="bg-card border-border/50 shadow-card">
        <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarClock className="h-5 w-5 text-primary" /> 试验排程
          </CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
            <Input
              placeholder="按任务搜索"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="h-9"
            />
            <Select value={priority} onValueChange={(v) => setPriority(v as typeof priority)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="优先级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部优先级</SelectItem>
                <SelectItem value="高">高</SelectItem>
                <SelectItem value="中">中</SelectItem>
                <SelectItem value="低">低</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="secondary" className="h-9">
              <PlayCircle className="h-4 w-4 mr-1" /> 新建试验
            </Button>
          </div>
        </CardHeader>
        <Separator />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)
              : filtered.map((task) => (
                  <Card key={task.id} className="border-border/50 hover:shadow-elegant transition-smooth">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-base font-semibold">{task.name}</CardTitle>
                        <Badge variant="outline" className={priorityColor[task.priority]}>
                          {task.priority}优先
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">责任人：{task.owner}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPinned className="h-4 w-4" /> 进度/状态：<TaskStatusBadge status={task.status} showProgress />
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <AlarmClock className="h-4 w-4" /> {task.start} → {task.end}
                      </div>
                      {task.risk && (
                        <Badge variant="outline" className="bg-amber-100 text-amber-900 border-amber-200">
                          风险：{task.risk}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
          </div>
          {!isLoading && filtered.length === 0 && (
            <div className="text-center text-muted-foreground py-8">暂无排程，创建新试验或调整过滤</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
