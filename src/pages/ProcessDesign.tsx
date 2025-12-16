import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, Filter, PlusCircle, RefreshCw } from "lucide-react";
import { getProcessSchemes } from "@/lib/api/catalog";
import { queryKeys } from "@/lib/api/queryKeys";
import { ProcessScheme } from "@/lib/api/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const statusOptions: ProcessScheme["status"][] = ["设计", "仿真", "试验", "量产"];

export default function ProcessDesign() {
  const [statusFilter, setStatusFilter] = useState<ProcessScheme["status"] | "all">("all");
  const [projectFilter, setProjectFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [cloneTarget, setCloneTarget] = useState<ProcessScheme | null>(null);

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: queryKeys.process.schemes,
    queryFn: getProcessSchemes,
  });

  const filtered = useMemo(() => {
    return (data || []).filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (projectFilter && !item.project.toLowerCase().includes(projectFilter.toLowerCase())) return false;
      if (tagFilter && !item.tags.some((tag) => tag.includes(tagFilter))) return false;
      return true;
    });
  }, [data, statusFilter, projectFilter, tagFilter]);

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
              <BreadcrumbPage>工艺方案设计</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">工艺方案列表</h1>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">版本对比/复用</Badge>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isRefetching}>
            <RefreshCw className="h-4 w-4 mr-1" /> 刷新
          </Button>
        </div>
        <p className="text-muted-foreground">按车型/项目筛选，查看版本标签、状态流转，支持方案复用与复制。</p>
      </div>

      <Card className="bg-card border-border/50 shadow-card">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-4 w-4 text-primary" /> 筛选
          </CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full">
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="按项目/车型过滤"
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="h-9"
            />
            <Input
              placeholder="标签过滤（轻量化/电池包等）"
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="h-9"
            />
            <Button className="h-9" variant="secondary">
              <PlusCircle className="h-4 w-4 mr-1" /> 新建方案
            </Button>
          </div>
        </CardHeader>
        <Separator />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-40 rounded-xl" />
                ))
              : filtered.map((scheme) => (
                  <Card key={scheme.id} className="border-border/50 shadow-sm hover:shadow-elegant transition-smooth">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-base font-semibold">{scheme.name}</CardTitle>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {scheme.version}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">车型/项目：{scheme.project}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {scheme.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="bg-muted/60 text-foreground/80">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>模型/工艺：{scheme.model}</span>
                        <Separator orientation="vertical" className="h-4" />
                        <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                          {scheme.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>更新：{scheme.updatedAt}</span>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="h-8" onClick={() => setCloneTarget(scheme)}>
                            <Copy className="h-4 w-4 mr-1" /> 复用
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8">
                            版本对比
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
          {!isLoading && filtered.length === 0 && (
            <div className="text-center text-muted-foreground py-8">暂无方案，调整筛选或新建方案</div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!cloneTarget} onOpenChange={() => setCloneTarget(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>复用方案</DialogTitle>
            <DialogDescription>
              选择目标项目与标签，快速复制方案配置与参数包。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="目标项目/车型" className="h-10" />
            <Input placeholder="复用标签（可选）" className="h-10" />
            <p className="text-sm text-muted-foreground">
              正在复用：{cloneTarget?.name}（{cloneTarget?.version}）
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCloneTarget(null)}>取消</Button>
            <Button>确认复用</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
