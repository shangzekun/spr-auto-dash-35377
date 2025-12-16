import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircleMore, Paperclip, Workflow } from "lucide-react";
import { getCollaborationLanes } from "@/lib/api/catalog";
import { queryKeys } from "@/lib/api/queryKeys";
import { CollaborationLane } from "@/lib/api/types";
import { TaskStatusBadge } from "@/components/common/TaskStatusBadge";

export default function Collaboration() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.collaboration,
    queryFn: getCollaborationLanes,
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
              <BreadcrumbPage>协同流程</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">全流程协同</h1>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">泳道/步骤视图</Badge>
        </div>
        <p className="text-muted-foreground">工艺设计 → 仿真 → 试验 → 量产 → 异常分析 → 回馈，展示责任角色、状态、待办。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)
          : data?.map((lane) => (
              <Card key={lane.id} className="border-border/50 shadow-card hover:shadow-elegant transition-smooth">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Workflow className="h-5 w-5 text-primary" /> {lane.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    责任人：{lane.owner}
                    <Badge variant="outline" className="bg-muted/60 text-foreground/80">
                      截止：{lane.due}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <TaskStatusBadge status={lane.status} showProgress />
                  <div className="space-y-2 text-sm text-foreground">
                    {lane.todos.map((todo, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 border border-border/40">
                        <Paperclip className="h-4 w-4 text-primary" />
                        <span className="truncate">{todo}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="h-8">
                      <MessageCircleMore className="h-4 w-4 mr-1" /> 评论
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8">添加附件</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      <Card className="bg-card border-dashed border-border/50">
        <CardContent className="py-6 text-sm text-muted-foreground flex items-center justify-between">
          <span>待办/评论侧栏占位：支持添加评论、附件、审批流挂接。</span>
          <Button variant="secondary" size="sm">打开侧栏</Button>
        </CardContent>
      </Card>
    </div>
  );
}
