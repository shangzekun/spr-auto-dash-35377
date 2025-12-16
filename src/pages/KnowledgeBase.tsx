import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/multi-select";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, LibraryBig, Search, Tag, PlusCircle, Pin } from "lucide-react";
import { getKnowledgeAssets } from "@/lib/api/catalog";
import { queryKeys } from "@/lib/api/queryKeys";
import { KnowledgeAsset } from "@/lib/api/types";

const typeOptions: KnowledgeAsset["type"][] = [
  "工艺模板",
  "参数包",
  "仿真报告",
  "试验数据",
  "量产数据",
];

export default function KnowledgeBase() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<KnowledgeAsset["type"] | "all">("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [reuseTarget, setReuseTarget] = useState<KnowledgeAsset | null>(null);
  const [assets, setAssets] = useState<KnowledgeAsset[]>([]);
  const [sortBy, setSortBy] = useState<"updated" | "usage">("updated");
  const [pinned, setPinned] = useState<string[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.process.knowledge,
    queryFn: getKnowledgeAssets,
  });

  useEffect(() => {
    if (data) {
      setAssets(data);
    }
  }, [data]);

  const tagOptions = useMemo(() => {
    const set = new Set<string>();
    (assets || []).forEach((item) => item.tags.forEach((tag) => set.add(tag)));
    return Array.from(set).map((v) => ({ label: v, value: v }));
  }, [assets]);

  const filtered = useMemo(() => {
    const rows = (assets || []).filter((item) => {
      if (typeFilter !== "all" && item.type !== typeFilter) return false;
      if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedTags.length && !selectedTags.every((t) => item.tags.includes(t))) return false;
      return true;
    });

    const sorted = [...rows].sort((a, b) => {
      if (sortBy === "usage") {
        return (b.usage || 0) - (a.usage || 0);
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    const pinWeight = (id: string) => (pinned.includes(id) ? 1 : 0);
    return sorted.sort((a, b) => pinWeight(b.id) - pinWeight(a.id));
  }, [assets, search, typeFilter, selectedTags, sortBy, pinned]);

  const togglePin = (id: string) => {
    setPinned((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
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
              <BreadcrumbPage>知识资产库</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">知识库与资产</h1>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">复用/引用</Badge>
        </div>
        <p className="text-muted-foreground">存储工艺模板、参数包、仿真报告、试验/量产数据，并提供复用入口。</p>
      </div>

      <Card className="bg-card border-border/50 shadow-card">
        <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <LibraryBig className="h-5 w-5 text-primary" /> 资产检索
          </CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full">
            <div className="relative">
              <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="搜索标题/描述"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pl-9"
              />
            </div>
            <MultiSelect
              placeholder="按标签过滤"
              options={tagOptions}
              value={selectedTags}
              onValueChange={setSelectedTags}
            />
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                {typeOptions.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="排序" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated">按更新时间</SelectItem>
                <SelectItem value="usage">按复用次数</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="secondary" className="h-9">
              <PlusCircle className="h-4 w-4 mr-1" /> 新建资产
            </Button>
          </div>
        </CardHeader>
        <Separator />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)
              : filtered.map((item) => (
                  <Card key={item.id} className="border-border/50 hover:shadow-elegant transition-smooth">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between gap-2">
                            <CardTitle className="text-base font-semibold">{item.title}</CardTitle>
                            <Badge variant="outline" className="bg-muted/60 text-foreground/80">
                              {item.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">负责人：{item.owner}</p>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-muted-foreground min-h-[40px]">{item.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {item.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary">
                                <Tag className="h-3 w-3 mr-1" /> {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>更新时间：{item.updatedAt}</span>
                            <Badge variant="outline" className="bg-muted/40 border-muted/40">
                              复用 {item.usage ?? 0} 次
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="h-8" onClick={() => setReuseTarget(item)}>
                                <Copy className="h-4 w-4 mr-1" /> 复用/引用
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8" onClick={() => togglePin(item.id)}>
                                <Pin className={`h-4 w-4 mr-1 ${pinned.includes(item.id) ? "text-primary" : ""}`} /> {pinned.includes(item.id) ? "取消收藏" : "收藏"}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                ))}
          </div>
          {!isLoading && filtered.length === 0 && (
            <div className="text-center text-muted-foreground py-8">暂无资产，尝试调整筛选或新建</div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!reuseTarget} onOpenChange={() => setReuseTarget(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>复用/引用资产</DialogTitle>
            <DialogDescription>选择目标方案或工艺任务，生成引用关系。</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="目标方案/任务" className="h-10" />
            <Input placeholder="备注（可选）" className="h-10" />
            <p className="text-sm text-muted-foreground">资产：{reuseTarget?.title}</p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setReuseTarget(null)}>取消</Button>
            <Button>确认复用</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
