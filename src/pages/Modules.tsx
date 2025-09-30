import { useState } from "react";
import { Layers, Cpu, Database, BarChart3, Search, Play, Settings as SettingsIcon, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const moduleConfigs = {
  "nail-recommend": {
    title: "钉模推荐",
    description: "基于工艺参数智能推荐最适合的钉模配置",
    status: "enabled",
    features: ["智能算法推荐", "历史数据分析", "参数优化建议", "实时匹配度评估"],
    settings: ["推荐算法", "匹配阈值", "历史权重", "更新频率"]
  },
  "quality-predict": {
    title: "连接质量预测",
    description: "预测焊接连接质量，提前发现潜在问题",
    status: "enabled",
    features: ["质量预测模型", "缺陷识别", "预警系统", "质量评分"],
    settings: ["预测模型", "预警阈值", "检测间隔", "报告生成"]
  },
  "process-simulation": {
    title: "工艺过程仿真",
    description: "模拟整个工艺流程，优化工艺参数",
    status: "disabled",
    features: ["3D工艺仿真", "参数优化", "流程分析", "结果预测"],
    settings: ["仿真精度", "计算资源", "输出格式", "保存设置"]
  },
  "database-query": {
    title: "数据库记录查询",
    description: "快速查询和检索历史工艺数据记录",
    status: "enabled",
    features: ["高级搜索", "数据筛选", "历史记录", "导出功能"],
    settings: ["查询权限", "缓存策略", "索引优化", "访问日志"]
  }
};

export default function Modules() {
  const [selectedModule, setSelectedModule] = useState("nail-recommend");
  const [modules, setModules] = useState(moduleConfigs);

  const toggleModule = (moduleId) => {
    setModules(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        status: prev[moduleId].status === "enabled" ? "disabled" : "enabled"
      }
    }));
  };

  const getModuleIcon = (moduleId) => {
    switch (moduleId) {
      case "nail-recommend": return Cpu;
      case "quality-predict": return BarChart3;
      case "process-simulation": return Play;
      case "database-query": return Search;
      default: return Layers;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
          <Layers className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">功能模块</h1>
          <p className="text-muted-foreground">系统功能模块管理与配置</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 模块列表 */}
        <div className="lg:col-span-1 space-y-4">
          {Object.entries(modules).map(([moduleId, module]) => {
            const Icon = getModuleIcon(moduleId);
            return (
              <Card
                key={moduleId}
                className={`cursor-pointer transition-smooth hover:scale-105 ${
                  selectedModule === moduleId
                    ? "bg-primary/10 border-primary/20 shadow-glow"
                    : "bg-gradient-card border-border/50 shadow-card hover:shadow-elegant"
                }`}
                onClick={() => setSelectedModule(moduleId)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                      <Icon className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{module.title}</h3>
                    </div>
                    <Badge variant={module.status === "enabled" ? "default" : "secondary"} className="text-xs">
                      {module.status === "enabled" ? "已启用" : "未启用"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {module.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 模块详情 */}
        <div className="lg:col-span-3">
          {selectedModule && (
            <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-elegant transition-smooth">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                      {(() => {
                        const Icon = getModuleIcon(selectedModule);
                        return <Icon className="w-6 h-6 text-primary-foreground" />;
                      })()}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{modules[selectedModule].title}</CardTitle>
                      <p className="text-muted-foreground">{modules[selectedModule].description}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => toggleModule(selectedModule)}
                    variant={modules[selectedModule].status === "enabled" ? "destructive" : "default"}
                    className="gap-2 hover:scale-105 transition-smooth"
                  >
                    {modules[selectedModule].status === "enabled" ? "禁用模块" : "启用模块"}
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="features" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="features" className="gap-2">
                      <CheckCircle className="w-4 h-4" />
                      功能特性
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="gap-2">
                      <SettingsIcon className="w-4 h-4" />
                      模块设置
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="features" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {modules[selectedModule].features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
                          <div className="w-2 h-2 bg-success rounded-full"></div>
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="mt-6">
                    <div className="space-y-4">
                      {modules[selectedModule].settings.map((setting, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-smooth">
                          <span className="font-medium">{setting}</span>
                          <Button variant="outline" size="sm" className="hover:scale-105 transition-smooth">
                            配置
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}