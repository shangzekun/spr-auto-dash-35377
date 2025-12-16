import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertItem } from "@/lib/api/types";
import { Bell, ShieldAlert, Clock } from "lucide-react";

const levelColor: Record<AlertItem["level"], string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/30",
  warning: "bg-warning/10 text-warning border-warning/30",
  info: "bg-primary/10 text-primary border-primary/30",
};

const statusLabel: Record<AlertItem["status"], string> = {
  open: "待处理",
  acknowledged: "已关注",
  resolved: "已关闭",
};

type Props = {
  alerts?: AlertItem[];
  isLoading?: boolean;
};

export function AlertsCard({ alerts, isLoading }: Props) {
  return (
    <Card className="bg-gradient-card border-border/50 shadow-card h-full flex flex-col">
      <CardHeader className="pb-2 flex-shrink-0">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShieldAlert className="h-5 w-5 text-primary" />
          异常告警
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 rounded-lg bg-muted/40" />
            ))}
          </div>
        ) : alerts && alerts.length > 0 ? (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-lg border border-border/50 bg-card/50 p-3 hover:border-primary/30 transition-smooth"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Badge variant="outline" className={levelColor[alert.level]}>
                      {alert.level === "critical"
                        ? "紧急"
                        : alert.level === "warning"
                        ? "预警"
                        : "提示"}
                    </Badge>
                    <p className="font-medium text-foreground truncate" title={alert.title}>
                      {alert.title}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-muted/40 text-muted-foreground border-muted/40">
                    {statusLabel[alert.status]}
                  </Badge>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Bell className="h-3 w-3" />{alert.rule}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{alert.time}</span>
                  <span className="px-2 py-1 rounded-full bg-muted/50">{alert.source}</span>
                  {alert.owner && <span className="px-2 py-1 rounded-full bg-primary/10 text-primary">{alert.owner}</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            暂无告警
          </div>
        )}
      </CardContent>
    </Card>
  );
}
