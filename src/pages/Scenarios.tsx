import { useState } from "react";
import { Target, Plus, RefreshCw, GitBranch, PlayCircle, Settings as SettingsIcon, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const scenarioConfigs = {
  "new-project": {
    title: "新项目工艺开发",
    description: "从零开始的全新工艺开发流程",
    status: "active",
    progress: 0,
    steps: ["需求分析", "参数设计", "仿真验证", "试验验证", "工艺优化", "文档输出"],
    features: ["智能参数推荐", "自动仿真分析", "实验设计", "报告生成"],
    estimatedTime: "5-7个工作日"
  },
  "import-project": {
    title: "导入项目工艺开发",
    description: "基于现有数据的工艺优化开发",
    status: "active",
    progress: 60,
    steps: ["数据导入", "数据清洗", "参数分析", "优化建议", "验证测试", "结果输出"],
    features: ["数据智能解析", "参数对比分析", "优化算法", "增量验证"],
    estimatedTime: "3-5个工作日"
  },
  "design-change": {
    title: "设计变更评估",
    description: "评估设计变更对工艺的影响",
    status: "pending",
    progress: 0,
    steps: ["变更识别", "影响分析", "风险评估", "方案制定", "验证计划", "实施建议"],
    features: ["变更影响分析", "风险预测", "方案对比", "成本评估"],
    estimatedTime: "2-3个工作日"
  }
};

export default function Scenarios() {
  const [selectedScenario, setSelectedScenario] = useState("new-project");
  const [scenarios, setScenarios] = useState(scenarioConfigs);

  const startScenario = (scenarioId) => {
    setScenarios(prev => ({
      ...prev,
      [scenarioId]: {
        ...prev[scenarioId],
        status: "active",
        progress: prev[scenarioId].progress === 0 ? 10 : prev[scenarioId].progress
      }
    }));
  };

  const getScenarioIcon = (scenarioId) => {
    switch (scenarioId) {
      case "new-project": return Plus;
      case "import-project": return RefreshCw;
      case "design-change": return GitBranch;
      default: return Target;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-success/10 text-success border-success/20";
      case "pending": return "bg-warning/10 text-warning border-warning/20";
      case "completed": return "bg-primary/10 text-primary border-primary/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "active": return "进行中";
      case "pending": return "待开始";
      case "completed": return "已完成";
      default: return "未知";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
          <Target className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">核心场景</h1>
          <p className="text-muted-foreground">核心业务场景配置与管理</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 场景列表 */}
        <div className="lg:col-span-1 space-y-4">
          {Object.entries(scenarios).map(([scenarioId, scenario]) => {
            const Icon = getScenarioIcon(scenarioId);
            return (
              <Card
                key={scenarioId}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 h-auto min-h-[140px] ${
                  selectedScenario === scenarioId
                    ? "bg-primary/10 border-primary/20 shadow-glow"
                    : "bg-gradient-card border-border/50 shadow-card hover:shadow-elegant"
                }`}
                onClick={() => setSelectedScenario(scenarioId)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                      <Icon className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{scenario.title}</h3>
                    </div>
                    <Badge variant="outline" className={`text-xs ${getStatusColor(scenario.status)}`}>
                      {getStatusLabel(scenario.status)}
                    </Badge>
                  </div>
                  
                  {scenario.progress > 0 && (
                    <div className="space-y-1 mb-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">进度</span>
                        <span>{scenario.progress}%</span>
                      </div>
                      <Progress value={scenario.progress} className="h-2" />
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground line-clamp-3 h-18">
                    {scenario.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 场景详情 */}
        <div className="lg:col-span-3">
          {selectedScenario && (
            <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-elegant transition-smooth">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                      {(() => {
                        const Icon = getScenarioIcon(selectedScenario);
                        return <Icon className="w-6 h-6 text-primary-foreground" />;
                      })()}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{scenarios[selectedScenario].title}</CardTitle>
                      <p className="text-muted-foreground">{scenarios[selectedScenario].description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">预计耗时</p>
                      <p className="font-medium">{scenarios[selectedScenario].estimatedTime}</p>
                    </div>
                    <Button
                      onClick={() => startScenario(selectedScenario)}
                      className="gap-2 hover:scale-105 transition-smooth"
                      disabled={scenarios[selectedScenario].status === "active"}
                    >
                      <PlayCircle className="w-4 h-4" />
                      {scenarios[selectedScenario].status === "active" ? "进行中" : "开始场景"}
                    </Button>
                  </div>
                </div>

                {scenarios[selectedScenario].progress > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>整体进度</span>
                      <span>{scenarios[selectedScenario].progress}%</span>
                    </div>
                    <Progress value={scenarios[selectedScenario].progress} className="h-3" />
                  </div>
                )}
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="steps" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="steps" className="gap-2">
                      <CheckCircle className="w-4 h-4" />
                      流程步骤
                    </TabsTrigger>
                    <TabsTrigger value="features" className="gap-2">
                      <SettingsIcon className="w-4 h-4" />
                      功能特性
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="steps" className="mt-6">
                    <div className="space-y-3">
                      {scenarios[selectedScenario].steps.map((step, index) => {
                        const isCompleted = (scenarios[selectedScenario].progress / 100) * scenarios[selectedScenario].steps.length > index;
                        const isCurrent = Math.floor((scenarios[selectedScenario].progress / 100) * scenarios[selectedScenario].steps.length) === index;
                        
                        return (
                          <div key={index} className={`flex items-center gap-4 p-4 rounded-lg border transition-smooth ${
                            isCompleted ? "bg-success/10 border-success/20" :
                            isCurrent ? "bg-primary/10 border-primary/20" :
                            "bg-muted/30 border-border/50"
                          }`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                              isCompleted ? "bg-success text-success-foreground" :
                              isCurrent ? "bg-primary text-primary-foreground" :
                              "bg-muted text-muted-foreground"
                            }`}>
                              {index + 1}
                            </div>
                            <span className={`font-medium ${
                              isCompleted ? "text-success" :
                              isCurrent ? "text-primary" :
                              "text-muted-foreground"
                            }`}>
                              {step}
                            </span>
                            {isCompleted && (
                              <CheckCircle className="w-4 h-4 text-success ml-auto" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>

                  <TabsContent value="features" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {scenarios[selectedScenario].features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-sm">{feature}</span>
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