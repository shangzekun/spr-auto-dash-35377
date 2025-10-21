import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Download, Calendar as CalendarIcon, RefreshCw, Eye } from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OperationLog {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  module: string;
  details: string;
  ip: string;
  status: "success" | "failed" | "warning";
}

// 模拟数据
const mockLogs: OperationLog[] = [
  {
    id: "1",
    timestamp: new Date(2025, 0, 20, 14, 30),
    user: "张三",
    action: "导入数据",
    module: "数据导入",
    details: "导入了 150 条产品数据到项目A",
    ip: "192.168.1.100",
    status: "success"
  },
  {
    id: "2",
    timestamp: new Date(2025, 0, 20, 13, 15),
    user: "李四",
    action: "修改配置",
    module: "系统设置",
    details: "更新了数据库连接配置",
    ip: "192.168.1.101",
    status: "success"
  },
  {
    id: "3",
    timestamp: new Date(2025, 0, 20, 12, 45),
    user: "王五",
    action: "删除数据",
    module: "数据导入",
    details: "删除了 5 条无效数据记录",
    ip: "192.168.1.102",
    status: "success"
  },
  {
    id: "4",
    timestamp: new Date(2025, 0, 20, 11, 20),
    user: "赵六",
    action: "登录失败",
    module: "账号管理",
    details: "多次尝试登录失败",
    ip: "192.168.1.103",
    status: "failed"
  },
  {
    id: "5",
    timestamp: new Date(2025, 0, 20, 10, 30),
    user: "系统",
    action: "自动备份",
    module: "系统维护",
    details: "执行定时数据备份任务",
    ip: "127.0.0.1",
    status: "success"
  },
  {
    id: "6",
    timestamp: new Date(2025, 0, 20, 9, 15),
    user: "张三",
    action: "导出报表",
    module: "核心场景",
    details: "导出了2025年1月工艺分析报表",
    ip: "192.168.1.100",
    status: "success"
  },
  {
    id: "7",
    timestamp: new Date(2025, 0, 19, 16, 45),
    user: "李四",
    action: "权限变更",
    module: "权限管理",
    details: "为用户'王五'添加了管理员权限",
    ip: "192.168.1.101",
    status: "warning"
  },
  {
    id: "8",
    timestamp: new Date(2025, 0, 19, 15, 30),
    user: "王五",
    action: "创建项目",
    module: "数据导入",
    details: "创建了新项目'项目B'",
    ip: "192.168.1.102",
    status: "success"
  },
];

export default function OperationLogs() {
  const [logs, setLogs] = useState<OperationLog[]>(mockLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModule, setFilterModule] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedLog, setSelectedLog] = useState<OperationLog | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // 获取所有唯一的模块名称
  const modules = Array.from(new Set(logs.map(log => log.module)));

  // 过滤日志
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesModule = filterModule === "all" || log.module === filterModule;
    const matchesStatus = filterStatus === "all" || log.status === filterStatus;
    
    const matchesDate = 
      (!dateRange.from || log.timestamp >= dateRange.from) &&
      (!dateRange.to || log.timestamp <= dateRange.to);

    return matchesSearch && matchesModule && matchesStatus && matchesDate;
  });

  const handleRefresh = () => {
    toast({
      title: "刷新成功",
      description: "操作日志已更新",
    });
  };

  const handleExport = () => {
    toast({
      title: "导出成功",
      description: `已导出 ${filteredLogs.length} 条日志记录`,
    });
  };

  const handleViewDetail = (log: OperationLog) => {
    setSelectedLog(log);
    setIsDetailDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge variant="default" className="bg-green-500">成功</Badge>;
      case "failed":
        return <Badge variant="destructive">失败</Badge>;
      case "warning":
        return <Badge variant="secondary" className="bg-yellow-500">警告</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background p-6 space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">操作日志</h1>
        <p className="text-muted-foreground">查看和管理系统操作记录</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>总日志数</CardDescription>
            <CardTitle className="text-3xl">{logs.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>成功操作</CardDescription>
            <CardTitle className="text-3xl text-green-500">
              {logs.filter(l => l.status === "success").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>失败操作</CardDescription>
            <CardTitle className="text-3xl text-red-500">
              {logs.filter(l => l.status === "failed").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>警告操作</CardDescription>
            <CardTitle className="text-3xl text-yellow-500">
              {logs.filter(l => l.status === "warning").length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* 过滤和搜索 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            筛选与搜索
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="搜索用户、操作或详情..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterModule} onValueChange={setFilterModule}>
              <SelectTrigger>
                <SelectValue placeholder="选择模块" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有模块</SelectItem>
                {modules.map(module => (
                  <SelectItem key={module} value={module}>{module}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有状态</SelectItem>
                <SelectItem value="success">成功</SelectItem>
                <SelectItem value="failed">失败</SelectItem>
                <SelectItem value="warning">警告</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "PPP", { locale: zhCN })} -{" "}
                        {format(dateRange.to, "PPP", { locale: zhCN })}
                      </>
                    ) : (
                      format(dateRange.from, "PPP", { locale: zhCN })
                    )
                  ) : (
                    "选择日期范围"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) => setDateRange(range || {})}
                  locale={zhCN}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            <div className="flex gap-2">
              <Button onClick={handleRefresh} variant="outline" className="flex-1">
                <RefreshCw className="w-4 h-4 mr-2" />
                刷新
              </Button>
              <Button onClick={handleExport} variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                导出
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 日志列表 */}
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>操作记录</CardTitle>
          <CardDescription>
            共 {filteredLogs.length} 条记录
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">时间</TableHead>
                <TableHead className="w-[100px]">用户</TableHead>
                <TableHead className="w-[120px]">操作</TableHead>
                <TableHead className="w-[120px]">模块</TableHead>
                <TableHead>详情</TableHead>
                <TableHead className="w-[120px]">IP地址</TableHead>
                <TableHead className="w-[80px]">状态</TableHead>
                <TableHead className="w-[80px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-sm">
                    {format(log.timestamp, "yyyy-MM-dd HH:mm:ss")}
                  </TableCell>
                  <TableCell className="font-medium">{log.user}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.module}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {log.details}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                  <TableCell>{getStatusBadge(log.status)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetail(log)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 详情对话框 */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>操作日志详情</DialogTitle>
            <DialogDescription>查看完整的操作记录信息</DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">日志ID</label>
                  <p className="text-sm font-mono mt-1">{selectedLog.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">时间</label>
                  <p className="text-sm mt-1">
                    {format(selectedLog.timestamp, "yyyy-MM-dd HH:mm:ss")}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">用户</label>
                  <p className="text-sm mt-1">{selectedLog.user}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">IP地址</label>
                  <p className="text-sm font-mono mt-1">{selectedLog.ip}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">操作</label>
                  <p className="text-sm mt-1">{selectedLog.action}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">模块</label>
                  <p className="text-sm mt-1">
                    <Badge variant="outline">{selectedLog.module}</Badge>
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">状态</label>
                  <div className="mt-1">{getStatusBadge(selectedLog.status)}</div>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">详细描述</label>
                  <p className="text-sm mt-1 p-3 bg-muted rounded-md">
                    {selectedLog.details}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
