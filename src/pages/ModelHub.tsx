import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, BrainCircuit, Play, Power, RefreshCw } from "lucide-react";
import { getModelCatalog } from "@/lib/api/catalog";
import { queryKeys } from "@/lib/api/queryKeys";
import { ModelCard } from "@/lib/api/types";

const statusLabel: Record<ModelCard["status"], string> = {
  online: "在线",
  offline: "下线",
  testing: "测试中",
};

export default function ModelHub() {
  const [statusFilter, setStatusFilter] = useState<ModelCard["status"] | "all">("all");
  const [keyword, setKeyword] = useState("");
  const [selectedModel, setSelectedModel] = useState<ModelCard | null>(null);
  const { data, isLoading, refetch } = useQuery({
    queryKey: queryKeys.models,
    queryFn: getModelCatalog,
  });

  const filtered = useMemo(() => {
    return (data || []).filter((model) => {
      if (statusFilter !== "all" && model.status !== statusFilter) return false;
      if (keyword && !model.name.toLowerCase().includes(keyword.toLowerCase())) return false;
      return true;
    });
  }, [data, statusFilter, keyword]);

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
              <BreadcrumbPage>模型与 AI 工作流</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">模型仓库</h1>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">推理/批量评分</Badge>
        </div>
        <p className="text-muted-foreground">管理 Transformer 异常检测、参数推荐、RL 优化等模型，支持启停、版本切换与推理。</p>
      </div>

      <Card className="bg-card border-border/50 shadow-card">
        <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BrainCircuit className="h-5 w-5 text-primary" /> 模型列表
          </CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
            <Input
              placeholder="按名称搜索"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="h-9"
            />
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="online">在线</SelectItem>
                <SelectItem value="testing">测试中</SelectItem>
                <SelectItem value="offline">下线</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="h-9" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-1" /> 刷新
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)
              : filtered.map((model) => (
                  <Card key={model.id} className="border-border/50 hover:shadow-elegant transition-smooth">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-base font-semibold">{model.name}</CardTitle>
                        <Badge variant="outline" className="bg-muted/60 text-foreground/80">
                          {model.version}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">类型：{model.type}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {model.metrics.map((metric) => (
                          <Badge key={metric.label} variant="secondary" className="bg-primary/10 text-primary">
                            {metric.label}: {metric.value}
                          </Badge>
                        ))}
                      </div>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200">
                        {statusLabel[model.status]}
                      </Badge>
                      <p className="text-sm text-muted-foreground">使用范围：{model.scope}</p>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between gap-2">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-8">
                          <Power className="h-4 w-4 mr-1" /> {model.status === "online" ? "下线" : "上线"}
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8">
                          <Activity className="h-4 w-4 mr-1" /> 切换版本
                        </Button>
                      </div>
                      <Dialog open={selectedModel?.id === model.id} onOpenChange={(open) => setSelectedModel(open ? model : null)}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="h-8">
                            <Play className="h-4 w-4 mr-1" /> 运行推理
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>运行推理</DialogTitle>
                            <DialogDescription>选择数据源/工艺方案并触发批量评分。</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-3">
                            <Input placeholder="数据源/方案" className="h-10" />
                            <Input placeholder="备注（可选）" className="h-10" />
                            <p className="text-sm text-muted-foreground">模型：{model.name}</p>
                          </div>
                          <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setSelectedModel(null)}>取消</Button>
                            <Button>触发推理</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardFooter>
                  </Card>
                ))}
          </div>
          {!isLoading && filtered.length === 0 && (
            <div className="text-center text-muted-foreground py-8">暂无模型，调整筛选或同步后端</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
