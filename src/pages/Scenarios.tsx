import { useState } from "react";
import { Target, Plus, RefreshCw, GitBranch, PlayCircle, CheckCircle, CheckSquare, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// 项目列表数据
const projectList = [
  { value: "qinling", label: "Qinling" },
  { value: "pisces", label: "Pisces" },
  { value: "dom-g16", label: "Dom G1.6" }
];

// 数据输入项配置
const dataInputItems = [
  { key: "material1", label: "材料1" },
  { key: "material2", label: "材料2" },
  { key: "material3", label: "材料3" },
  { key: "thickness1", label: "厚度1 (mm)" },
  { key: "thickness2", label: "厚度2 (mm)" },
  { key: "thickness3", label: "厚度3 (mm)" }
];

const scenarioConfigs = {
  "new-project": {
    title: "新项目工艺开发",
    description: "从零开始的全新工艺开发流程",
    status: "completed",
    progress: 100,
    steps: [
      "数据导入",
      "历史记录查询",
      "钉模自动推荐",
      "工艺过程仿真",
      "连接质量预测",
      "结论分析生成",
      "结果报告生成"
    ],
    results: [
      "数据导入完成：新项目原始数据已成功导入系统。",
      "历史记录查询完成：相关历史工艺及案例数据已查阅。",
      "钉模自动推荐完成：根据材料和厚度条件生成推荐方案。",
      "工艺过程仿真完成：仿真模型运行完成并生成过程数据。",
      "连接质量预测完成：预测结果与可能风险点已标注。",
      "结论分析生成完成：自动生成分析结论及优化建议。",
      "结果报告生成完成：完整结果报告可下载和分享。"
    ]
  },
  "import-project": {
    title: "导入项目工艺开发",
    description: "基于现有数据的工艺优化开发",
    status: "active",
    progress: 60,
    steps: ["数据导入", "数据清洗", "参数分析", "优化建议", "验证测试", "结果输出"],
    results: [
      "数据导入完成：历史项目数据成功导入。",
      "数据清洗完成：异常数据已标记和处理。",
      "参数分析完成：分析结果生成参数对比表。",
      "优化建议生成：提供参数优化方案。",
      "验证测试完成：部分验证测试结果已确认。",
      "结果输出生成：结果报告待完成。"
    ]
  },
  "import-project-evaluation": {
    title: "导入项目分点评估",
    description: "对导入的项目数据进行多维度分点检查，确保工艺可行性",
    status: "pending",
    progress: 0,
    steps: ["数据完整性检查", "参数合理性评估", "工艺兼容性分析", "风险点识别", "评估报告输出"],
    results: [
      "数据完整性检查结果待生成。",
      "参数合理性评估结果待生成。",
      "工艺兼容性分析结果待生成。",
      "风险点识别结果待生成。",
      "评估报告输出结果待生成。"
    ]
  },
  "design-change": {
    title: "设计变更评估",
    description: "评估设计变更对工艺的影响",
    status: "pending",
    progress: 0,
    steps: ["变更识别", "影响分析", "风险评估", "方案制定", "验证计划", "实施建议"],
    results: [
      "变更点识别结果待生成。",
      "影响分析结果待生成。",
      "风险等级评估结果待生成。",
      "方案制定结果待生成。",
      "验证计划结果待生成。",
      "实施建议结果待生成。"
    ]
  }
};

export default function Scenarios() {
  const [selectedScenario, setSelectedScenario] = useState("new-project");
  const [scenarios, setScenarios] = useState(scenarioConfigs);
  // 新增：选中项目状态
  const [selectedProject, setSelectedProject] = useState("");
  // 新增：数据输入表单状态
  const [dataInputForm, setDataInputForm] = useState({
    material1: "",
    material2: "",
    material3: "",
    thickness1: "",
    thickness2: "",
    thickness3: ""
  });

  // 开始场景逻辑
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

  // 获取场景图标
  const getScenarioIcon = (scenarioId) => {
    switch (scenarioId) {
      case "new-project": return Plus;
      case "import-project": return RefreshCw;
      case "import-project-evaluation": return CheckSquare;
      case "design-change": return GitBranch;
      default: return Target;
    }
  };

  // 获取状态颜色
  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-success/10 text-success border-success/20";
      case "pending": return "bg-warning/10 text-warning border-warning/20";
      case "completed": return "bg-primary/10 text-primary border-primary/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  // 获取状态标签
  const getStatusLabel = (status) => {
    switch (status) {
      case "active": return "进行中";
      case "pending": return "待开始";
      case "completed": return "已完成";
      default: return "未知";
    }
  };

  // 处理数据输入表单变更
  const handleDataInputChange = (key, value) => {
    setDataInputForm(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 重置数据输入表单
  const resetDataInputForm = () => {
    setDataInputForm({
      material1: "",
      material2: "",
      material3: "",
      thickness1: "",
      thickness2: "",
      thickness3: ""
    });
  };

  return (
    <div className="space-y-6">
      {/* 页面标题区 */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
          <Target className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">核心场景</h1>
          <p className="text-muted-foreground">核心业务场景配置与管理</p>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* 左侧场景列表 */}
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

        {/* 右侧场景详情 */}
        <div className="lg:col-span-4">
          {selectedScenario && (
            <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-elegant transition-smooth">
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* 场景标题与描述 */}
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
                  
                  {/* 操作按钮组：替换原"预计耗时"，新增选择项目、数据输入、开始场景按钮 */}
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                    {/* 1. 选择项目弹窗 */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="gap-2 hover:scale-105 transition-smooth">
                          <FileText className="w-4 h-4" />
                          选择项目
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>选择项目</DialogTitle>
                          <p className="text-muted-foreground text-sm">请从以下项目中选择一个关联场景</p>
                        </DialogHeader>
                        <div className="space-y-4 mt-2">
                          <RadioGroup 
                            value={selectedProject} 
                            onValueChange={setSelectedProject}
                            className="space-y-3"
                          >
                            {projectList.map(project => (
                              <div key={project.value} className="flex items-center gap-2">
                                <RadioGroupItem 
                                  value={project.value} 
                                  id={`project-${project.value}`} 
                                />
                                <Label htmlFor={`project-${project.value}`} className="cursor-pointer">
                                  {project.label}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                          <DialogFooter>
                            <Button 
                              variant="outline" 
                              onClick={() => setSelectedProject("")}
                            >
                              重置选择
                            </Button>
                            <Button>确认选择</Button>
                          </DialogFooter>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* 2. 数据输入弹窗 */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="gap-2 hover:scale-105 transition-smooth">
                          <Input className="w-4 h-4 p-0" />
                          数据输入
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                          <DialogTitle>场景数据输入</DialogTitle>
                          <p className="text-muted-foreground text-sm">请填写以下必要参数信息</p>
                        </DialogHeader>
                        <div className="space-y-4 mt-2">
                          {/* 数据输入表单：2列布局 */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {dataInputItems.map(item => (
                              <div key={item.key} className="space-y-2">
                                <Label htmlFor={`input-${item.key}`}>
                                  {item.label}
                                </Label>
                                <Input
                                  id={`input-${item.key}`}
                                  value={dataInputForm[item.key]}
                                  onChange={(e) => handleDataInputChange(item.key, e.target.value)}
                                  placeholder={`请输入${item.label}`}
                                  type={item.key.includes("thickness") ? "number" : "text"}
                                  step={item.key.includes("thickness") ? "0.1" : undefined}
                                  min={item.key.includes("thickness") ? "0" : undefined}
                                />
                              </div>
                            ))}
                          </div>
                          <DialogFooter>
                            <Button 
                              variant="outline" 
                              onClick={resetDataInputForm}
                            >
                              重置表单
                            </Button>
                            <Button>提交数据</Button>
                          </DialogFooter>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* 3. 开始场景按钮 */}
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

                {/* 进度条 */}
                {scenarios[selectedScenario].progress > 0 && (
                  <div className="mt-4 w-full">
                    <div className="flex justify-between text-sm mb-2">
                      <span>整体进度</span>
                      <span>{scenarios[selectedScenario].progress}%</span>
                    </div>
                    <Progress value={scenarios[selectedScenario].progress} className="h-3" />
                  </div>
                )}
              </CardHeader>

              <CardContent>
                {/* 步骤与结果标签页 */}
                <Tabs defaultValue="steps" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="steps" className="gap-2">
                      <CheckCircle className="w-4 h-4" />
                      流程步骤
                    </TabsTrigger>
                    <TabsTrigger value="results" className="gap-2">
                      <FileText className="w-4 h-4" />
                      查看结果
                    </TabsTrigger>
                  </TabsList>

                  {/* 流程步骤标签页内容 */}
                  <TabsContent value="steps" className="mt-6">
                    <div className="space-y-3">
                      {scenarios[selectedScenario].steps.map((step, index) => {
                        const totalSteps = scenarios[selectedScenario].steps.length;
                        const isCompleted = (scenarios[selectedScenario].progress / 100) * totalSteps > index;
                        const isCurrent = Math.floor((scenarios[selectedScenario].progress / 100) * totalSteps) === index;
                        
                        return (
                          <div 
                            key={index} 
                            className={`flex items-center gap-4 p-4 rounded-lg border transition-smooth ${
                              isCompleted ? "bg-success/10 border-success/20" :
                              isCurrent ? "bg-primary/10 border-primary/20" :
                              "bg-muted/30 border-border/50"
                            }`}
                          >
                            <div 
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                isCompleted ? "bg-success text-success-foreground" :
                                isCurrent ? "bg-primary text-primary-foreground" :
                                "bg-muted text-muted-foreground"
                              }`}
                            >
                              {index + 1}
                            </div>
                            <span 
                              className={`font-medium ${
                                isCompleted ? "text-success" :
                                isCurrent ? "text-primary" :
                                "text-muted-foreground"
                              }`}
                            >
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

                  {/* 查看结果标签页内容 */}
                  <TabsContent value="results" className="mt-6">
                    <div className="space-y-4">
                      {scenarios[selectedScenario].steps.map((step, index) => {
                        const totalSteps = scenarios[selectedScenario].steps.length;
                        const isCompleted = (scenarios[selectedScenario].progress / 100) * totalSteps > index;
                        const resultContent = isCompleted 
                          ? scenarios[selectedScenario].results[index] 
                          : "运行完成后可查看该步骤结果";

                        return (
                          <div key={index} className="p-4 border rounded-lg bg-muted/10 transition-smooth">
                            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                              <div 
                                className={`w-3 h-3 rounded-full ${
                                  isCompleted ? "bg-primary" : "bg-gray-300"
                                }`}
                              ></div>
                              {step}
                            </h4>
                            <div 
                              className={`text-sm ${
                                isCompleted ? "text-foreground" : "text-muted-foreground italic"
                              }`}
                            >
                              {typeof resultContent === "string" ? (
                                <p>{resultContent}</p>
                              ) : (
                                resultContent
                              )}
                            </div>
                          </div>
                        );
                      })}
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
