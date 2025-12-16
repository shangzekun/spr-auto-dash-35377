import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AlertTrendPoint } from "@/lib/api/types";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Flame } from "lucide-react";

type Props = {
  data?: AlertTrendPoint[];
  isLoading?: boolean;
};

const chartConfig = {
  critical: {
    label: "紧急",
    color: "hsl(var(--destructive))",
  },
  warning: {
    label: "预警",
    color: "hsl(var(--warning))",
  },
  info: {
    label: "提示",
    color: "hsl(var(--primary))",
  },
};

export function AlertTrendCard({ data, isLoading }: Props) {
  return (
    <Card className="bg-gradient-card border-border/50 shadow-card h-full flex flex-col">
      <CardHeader className="pb-2 flex-shrink-0">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Flame className="h-5 w-5 text-primary" />
          近期报警趋势
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading ? (
          <div className="animate-pulse h-60 rounded-lg bg-muted/40" />
        ) : (
          <ChartContainer config={chartConfig} className="h-60">
            <AreaChart data={data || []} margin={{ left: 4, right: 4 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} dy={4} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="critical"
                stroke="var(--color-critical)"
                fill="var(--color-critical)"
                fillOpacity={0.35}
                stackId="alerts"
              />
              <Area
                type="monotone"
                dataKey="warning"
                stroke="var(--color-warning)"
                fill="var(--color-warning)"
                fillOpacity={0.3}
                stackId="alerts"
              />
              <Area
                type="monotone"
                dataKey="info"
                stroke="var(--color-info)"
                fill="var(--color-info)"
                fillOpacity={0.25}
                stackId="alerts"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
