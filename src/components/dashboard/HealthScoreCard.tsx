import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HealthScore } from "@/lib/api/types";
import { Gauge, HeartPulse } from "lucide-react";

export function HealthScoreCard({ score, comment, risks, tags }: HealthScore) {
  const normalized = Math.min(100, Math.max(0, score));
  const angle = (normalized / 100) * 360;

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card h-full flex flex-col">
      <CardHeader className="pb-2 flex-shrink-0">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gauge className="h-5 w-5 text-primary" />
          工艺健康度
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 grid grid-cols-1 gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-28 h-28 rounded-full border border-border/60 relative flex items-center justify-center shadow-inner"
            style={{
              background:
                "conic-gradient(var(--primary) 0deg, var(--primary) " +
                angle +
                "deg, rgba(255,255,255,0.05) " +
                angle +
                "deg, rgba(255,255,255,0.05) 360deg)",
            }}
          >
            <div className="w-20 h-20 rounded-full bg-background border border-border/60 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-foreground">{score}</span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
            <HeartPulse className="absolute -bottom-2 h-5 w-5 text-primary drop-shadow" />
          </div>
          <div className="space-y-2 min-w-0">
            <p className="text-sm text-muted-foreground leading-relaxed">{comment}</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline" className="bg-primary/5 text-primary border-primary/20">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">风险与关注点</p>
          <div className="flex flex-wrap gap-2">
            {risks.map((risk) => (
              <Badge key={risk} variant="secondary" className="bg-destructive/10 text-destructive">
                {risk}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
