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
  return <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-elegant transition-smooth h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5 text-primary" />
          历史分析记录
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0 p-0">
        {/* 表格容器 - 固定高度，包含垂直和水平滚动 */}
        <div className="flex-1 flex flex-col min-h-0 px-6">
          {/* 水平滚动容器 */}
          <div className="flex-1 overflow-auto border border-border/50 rounded-md relative">
            <Table className="relative">
              {/* 固定表头 */}
              <TableHeader className="sticky top-0 z-20 bg-muted/95 backdrop-blur-sm shadow-sm">
                <TableRow className="border-b-2 border-border/50">
                  <TableHead className="font-medium whitespace-nowrap text-center sticky left-0 bg-muted/95 backdrop-blur-sm z-10 border-r border-border/30">序号</TableHead>
                  <TableHead className="font-medium whitespace-nowrap text-center">Material 1</TableHead>
                  <TableHead className="font-medium whitespace-nowrap text-center">Material 2</TableHead>
                  <TableHead className="font-medium whitespace-nowrap text-center">Material 3</TableHead>
                  <TableHead className="font-medium whitespace-nowrap text-center">Gauge 1</TableHead>
                  <TableHead className="font-medium whitespace-nowrap text-center">Gauge 2</TableHead>
                  <TableHead className="font-medium whitespace-nowrap text-center">Gauge 3</TableHead>
                  <TableHead className="font-medium whitespace-nowrap text-center">Rivet</TableHead>
                  <TableHead className="font-medium whitespace-nowrap text-center">Die</TableHead>
                  <TableHead className="font-medium whitespace-nowrap text-center">任务名称</TableHead>
                  <TableHead className="font-medium whitespace-nowrap text-center">任务类型</TableHead>
                  <TableHead className="font-medium whitespace-nowrap text-center">状态</TableHead>
                  <TableHead className="font-medium whitespace-nowrap text-center">开始时间</TableHead>
                  <TableHead className="font-medium whitespace-nowrap text-center">耗时</TableHead>
                  <TableHead className="font-medium whitespace-nowrap text-center">操作员</TableHead>
                  <TableHead className="font-medium whitespace-nowrap text-center sticky right-0 bg-muted/95 backdrop-blur-sm z-10 border-l border-border/30">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.length === 0 ? <TableRow>
                    <TableCell colSpan={16} className="text-center py-8 text-muted-foreground">
                      暂无历史记录
                    </TableCell>
                  </TableRow> : records.map((record, index) => <TableRow key={record.id} className="hover:bg-muted/30 transition-smooth">
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap text-center sticky left-0 bg-background z-10 border-r border-border/30">{index + 1}</TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap text-center">-</TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap text-center">-</TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap text-center">-</TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap text-center">-</TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap text-center">-</TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap text-center">-</TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap text-center">-</TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap text-center">-</TableCell>
                      <TableCell className="font-medium whitespace-nowrap text-center min-w-[200px]">{record.taskName}</TableCell>
                      <TableCell className="whitespace-nowrap text-center">
                        <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                          {record.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-center">
                        <Badge variant="outline" className={getStatusColor(record.status)}>
                          {getStatusLabel(record.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap text-center min-w-[150px]">
                        {record.startTime}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap text-center min-w-[100px]">
                        {record.duration || "-"}
                      </TableCell>
                      <TableCell className="text-sm whitespace-nowrap text-center min-w-[100px]">{record.operator}</TableCell>
                      <TableCell className="text-center whitespace-nowrap sticky right-0 bg-background z-10 border-l border-border/30">
                        <div className="flex items-center justify-center gap-1">
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
        </div>
      </CardContent>
    </Card>;
}
