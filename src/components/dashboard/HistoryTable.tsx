import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, Eye, Download } from "lucide-react";
interface HistoryRecord {
  id: string;
  taskName: string;
  type: string;
  status: "completed" | "running" | "failed" | "pending";
  progress: number;
  startTime: string;
  endTime?: string;
  duration?: string;
  operator: string;
}
interface HistoryTableProps {
  records: HistoryRecord[];
}
export function HistoryTable({
  records
}: HistoryTableProps) {
  const getStatusColor = (status: HistoryRecord["status"]) => {
    switch (status) {
      case "completed":
        return "bg-success/10 text-success border-success/20";
      case "running":
        return "bg-primary/10 text-primary border-primary/20";
      case "failed":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };
  const getStatusLabel = (status: HistoryRecord["status"]) => {
    switch (status) {
      case "completed":
        return "已完成";
      case "running":
        return "运行中";
      case "failed":
        return "失败";
      case "pending":
        return "等待中";
      default:
        return "未知";
    }
  };
  return <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-elegant transition-smooth">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5 text-primary" />
          历史分析记录
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border/50 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-medium">1</TableHead>
                <TableHead className="font-medium">2</TableHead>
                <TableHead className="font-medium">3</TableHead>
                <TableHead className="font-medium">4</TableHead>
                <TableHead className="font-medium">5</TableHead>
                <TableHead className="font-medium">6</TableHead>
                <TableHead className="font-medium">7</TableHead>
                <TableHead className="font-medium">8</TableHead>
                <TableHead className="font-medium">任务名称</TableHead>
                <TableHead className="font-medium">任务类型</TableHead>
                <TableHead className="font-medium">状态</TableHead>
                <TableHead className="font-medium">开始时间</TableHead>
                <TableHead className="font-medium">耗时</TableHead>
                <TableHead className="font-medium">操作员</TableHead>
                <TableHead className="font-medium text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 ? <TableRow>
                  <TableCell colSpan={15} className="text-center py-8 text-muted-foreground">
                    暂无历史记录
                  </TableCell>
                </TableRow> : records.map((record, index) => <TableRow key={record.id} className="hover:bg-muted/30 transition-smooth">
                    <TableCell className="text-sm text-muted-foreground w-12">{index + 1}</TableCell>
                    <TableCell className="text-sm text-muted-foreground w-12">-</TableCell>
                    <TableCell className="text-sm text-muted-foreground w-12">-</TableCell>
                    <TableCell className="text-sm text-muted-foreground w-12">-</TableCell>
                    <TableCell className="text-sm text-muted-foreground w-12">-</TableCell>
                    <TableCell className="text-sm text-muted-foreground w-12">-</TableCell>
                    <TableCell className="text-sm text-muted-foreground w-12">-</TableCell>
                    <TableCell className="text-sm text-muted-foreground w-12">-</TableCell>
                    <TableCell className="font-medium">{record.taskName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                        {record.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(record.status)}>
                        {getStatusLabel(record.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {record.startTime}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {record.duration || "-"}
                    </TableCell>
                    <TableCell className="text-sm">{record.operator}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted hover:scale-105 transition-smooth">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted hover:scale-105 transition-smooth">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>)}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>;
}