import { useState } from "react";
import { Settings as SettingsIcon, Database, User, Shield, Key, Bell, Monitor, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  const [databaseConfig, setDatabaseConfig] = useState({
    host: "localhost",
    port: "5432",
    database: "spr_system",
    username: "admin",
    password: "********"
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    maintenanceAlerts: true,
    systemUpdates: true
  });

  const [systemSettings, setSystemSettings] = useState({
    language: "zh-CN",
    timezone: "Asia/Shanghai",
    theme: "dark",
    autoSave: true
  });

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
                    className="hover:border-primary/50 transition-smooth"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db-port">端口</Label>
                  <Input
                    id="db-port"
                    value={databaseConfig.port}
                    onChange={(e) => setDatabaseConfig(prev => ({ ...prev, port: e.target.value }))}
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
              <div className="flex gap-3">
                <Button className="hover:scale-105 transition-smooth">测试连接</Button>
                <Button variant="outline" className="hover:scale-105 transition-smooth">保存配置</Button>
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
                <div className="space-y-2">
                  <Label htmlFor="current-password">当前密码</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="请输入当前密码"
                    className="hover:border-primary/50 transition-smooth"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">新密码</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="请输入新密码"
                    className="hover:border-primary/50 transition-smooth"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">确认新密码</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="请再次输入新密码"
                    className="hover:border-primary/50 transition-smooth"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">通知设置</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>邮件通知</Label>
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
                      <Label>推送通知</Label>
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
                      <Label>维护提醒</Label>
                      <p className="text-sm text-muted-foreground">系统维护时间提醒</p>
                    </div>
                    <Switch
                      checked={notificationSettings.maintenanceAlerts}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, maintenanceAlerts: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="hover:scale-105 transition-smooth">更新密码</Button>
                <Button variant="outline" className="hover:scale-105 transition-smooth">保存设置</Button>
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
                <h3 className="text-lg font-medium">用户管理</h3>
                <Button className="gap-2 hover:scale-105 transition-smooth">
                  <User className="w-4 h-4" />
                  添加用户
                </Button>
              </div>

              <div className="space-y-4">
                {[
                  { name: "张工程师", role: "管理员", status: "活跃", lastLogin: "2024-01-15 14:30" },
                  { name: "李工程师", role: "操作员", status: "活跃", lastLogin: "2024-01-15 13:45" },
                  { name: "王工程师", role: "观察者", status: "非活跃", lastLogin: "2024-01-10 09:20" },
                  { name: "陈工程师", role: "操作员", status: "活跃", lastLogin: "2024-01-15 12:15" }
                ].map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-smooth">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">上次登录: {user.lastLogin}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{user.role}</p>
                        <p className={`text-xs ${user.status === "活跃" ? "text-success" : "text-muted-foreground"}`}>
                          {user.status}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="hover:scale-105 transition-smooth">
                        编辑
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
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
                      <SelectItem value="en-US">English</SelectItem>
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
                      <SelectItem value="America/New_York">纽约 (UTC-5)</SelectItem>
                      <SelectItem value="Europe/London">伦敦 (UTC+0)</SelectItem>
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
              </div>

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
              </div>

              <Button className="hover:scale-105 transition-smooth">保存系统设置</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}