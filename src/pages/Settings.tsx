import { useState } from "react";
import { Settings as SettingsIcon, Database, User, Shield, Key, Bell, Monitor, Globe, Trash2, CheckCircle, AlertCircle, Lock, Mail, Smartphone, Download, Upload, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function Settings() {
  const [databaseConfig, setDatabaseConfig] = useState({
    host: "localhost",
    port: "5432",
    database: "spr_system",
    username: "admin",
    password: "********",
    maxConnections: "100",
    connectionTimeout: "30",
    sslEnabled: true,
    autoBackup: true,
    backupInterval: "daily"
  });

  const [accountData, setAccountData] = useState({
    username: "admin",
    email: "admin@example.com",
    phone: "+86 138****5678",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    maintenanceAlerts: true,
    systemUpdates: true,
    dataExportAlerts: true,
    securityAlerts: true
  });

  const [systemSettings, setSystemSettings] = useState({
    language: "zh-CN",
    timezone: "Asia/Shanghai",
    theme: "dark",
    autoSave: true,
    autoSaveInterval: "5",
    sessionTimeout: "30",
    dataRetention: "90",
    enableAuditLog: true,
    enablePerformanceMonitor: true
  });

  const [users, setUsers] = useState([
    { id: "1", name: "张工程师", email: "zhang@example.com", role: "管理员", status: "活跃", lastLogin: "2024-01-15 14:30" },
    { id: "2", name: "李工程师", email: "li@example.com", role: "操作员", status: "活跃", lastLogin: "2024-01-15 13:45" },
    { id: "3", name: "王工程师", email: "wang@example.com", role: "观察者", status: "非活跃", lastLogin: "2024-01-10 09:20" },
    { id: "4", name: "陈工程师", email: "chen@example.com", role: "操作员", status: "活跃", lastLogin: "2024-01-15 12:15" }
  ]);

  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "观察者"
  });

  const [dbTestStatus, setDbTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");

  // 测试数据库连接
  const handleTestConnection = () => {
    setDbTestStatus("testing");
    setTimeout(() => {
      setDbTestStatus("success");
      toast.success("数据库连接成功！", {
        description: "所有配置参数验证通过"
      });
      setTimeout(() => setDbTestStatus("idle"), 3000);
    }, 1500);
  };

  // 保存数据库配置
  const handleSaveDatabaseConfig = () => {
    toast.success("数据库配置已保存", {
      description: "配置将在下次重启后生效"
    });
  };

  // 执行数据库备份
  const handleBackupDatabase = () => {
    toast.success("数据库备份已开始", {
      description: "备份完成后将通知您"
    });
  };

  // 更新密码
  const handleUpdatePassword = () => {
    if (!accountData.currentPassword) {
      toast.error("请输入当前密码");
      return;
    }
    if (!accountData.newPassword || accountData.newPassword.length < 8) {
      toast.error("新密码至少需要8个字符");
      return;
    }
    if (accountData.newPassword !== accountData.confirmPassword) {
      toast.error("两次输入的密码不一致");
      return;
    }
    toast.success("密码更新成功", {
      description: "下次登录请使用新密码"
    });
    setAccountData(prev => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }));
  };

  // 更新账号信息
  const handleUpdateAccountInfo = () => {
    if (!accountData.email.includes("@")) {
      toast.error("请输入有效的邮箱地址");
      return;
    }
    toast.success("账号信息已更新");
  };

  // 保存通知设置
  const handleSaveNotifications = () => {
    toast.success("通知设置已保存");
  };

  // 添加用户
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error("请填写完整用户信息");
      return;
    }
    if (!newUser.email.includes("@")) {
      toast.error("请输入有效的邮箱地址");
      return;
    }
    const user = {
      id: String(users.length + 1),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: "活跃",
      lastLogin: "-"
    };
    setUsers([...users, user]);
    setNewUser({ name: "", email: "", role: "观察者" });
    setIsAddUserDialogOpen(false);
    toast.success("用户添加成功", {
      description: `已为 ${user.name} 创建账号`
    });
  };

  // 编辑用户
  const handleEditUser = (user: any) => {
    setEditingUser({ ...user });
    setIsEditUserDialogOpen(true);
  };

  // 保存编辑的用户
  const handleSaveEditUser = () => {
    if (!editingUser.name || !editingUser.email) {
      toast.error("请填写完整用户信息");
      return;
    }
    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    setIsEditUserDialogOpen(false);
    toast.success("用户信息已更新");
  };

  // 删除用户
  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    setUsers(users.filter(u => u.id !== userId));
    setDeleteUserId(null);
    toast.success("用户已删除", {
      description: `已删除用户 ${user?.name}`
    });
  };

  // 切换用户状态
  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === "活跃" ? "非活跃" : "活跃" } 
        : u
    ));
    const user = users.find(u => u.id === userId);
    toast.success(`用户状态已更新`, {
      description: `${user?.name} 已${user?.status === "活跃" ? "禁用" : "启用"}`
    });
  };

  // 保存系统设置
  const handleSaveSystemSettings = () => {
    toast.success("系统设置已保存", {
      description: "部分设置可能需要刷新页面后生效"
    });
  };

  // 导出系统配置
  const handleExportSettings = () => {
    toast.success("配置导出成功", {
      description: "配置文件已下载到本地"
    });
  };

  // 导入系统配置
  const handleImportSettings = () => {
    toast.success("配置导入成功", {
      description: "系统配置已更新"
    });
  };

  // 重置系统设置
  const handleResetSettings = () => {
    setSystemSettings({
      language: "zh-CN",
      timezone: "Asia/Shanghai",
      theme: "dark",
      autoSave: true,
      autoSaveInterval: "5",
      sessionTimeout: "30",
      dataRetention: "90",
      enableAuditLog: true,
      enablePerformanceMonitor: true
    });
    toast.success("系统设置已重置为默认值");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
          <SettingsIcon className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">系统设置</h1>
          <p className="text-muted-foreground">系统配置与用户管理</p>
        </div>
      </div>

      <Tabs defaultValue="database" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="database" className="gap-2">
            <Database className="w-4 h-4" />
            数据库配置
          </TabsTrigger>
          <TabsTrigger value="account" className="gap-2">
            <User className="w-4 h-4" />
            账号设置
          </TabsTrigger>
          <TabsTrigger value="permissions" className="gap-2">
            <Shield className="w-4 h-4" />
            权限管理
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <Monitor className="w-4 h-4" />
            系统设置
          </TabsTrigger>
        </TabsList>

        <TabsContent value="database" className="mt-6">
          <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-elegant transition-smooth">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                  <Database className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle>数据库配置</CardTitle>
                  <p className="text-muted-foreground text-sm">配置系统数据库连接参数</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="db-host">数据库主机</Label>
                  <Input
                    id="db-host"
                    value={databaseConfig.host}
                    onChange={(e) => setDatabaseConfig(prev => ({ ...prev, host: e.target.value }))}
                    placeholder="localhost 或 IP 地址"
                    className="hover:border-primary/50 transition-smooth"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-port">端口</Label>
                  <Input
                    id="db-port"
                    value={databaseConfig.port}
                    onChange={(e) => setDatabaseConfig(prev => ({ ...prev, port: e.target.value }))}
                    placeholder="默认 5432"
                    className="hover:border-primary/50 transition-smooth"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-name">数据库名</Label>
                  <Input
                    id="db-name"
                    value={databaseConfig.database}
                    onChange={(e) => setDatabaseConfig(prev => ({ ...prev, database: e.target.value }))}
                    className="hover:border-primary/50 transition-smooth"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-username">用户名</Label>
                  <Input
                    id="db-username"
                    value={databaseConfig.username}
                    onChange={(e) => setDatabaseConfig(prev => ({ ...prev, username: e.target.value }))}
                    className="hover:border-primary/50 transition-smooth"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-password">密码</Label>
                  <Input
                    id="db-password"
                    type="password"
                    value={databaseConfig.password}
                    onChange={(e) => setDatabaseConfig(prev => ({ ...prev, password: e.target.value }))}
                    className="hover:border-primary/50 transition-smooth"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-connections">最大连接数</Label>
                  <Input
                    id="max-connections"
                    type="number"
                    value={databaseConfig.maxConnections}
                    onChange={(e) => setDatabaseConfig(prev => ({ ...prev, maxConnections: e.target.value }))}
                    className="hover:border-primary/50 transition-smooth"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="connection-timeout">连接超时（秒）</Label>
                  <Input
                    id="connection-timeout"
                    type="number"
                    value={databaseConfig.connectionTimeout}
                    onChange={(e) => setDatabaseConfig(prev => ({ ...prev, connectionTimeout: e.target.value }))}
                    className="hover:border-primary/50 transition-smooth"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backup-interval">备份频率</Label>
                  <Select 
                    value={databaseConfig.backupInterval} 
                    onValueChange={(value) => setDatabaseConfig(prev => ({ ...prev, backupInterval: value }))}
                  >
                    <SelectTrigger className="hover:border-primary/50 transition-smooth">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">每小时</SelectItem>
                      <SelectItem value="daily">每天</SelectItem>
                      <SelectItem value="weekly">每周</SelectItem>
                      <SelectItem value="monthly">每月</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">高级选项</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>启用 SSL 加密连接</Label>
                      <p className="text-sm text-muted-foreground">提高数据传输安全性</p>
                    </div>
                    <Switch
                      checked={databaseConfig.sslEnabled}
                      onCheckedChange={(checked) => 
                        setDatabaseConfig(prev => ({ ...prev, sslEnabled: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>自动备份</Label>
                      <p className="text-sm text-muted-foreground">定期自动备份数据库</p>
                    </div>
                    <Switch
                      checked={databaseConfig.autoBackup}
                      onCheckedChange={(checked) => 
                        setDatabaseConfig(prev => ({ ...prev, autoBackup: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex gap-3 flex-wrap">
                <Button 
                  onClick={handleTestConnection}
                  disabled={dbTestStatus === "testing"}
                  className="hover:scale-105 transition-smooth gap-2"
                >
                  {dbTestStatus === "testing" && <RefreshCw className="w-4 h-4 animate-spin" />}
                  {dbTestStatus === "success" && <CheckCircle className="w-4 h-4" />}
                  {dbTestStatus === "error" && <AlertCircle className="w-4 h-4" />}
                  {dbTestStatus === "testing" ? "测试中..." : "测试连接"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleSaveDatabaseConfig}
                  className="hover:scale-105 transition-smooth"
                >
                  保存配置
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleBackupDatabase}
                  className="hover:scale-105 transition-smooth gap-2"
                >
                  <Database className="w-4 h-4" />
                  立即备份
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="mt-6">
          <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-elegant transition-smooth">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                  <User className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle>账号设置</CardTitle>
                  <p className="text-muted-foreground text-sm">修改个人账号信息和密码</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <User className="w-5 h-5" />
                  基本信息
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">用户名</Label>
                    <Input
                      id="username"
                      value={accountData.username}
                      onChange={(e) => setAccountData(prev => ({ ...prev, username: e.target.value }))}
                      className="hover:border-primary/50 transition-smooth"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">邮箱地址</Label>
                    <Input
                      id="email"
                      type="email"
                      value={accountData.email}
                      onChange={(e) => setAccountData(prev => ({ ...prev, email: e.target.value }))}
                      className="hover:border-primary/50 transition-smooth"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">手机号码</Label>
                    <Input
                      id="phone"
                      value={accountData.phone}
                      onChange={(e) => setAccountData(prev => ({ ...prev, phone: e.target.value }))}
                      className="hover:border-primary/50 transition-smooth"
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleUpdateAccountInfo}
                  className="hover:scale-105 transition-smooth"
                >
                  保存基本信息
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  修改密码
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="current-password">当前密码</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={accountData.currentPassword}
                    onChange={(e) => setAccountData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="请输入当前密码"
                    className="hover:border-primary/50 transition-smooth"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">新密码</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={accountData.newPassword}
                    onChange={(e) => setAccountData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="至少8个字符"
                    className="hover:border-primary/50 transition-smooth"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">确认新密码</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={accountData.confirmPassword}
                    onChange={(e) => setAccountData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="请再次输入新密码"
                    className="hover:border-primary/50 transition-smooth"
                  />
                </div>
                <Button 
                  onClick={handleUpdatePassword}
                  className="hover:scale-105 transition-smooth"
                >
                  更新密码
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    通知设置
                  </h3>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleSaveNotifications}
                  >
                    保存通知设置
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <Label>邮件通知</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">接收系统重要邮件通知</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-muted-foreground" />
                        <Label>推送通知</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">接收浏览器推送通知</p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-muted-foreground" />
                        <Label>维护提醒</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">系统维护时间提醒</p>
                    </div>
                    <Switch
                      checked={notificationSettings.maintenanceAlerts}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, maintenanceAlerts: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-muted-foreground" />
                        <Label>系统更新</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">新版本和功能更新通知</p>
                    </div>
                    <Switch
                      checked={notificationSettings.systemUpdates}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, systemUpdates: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4 text-muted-foreground" />
                        <Label>数据导出提醒</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">数据导出完成后通知</p>
                    </div>
                    <Switch
                      checked={notificationSettings.dataExportAlerts}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, dataExportAlerts: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-muted-foreground" />
                        <Label>安全警报</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">异常登录和安全事件提醒</p>
                    </div>
                    <Switch
                      checked={notificationSettings.securityAlerts}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, securityAlerts: checked }))
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="mt-6">
          <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-elegant transition-smooth">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                  <Shield className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle>企业账号权限管理</CardTitle>
                  <p className="text-muted-foreground text-sm">管理企业用户账号和权限分配</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">用户管理</h3>
                  <p className="text-sm text-muted-foreground">共 {users.length} 个用户</p>
                </div>
                <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 hover:scale-105 transition-smooth">
                      <User className="w-4 h-4" />
                      添加用户
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>添加新用户</DialogTitle>
                      <DialogDescription>填写用户信息以创建新账号</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-user-name">姓名</Label>
                        <Input
                          id="new-user-name"
                          value={newUser.name}
                          onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="请输入姓名"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-user-email">邮箱</Label>
                        <Input
                          id="new-user-email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="user@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-user-role">角色</Label>
                        <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="管理员">管理员</SelectItem>
                            <SelectItem value="操作员">操作员</SelectItem>
                            <SelectItem value="观察者">观察者</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                        取消
                      </Button>
                      <Button onClick={handleAddUser}>
                        添加用户
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-smooth">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">上次登录: {user.lastLogin}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <Badge variant={user.role === "管理员" ? "default" : "secondary"}>
                          {user.role}
                        </Badge>
                        <p className="text-xs mt-1">
                          <Badge variant={user.status === "活跃" ? "default" : "outline"} className="text-xs">
                            {user.status}
                          </Badge>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleToggleUserStatus(user.id)}
                          className="hover:scale-105 transition-smooth"
                        >
                          {user.status === "活跃" ? "禁用" : "启用"}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditUser(user)}
                          className="hover:scale-105 transition-smooth"
                        >
                          编辑
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setDeleteUserId(user.id)}
                          className="hover:scale-105 transition-smooth text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>编辑用户</DialogTitle>
                    <DialogDescription>修改用户信息</DialogDescription>
                  </DialogHeader>
                  {editingUser && (
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-user-name">姓名</Label>
                        <Input
                          id="edit-user-name"
                          value={editingUser.name}
                          onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-user-email">邮箱</Label>
                        <Input
                          id="edit-user-email"
                          type="email"
                          value={editingUser.email}
                          onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-user-role">角色</Label>
                        <Select value={editingUser.role} onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="管理员">管理员</SelectItem>
                            <SelectItem value="操作员">操作员</SelectItem>
                            <SelectItem value="观察者">观察者</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
                      取消
                    </Button>
                    <Button onClick={handleSaveEditUser}>
                      保存更改
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <AlertDialog open={!!deleteUserId} onOpenChange={(open) => !open && setDeleteUserId(null)}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>确认删除用户？</AlertDialogTitle>
                    <AlertDialogDescription>
                      此操作无法撤销。该用户的所有数据和权限将被永久删除。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteUserId && handleDeleteUser(deleteUserId)}>
                      确认删除
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="mt-6">
          <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-elegant transition-smooth">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                  <Monitor className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle>系统设置</CardTitle>
                  <p className="text-muted-foreground text-sm">配置系统全局设置和偏好</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>系统语言</Label>
                  <Select value={systemSettings.language} onValueChange={(value) => 
                    setSystemSettings(prev => ({ ...prev, language: value }))
                  }>
                    <SelectTrigger className="hover:border-primary/50 transition-smooth">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zh-CN">中文（简体）</SelectItem>
                      <SelectItem value="zh-TW">中文（繁體）</SelectItem>
                      <SelectItem value="en-US">English</SelectItem>
                      <SelectItem value="ja-JP">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>时区设置</Label>
                  <Select value={systemSettings.timezone} onValueChange={(value) => 
                    setSystemSettings(prev => ({ ...prev, timezone: value }))
                  }>
                    <SelectTrigger className="hover:border-primary/50 transition-smooth">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Shanghai">上海 (UTC+8)</SelectItem>
                      <SelectItem value="Asia/Tokyo">东京 (UTC+9)</SelectItem>
                      <SelectItem value="America/New_York">纽约 (UTC-5)</SelectItem>
                      <SelectItem value="Europe/London">伦敦 (UTC+0)</SelectItem>
                      <SelectItem value="Asia/Dubai">迪拜 (UTC+4)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>主题设置</Label>
                  <Select value={systemSettings.theme} onValueChange={(value) => 
                    setSystemSettings(prev => ({ ...prev, theme: value }))
                  }>
                    <SelectTrigger className="hover:border-primary/50 transition-smooth">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">深色主题</SelectItem>
                      <SelectItem value="light">浅色主题</SelectItem>
                      <SelectItem value="auto">跟随系统</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>自动保存间隔（分钟）</Label>
                  <Select value={systemSettings.autoSaveInterval} onValueChange={(value) => 
                    setSystemSettings(prev => ({ ...prev, autoSaveInterval: value }))
                  }>
                    <SelectTrigger className="hover:border-primary/50 transition-smooth">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 分钟</SelectItem>
                      <SelectItem value="5">5 分钟</SelectItem>
                      <SelectItem value="10">10 分钟</SelectItem>
                      <SelectItem value="30">30 分钟</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>会话超时（分钟）</Label>
                  <Input
                    type="number"
                    value={systemSettings.sessionTimeout}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                    className="hover:border-primary/50 transition-smooth"
                  />
                </div>
                <div className="space-y-2">
                  <Label>数据保留期限（天）</Label>
                  <Input
                    type="number"
                    value={systemSettings.dataRetention}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, dataRetention: e.target.value }))}
                    className="hover:border-primary/50 transition-smooth"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">高级功能</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>自动保存</Label>
                      <p className="text-sm text-muted-foreground">自动保存工作内容</p>
                    </div>
                    <Switch
                      checked={systemSettings.autoSave}
                      onCheckedChange={(checked) => 
                        setSystemSettings(prev => ({ ...prev, autoSave: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>启用审计日志</Label>
                      <p className="text-sm text-muted-foreground">记录所有用户操作历史</p>
                    </div>
                    <Switch
                      checked={systemSettings.enableAuditLog}
                      onCheckedChange={(checked) => 
                        setSystemSettings(prev => ({ ...prev, enableAuditLog: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>性能监控</Label>
                      <p className="text-sm text-muted-foreground">监控系统性能指标</p>
                    </div>
                    <Switch
                      checked={systemSettings.enablePerformanceMonitor}
                      onCheckedChange={(checked) => 
                        setSystemSettings(prev => ({ ...prev, enablePerformanceMonitor: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex gap-3 flex-wrap">
                <Button 
                  onClick={handleSaveSystemSettings}
                  className="hover:scale-105 transition-smooth"
                >
                  保存系统设置
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleExportSettings}
                  className="hover:scale-105 transition-smooth gap-2"
                >
                  <Download className="w-4 h-4" />
                  导出配置
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleImportSettings}
                  className="hover:scale-105 transition-smooth gap-2"
                >
                  <Upload className="w-4 h-4" />
                  导入配置
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleResetSettings}
                  className="hover:scale-105 transition-smooth text-destructive hover:text-destructive"
                >
                  <RefreshCw className="w-4 h-4" />
                  重置为默认
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}