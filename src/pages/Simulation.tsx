import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCcw, Repeat2, Rocket, UploadCloud } from "lucide-react";
import { getSimulationTasks } from "@/lib/api/catalog";
import { queryKeys } from "@/lib/api/queryKeys";
import { SimulationTask } from "@/lib/api/types";
import { TaskStatusBadge } from "@/components/common/TaskStatusBadge";

const statusOptions: Array<SimulationTask["status"] | "all"> = [
  "all",
  "running",
  "completed",
  "failed",
  "pending",
  "delayed",
];

export default function Simulation() {
  const [statusFilter, setStatusFilter] = useState<SimulationTask["status"] | "all">("all");
  const [keyword, setKeyword] = useState("");
  const { data, isLoading, refetch } = useQuery({
    queryKey: queryKeys.simulations,
    queryFn: getSimulationTasks,
  });
  const [tasks, setTasks] = useState<SimulationTask[]>([]);

  useEffect(() => {
    if (data) setTasks(data);
  }, [data]);

  const filtered = useMemo(() => {
    return (tasks || []).filter((task) => {
      if (statusFilter !== "all" && task.status !== statusFilter) return false;
      if (keyword && !task.model.toLowerCase().includes(keyword.toLowerCase())) return false;
      return true;
    });
  }, [tasks, statusFilter, keyword]);

  const retryTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, status: "running", progress: 5, updatedAt: new Date().toISOString().slice(0, 16).replace("T", " ") }
          : task
      )
    );
  };

  const markCompleted = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: "completed", progress: 100, updatedAt: new Date().toISOString() } : task
      )
    );
  };

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
              <BreadcrumbPage>仿真验证</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">仿真任务队列</h1>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">状态跟踪</Badge>
        </div>
        <p className="text-muted-foreground">展示模型、参数集、状态与产出，支持过滤/重试/下载。</p>
      </div>

      <Card className="bg-card border-border/50 shadow-card">
        <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Rocket className="h-5 w-5 text-primary" /> 仿真队列
          </CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === "all" ? "全部" : s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="按模型/参数集搜索"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="h-9"
            />
            <Button variant="outline" className="h-9" onClick={() => refetch()}>
              <RefreshCcw className="h-4 w-4 mr-1" /> 刷新
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="text-center">模型</TableHead>
                  <TableHead className="text-center">参数集</TableHead>
                  <TableHead className="text-center">状态/进度</TableHead>
                  <TableHead className="text-center">创建时间</TableHead>
                  <TableHead className="text-center">更新时间</TableHead>
                  <TableHead className="text-center">产出</TableHead>
                  <TableHead className="text-center">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={7} className="py-4">
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      暂无任务，调整过滤或触发新仿真
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((task) => (
                  <TableRow key={task.id} className="hover:bg-muted/30">
                    <TableCell className="text-center font-medium">{task.model}</TableCell>
                    <TableCell className="text-center text-muted-foreground">{task.parameterSet}</TableCell>
                    <TableCell className="text-center">
                      <TaskStatusBadge status={task.status} progress={task.progress} showProgress />
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">{task.createdAt}</TableCell>
                    <TableCell className="text-center text-muted-foreground">{task.updatedAt || "-"}</TableCell>
                    <TableCell className="text-center">
                      {task.outputs?.length ? (
                        <div className="flex flex-wrap gap-2 justify-center">
                          {task.outputs.map((file) => (
                            <Badge key={file} variant="secondary" className="bg-muted/60 text-foreground/80">
                              {file}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                      {task.inputFiles?.length ? (
                        <div className="flex flex-wrap gap-2 justify-center mt-1 text-xs text-muted-foreground">
                          输入: {task.inputFiles.join(", ")}
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="sm" className="h-8" aria-label="重试" onClick={() => retryTask(task.id)}>
                          <Repeat2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8" aria-label="完成" onClick={() => markCompleted(task.id)}>
                          <Rocket className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8" aria-label="下载">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8" aria-label="上传输入">
                          <UploadCloud className="h-4 w-4" />
                        </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
