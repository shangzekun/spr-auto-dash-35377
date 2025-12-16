import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, Eye, Download, Filter } from "lucide-react";
import { RunHistoryRecord } from "@/lib/api/types";

interface HistoryTableProps {
  records: RunHistoryRecord[];
  isLoading?: boolean;
}

const statusOptions: Array<RunHistoryRecord["status"] | "all"> = [
  "all",
  "completed",
  "running",
  "failed",
  "pending",
  "delayed",
];

const timeOptions = [
  { value: "all", label: "全部时间" },
  { value: "today", label: "今天" },
  { value: "week", label: "近7天" },
];

export function HistoryTable({ records, isLoading }: HistoryTableProps) {
  const [statusFilter, setStatusFilter] = useState<RunHistoryRecord["status"] | "all">("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const filtered = useMemo(() => {
    return records
      .filter((record) => {
        if (statusFilter !== "all" && record.status !== statusFilter) return false;
        if (typeFilter && !record.processType.includes(typeFilter)) return false;

        const recordDate = new Date(record.startTime.replace(" ", "T"));
        const now = new Date("2024-05-05T12:00:00");
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - 7);

        if (timeFilter === "today") {
          return recordDate >= startOfDay;
        }
        if (timeFilter === "week") {
          return recordDate >= startOfWeek;
        }
        return true;
      })
      .sort((a, b) => (a.startTime > b.startTime ? -1 : 1));
  }, [records, statusFilter, typeFilter, timeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedRecords = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getStatusColor = (status: RunHistoryRecord["status"]) => {
    switch (status) {
      case "completed":
        return "bg-success/10 text-success border-success/20";
      case "running":
        return "bg-primary/10 text-primary border-primary/20";
      case "failed":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "delayed":
        return "bg-amber-100 text-amber-900 border-amber-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: RunHistoryRecord["status"]) => {
    switch (status) {
      case "completed":
        return "已完成";
      case "running":
        return "运行中";
      case "failed":
        return "失败";
      case "pending":
        return "等待中";
      case "delayed":
        return "延迟";
      default:
        return "未知";
    }
  };

  const handlePageChange = (nextPage: number) => {
    setPage(Math.max(1, Math.min(totalPages, nextPage)));
  };

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-elegant transition-smooth h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5 text-primary" />
          历史分析记录
        </CardTitle>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt === "all" ? "全部状态" : getStatusLabel(opt as RunHistoryRecord["status"])}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="时间范围" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="按工艺类型搜索"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-9"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className="rounded-md border border-border/50 h-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-medium whitespace-nowrap text-center">序号</TableHead>
                <TableHead className="font-medium whitespace-nowrap text-center">任务名称</TableHead>
                <TableHead className="font-medium whitespace-nowrap text-center">任务类型</TableHead>
                <TableHead className="font-medium whitespace-nowrap text-center">状态</TableHead>
                <TableHead className="font-medium whitespace-nowrap text-center">开始时间</TableHead>
                <TableHead className="font-medium whitespace-nowrap text-center">耗时</TableHead>
                <TableHead className="font-medium whitespace-nowrap text-center">操作员</TableHead>
                <TableHead className="font-medium whitespace-nowrap text-center">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(pageSize)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={8} className="py-3">
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : pagedRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    暂无历史记录
                  </TableCell>
                </TableRow>
              ) : (
                pagedRecords.map((record, index) => (
                  <TableRow key={record.id} className="hover:bg-muted/30 transition-smooth">
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap text-center">
                      {(currentPage - 1) * pageSize + index + 1}
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] text-center">
                      {record.taskName}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-center">
                      <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                        {record.processType}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-center">
                      <Badge variant="outline" className={getStatusColor(record.status)}>
                        {getStatusLabel(record.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap text-center">
                      {record.startTime}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap text-center">
                      {record.duration || "-"}
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap text-center">{record.operator}</TableCell>
                    <TableCell className="text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-muted hover:scale-105 transition-smooth"
                          aria-label="查看"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-muted hover:scale-105 transition-smooth"
                          aria-label="下载"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-3 flex justify-between items-center text-sm text-muted-foreground">
          <span>
            共 {filtered.length} 条记录 / 第 {currentPage} 页
          </span>
          <Pagination className="w-fit ml-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === i + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(i + 1);
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
}
