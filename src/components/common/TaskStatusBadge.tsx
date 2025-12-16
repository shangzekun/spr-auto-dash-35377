import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type TaskStatus = "completed" | "running" | "failed" | "pending" | "delayed";

type Props = {
  status: TaskStatus;
  progress?: number;
  showProgress?: boolean;
};

const statusMap: Record<TaskStatus, { label: string; className: string }> = {
  completed: { label: "已完成", className: "bg-success/10 text-success border-success/30" },
  running: { label: "运行中", className: "bg-primary/10 text-primary border-primary/30" },
  failed: { label: "失败", className: "bg-destructive/10 text-destructive border-destructive/30" },
  pending: { label: "等待中", className: "bg-warning/10 text-warning border-warning/30" },
  delayed: { label: "延迟", className: "bg-amber-100 text-amber-900 border-amber-200" },
};

export function TaskStatusBadge({ status, progress, showProgress }: Props) {
  const meta = statusMap[status];

  return (
    <div className="space-y-1 min-w-[120px]">
      <Badge variant="outline" className={cn("w-fit", meta.className)}>
        {meta.label}
      </Badge>
      {showProgress && (
        <Progress value={progress ?? 0} className="h-2" aria-label={`${meta.label} 进度`} />
      )}
    </div>
  );
}
