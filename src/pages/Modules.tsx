import { useState, useEffect } from "react";
import { Layers, Cpu, Database, BarChart3, Search, Play, Settings as SettingsIcon, FileText, ArrowRight, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiSelect, MultiSelectOption } from "@/components/ui/multi-select";

const moduleConfigs: Record<string, any> = {
  "database-query": {
    title: "数据库记录查询",
    description: "快速查询和检索历史工艺数据记录，支持多维度筛选",
    status: "enabled",
    dataInputs: [
      "材料1",
      "材料2",
      "材料3",
      "厚度1",
      "厚度2",
      "厚度3",
      "铆钉型号",
      "铆模型号"
    ],
    settings: {
      exactMatch: false
    },
    exampleResult: {
      title: "查询结果",
      content: [
        "匹配记录数：1,247条",
        "时间范围：2023-05-10至2023-06-15",
        "数据完整性：98.7%",
        "导出状态：准备就绪"
      ]
    }
  },
  "nail-recommend": {
    title: "钉模推荐",
    description: "基于工艺参数智能推荐最适合的钉模配置，输入关键参数即可获取优化方案",
    status: "enabled",
    dataInputs: [
      "材料1",
      "材料2",
      "材料3",
      "厚度1",
      "厚度2",
      "厚度3"
    ],
    settings: {
      modelVersion: "v3.0",
      disabledRivetModels: ["C5.3x4.0H2"],
      disabledDieModels: ["T141"]
    },
    exampleResult: {
      title: "推荐铆钉&铆模型号结果",
      content: [
        "推荐铆钉型号：RM-2023-001（匹配度98.2%）",
        "推荐铆模型号：DM-2023-045（匹配度97.8%）",
        "备选铆钉型号：RM-2023-007（匹配度95.6%）",
        "备选铆模型号：DM-2023-051（匹配度94.3%）",
        "已过滤禁用型号：C5.3x4.0H2（铆钉）、T141（铆模）"
      ]
    }
  },
  "quality-predict": {
    title: "连接质量预测",
    description: "预测焊接连接质量，提前发现潜在问题，降低不良品率",
    status: "enabled",
    dataInputs: [
      "材料1",
      "材料2",
      "材料3",
      "厚度1",
      "厚度2",
      "厚度3",
      "铆钉",
      "铆模",
      "头高"
    ],
    settings: {
      modelVersion: "v2.1", // 默认模型版本
      rivetForceThreshold: 75, 
      outputConfidenceInterval: true // 默认输出95%置信区间
    },
    exampleResult: {
      title: "连接质量预测结果",
      content: [
        "预测互锁值：0.53 95%CI：[0.24, 0.69]",
        "预测底厚值：0.46 95%CI：[0.21, 0.54]",
        "预测铆接力：57.8 95%CI：[49.7, 64.2]",
        "模型类型：Global"
      ]
    }
  },
  "process-simulation": {
    title: "工艺过程仿真",
    description: "模拟整个工艺流程，优化工艺参数，减少试错成本",
    status: "enabled",
    dataInputs: [
      "材料1",
      "材料2",
      "材料3",
      "厚度1",
      "厚度2",
      "厚度3",
      "铆钉",
      "铆模",
      "头高"
    ],
    settings: {
      simulationSoftwareUrl: "http://simulation-server:8080/api/v1/simulate", // 仿真软件地址
      parallelTaskCount: 4, // 并行任务数
      simulationAccuracy: "medium" // 仿真精度（low/medium/high）
    },
    exampleResult: {
      title: "仿真结果",
      content: [
        "预计生产效率：89.2%",
        "瓶颈节点：热处理工序",
        "优化后产能提升：15.3%",
        "能耗降低建议：12.7%"
      ]
    }
  }
};

export default function Modules() {
  const [selectedModule, setSelectedModule] = useState("database-query");
  const [modules, setModules] = useState(moduleConfigs);
  const [formData, setFormData] = useState<Record<string, string | string[]>>({});
  const [showResults, setShowResults] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // 模拟数据选项 - 实际应用中从后端获取
  const materialOptions: MultiSelectOption[] = [
    { label: "LAC340Y410T", value: "LAC340Y410T" },
    { label: "6000-BR", value: "6000-BR" },
    { label: "DPC420Y780T", value: "DPC420Y780T" },
    { label: "DC-N2 F", value: "DC-N2 F" },
  ];

  const gaugeOptions: MultiSelectOption[] = [
    { label: "1.2mm", value: "1.2" },
    { label: "1.5mm", value: "1.5" },
    { label: "1.8mm", value: "1.8" },
    { label: "2.0mm", value: "2.0" },
    { label: "3.0mm", value: "3.0" },
  ];

  const rivetOptions: MultiSelectOption[] = [
    { label: "C5.3x5.0H2", value: "C5.3x5.0H2" },
    { label: "C5.3x6.0H2", value: "C5.3x6.0H2" },
    { label: "C5.3x7.0H4", value: "C5.3x7.0H4" },
    { label: "HSS5.5x6.0H5", value: "HSS5.5x6.0H5" },
  ];

  const dieOptions: MultiSelectOption[] = [
    { label: "M260238", value: "M260238" },
    { label: "M260468", value: "M260468" },
    { label: "M260406", value: "M260406" },
    { label: "M260412", value: "M260412" },
  ];

  // 根据输入键获取对应的选项
  const getOptionsForInput = (inputKey: string): MultiSelectOption[] => {
    if (inputKey.includes("材料")) return materialOptions;
    if (inputKey.includes("厚度")) return gaugeOptions;
    if (inputKey === "铆钉型号") return rivetOptions;
    if (inputKey === "铆模型号") return dieOptions;
    return [];
  };

  // 初始化表单数据
  useEffect(() => {
    const initialData: Record<string, string | string[]> = {};
    modules[selectedModule].dataInputs.forEach((inputKey: string) => {
      // 数据库查询模块使用数组，其他模块使用字符串
      initialData[inputKey] = selectedModule === "database-query" ? [] : "";
    });
    setFormData(initialData);
    setShowResults(false);
  }, [selectedModule, modules]);

  // 处理输入参数变化
  const handleInputChange = (inputKey: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [inputKey]: value
    }));
  };
  
  // 切换精确查询
  const toggleExactMatch = () => {
    setModules(prev => ({
      ...prev,
      "database-query": {
        ...prev["database-query"],
        settings: {
          ...prev["database-query"].settings,
          exactMatch: !prev["database-query"].settings.exactMatch
        }
      }
    }));
  };

  // 切换模块启用/禁用状态
  const toggleModule = (moduleId) => {
    setModules(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        status: prev[moduleId].status === "enabled" ? "disabled" : "enabled"
      }
    }));
  };

  // 钉模推荐 - 更新模型版本
  const handleNailModelVersionChange = (value) => {
    setModules(prev => ({
      ...prev,
      "nail-recommend": {
        ...prev["nail-recommend"],
        settings: {
          ...prev["nail-recommend"].settings,
          modelVersion: value
        }
      }
    }));
  };

  // 钉模推荐 - 更新禁用铆钉型号
  const handleDisabledRivetChange = (value) => {
    const formattedModels = value.split(',').map(item => item.trim()).filter(Boolean);
    setModules(prev => ({
      ...prev,
      "nail-recommend": {
        ...prev["nail-recommend"],
        settings: {
          ...prev["nail-recommend"].settings,
          disabledRivetModels: formattedModels
        }
      }
    }));
  };

  // 钉模推荐 - 更新禁用铆模型号
  const handleDisabledDieChange = (value) => {
    const formattedModels = value.split(',').map(item => item.trim()).filter(Boolean);
    setModules(prev => ({
      ...prev,
      "nail-recommend": {
        ...prev["nail-recommend"],
        settings: {
          ...prev["nail-recommend"].settings,
          disabledDieModels: formattedModels
        }
      }
    }));
  };

  // 连接质量预测 - 更新模型版本
  const handleQualityModelVersionChange = (value) => {
    setModules(prev => ({
      ...prev,
      "quality-predict": {
        ...prev["quality-predict"],
        settings: {
          ...prev["quality-predict"].settings,
          modelVersion: value
        }
      }
    }));
  };

  // 连接质量预测 - 更新铆接力上限阈值
  const handleRivetForceThresholdChange = (value) => {
    // 确保输入是数字
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue)) {
      setModules(prev => ({
        ...prev,
        "quality-predict": {
          ...prev["quality-predict"],
          settings: {
            ...prev["quality-predict"].settings,
            rivetForceThreshold: numericValue
          }
        }
      }));
    }
  };

  // 连接质量预测 - 切换是否输出置信区间
  const toggleConfidenceInterval = () => {
    setModules(prev => ({
      ...prev,
      "quality-predict": {
        ...prev["quality-predict"],
        settings: {
          ...prev["quality-predict"].settings,
          outputConfidenceInterval: !prev["quality-predict"].settings.outputConfidenceInterval
        }
      }
    }));
  };
  // 新增仿真设置变更处理函数
  const handleSimulationSettingChange = (key: string, value: string | number) => {
    // 并行任务数需转为数字类型
    const processedValue = key === "parallelTaskCount" ? Number(value) : value;
    setModules(prev => ({
      ...prev,
      "process-simulation": {
        ...prev["process-simulation"],
        settings: {
          ...prev["process-simulation"].settings,
          [key]: processedValue
        }
      }
    }));
  };

  // 获取模块对应的图标
  const getModuleIcon = (moduleId) => {
    switch (moduleId) {
      case "nail-recommend": return Cpu;
      case "quality-predict": return BarChart3;
      case "process-simulation": return Play;
      case "database-query": return Search;
      default: return Layers;
    }
  };

  // 运行模块处理
  const handleRun = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    setTimeout(() => {
      console.log(`运行${modules[selectedModule].title}，输入数据:`, formData);
      setIsProcessing(false);
      setShowResults(true);
    }, 1500);
  };

  // 重置输入参数和结果
  const handleReset = () => {
    const initialData = {};
    modules[selectedModule].dataInputs.forEach(inputKey => {
      initialData[inputKey] = "";
    });
    setFormData(initialData);
    setShowResults(false);
  };

  return (
    <div className="space-y-6 p-4">
    {/* 新增：嵌入式CSS样式 - 仅作用于当前页面 */}
    <style>{`
      /* 隐藏数字输入框的上下调整按钮 */
      .no-spin-input::-webkit-outer-spin-button,
      .no-spin-input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      .no-spin-input {
        -moz-appearance: textfield;
      }
    `}</style>
      {/* 页面标题区 */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
          <Layers className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">功能模块</h1>
          <p className="text-muted-foreground">系统功能模块管理与数据处理</p>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* 左侧模块列表 */}
        <div className="lg:col-span-1 space-y-4">
          {Object.entries(modules).map(([moduleId, module]) => {
            const Icon = getModuleIcon(moduleId);
            return (
              <Card
                key={moduleId}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 h-auto min-h-[140px] ${
                  selectedModule === moduleId
                    ? "bg-primary/10 border-primary/20 shadow-glow"
                    : "bg-gradient-card border-border/50 shadow-card hover:shadow-elegant"
                }`}
                onClick={() => setSelectedModule(moduleId)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                      <Icon className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{module.title}</h3>
                    </div>
                    <Badge variant={module.status === "enabled" ? "default" : "secondary"} className="text-xs">
                      {module.status === "enabled" ? "已启用" : "未启用"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-3 h-18">
                    {module.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 右侧详情区 */}
        <div className="lg:col-span-4">
          {selectedModule && (
            <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-elegant transition-smooth h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  {/* 标题 + 模型版本显示 */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                      {(() => {
                        const Icon = getModuleIcon(selectedModule);
                        return <Icon className="w-6 h-6 text-primary-foreground" />;
                      })()}
                    </div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">{modules[selectedModule].title}</CardTitle>
                      {/* 模型版本显示 - 钉模推荐和连接质量预测模块 */}
                      {(selectedModule === "nail-recommend" || selectedModule === "quality-predict") && (
                        <Badge variant="outline" className="text-sm">
                          {modules[selectedModule].settings.modelVersion}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* 右上角按钮组 */}
                  <div className="flex gap-2">
                    {/* 模块设置弹窗 */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1">
                          <SettingsIcon className="w-4 h-4" />
                          设置
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>{modules[selectedModule].title} - 模块设置</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 mt-4">
                          {/* 钉模推荐专属设置 */}
                          {selectedModule === "nail-recommend" ? (
                            <>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">推荐模型版本</Label>
                                <Select
                                  value={modules["nail-recommend"].settings.modelVersion}
                                  onValueChange={handleNailModelVersionChange}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="选择模型版本" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="v1.0">v1.0</SelectItem>
                                    <SelectItem value="v1.1">v1.1</SelectItem>
                                    <SelectItem value="v2.0">v2.0</SelectItem>
                                    <SelectItem value="v3.0">v3.0</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label className="text-sm font-medium">禁用铆钉型号</Label>
                                <Input
                                  placeholder="多个型号用逗号分隔（例：C5.3x4.0H2, RM-2023-005）"
                                  value={modules["nail-recommend"].settings.disabledRivetModels.join(", ")}
                                  onChange={(e) => handleDisabledRivetChange(e.target.value)}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label className="text-sm font-medium">禁用铆模型号</Label>
                                <Input
                                  placeholder="多个型号用逗号分隔（例：T141, DM-2023-045）"
                                  value={modules["nail-recommend"].settings.disabledDieModels.join(", ")}
                                  onChange={(e) => handleDisabledDieChange(e.target.value)}
                                />
                              </div>
                            </>
                          ) : selectedModule === "quality-predict" ? (
                            /* 连接质量预测专属设置 */
                            <>
                              {/* 预测模型版本 */}
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">预测模型版本</Label>
                                <Select
                                  value={modules["quality-predict"].settings.modelVersion}
                                  onValueChange={handleQualityModelVersionChange}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="选择模型版本" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="v1.0">v1.0</SelectItem>
                                    <SelectItem value="v2.0">v2.0</SelectItem>
                                    <SelectItem value="v2.1">v2.1</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* 铆接力上限阈值 */}
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">铆接力上限阈值</Label>
                                <div className="flex items-center gap-2 rivet-force-input">
                                  <Input
                                    type="number"
                                    className="no-spin-input"
                                    value={modules["quality-predict"].settings.rivetForceThreshold}
                                    onChange={(e) => {
                                      const newValue = Number(e.target.value);
                                      setModules(prev => ({
                                        ...prev,
                                        "quality-predict": {
                                          ...prev["quality-predict"],
                                          settings: {
                                            ...prev["quality-predict"].settings,
                                            rivetForceThreshold: newValue
                                          }
                                        }
                                      }));
                                    }}
                                  />
                                  <span className="text-sm whitespace-nowrap">kN</span>
                                </div>
                              </div>




                              {/* 是否输出95%置信区间 */}
                              <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <Label className="text-sm font-medium">是否输出95%置信区间</Label>
                                  <p className="text-xs text-muted-foreground">结果中将包含置信区间范围</p>
                                </div>
                                <Switch
                                  checked={modules["quality-predict"].settings.outputConfidenceInterval}
                                  onCheckedChange={toggleConfidenceInterval}
                                />
                              </div>
                            </>
                          ) : selectedModule === "database-query" ? (
                            // 数据库查询专属设置
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <Label className="text-sm font-medium">精确查询</Label>
                                  <p className="text-xs text-muted-foreground">启用后将进行精确匹配查询</p>
                                </div>
                                <Switch
                                  checked={modules["database-query"].settings.exactMatch}
                                  onCheckedChange={toggleExactMatch}
                                />
                              </div>
                            </div>
                          ) : selectedModule === "process-simulation" ? (
                            <>
                              {/* 仿真软件地址 */}
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">仿真软件地址</Label>
                                <Input
                                  placeholder="输入仿真软件API地址或服务器地址"
                                  value={modules["process-simulation"].settings.simulationSoftwareUrl}
                                  onChange={(e) => handleSimulationSettingChange("simulationSoftwareUrl", e.target.value)}
                                />
                              </div>

                              {/* 并行任务数 */}
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">并行任务数</Label>
                                <Input
                                  type="number"
                                  className="no-spin-input"
                                  min="1"
                                  max="16"
                                  placeholder="设置同时运行的仿真任务数（1-16）"
                                  value={modules["process-simulation"].settings.parallelTaskCount}
                                  onChange={(e) => handleSimulationSettingChange("parallelTaskCount", e.target.value)}
                                />
                              </div>

                              {/* 仿真精度 */}
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">仿真精度</Label>
                                <Select
                                  value={modules["process-simulation"].settings.simulationAccuracy}
                                  onValueChange={(value) => handleSimulationSettingChange("simulationAccuracy", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="选择仿真精度等级" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="low">低精度（快速计算，适用于初步验证）</SelectItem>
                                    <SelectItem value="medium">中精度（平衡速度与准确性，默认）</SelectItem>
                                    <SelectItem value="high">高精度（详细计算，适用于最终验证）</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </>
                          ) : (
                            // 其他模块默认设置
                            <div className="text-sm text-muted-foreground">暂无可配置项</div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* 启用/禁用按钮 */}
                    <Button
                      onClick={() => toggleModule(selectedModule)}
                      variant={modules[selectedModule].status === "enabled" ? "destructive" : "default"}
                      size="sm"
                      className="gap-1"
                    >
                      {modules[selectedModule].status === "enabled" ? "禁用" : "启用"}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-4">
                {/* 数据输入区域 */}
                <form onSubmit={handleRun} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {modules[selectedModule].dataInputs.map((inputKey, index) => (
                      <div key={index} className="space-y-2">
                        <Label htmlFor={`input-${index}`} className="text-sm font-medium">
                          {inputKey}
                        </Label>
                        {selectedModule === "database-query" ? (
                          <MultiSelect
                            options={getOptionsForInput(inputKey)}
                            selected={(formData[inputKey] as string[]) || []}
                            onChange={(selected) => handleInputChange(inputKey, selected)}
                            placeholder={`选择${inputKey}`}
                            disabled={modules[selectedModule].status === "disabled"}
                          />
                        ) : (
                          <Input
                            id={`input-${index}`}
                            value={(formData[inputKey] as string) || ""}
                            onChange={(e) => handleInputChange(inputKey, e.target.value)}
                            placeholder={`请输入${inputKey}`}
                            disabled={modules[selectedModule].status === "disabled"}
                            className="transition-all focus:ring-2 focus:ring-primary/50"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* 数据库查询模块的精确查询选项 */}
                  {selectedModule === "database-query" && (
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox
                        id="exact-match"
                        checked={modules["database-query"].settings.exactMatch}
                        onCheckedChange={toggleExactMatch}
                      />
                      <Label
                        htmlFor="exact-match"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        精确查询
                      </Label>
                    </div>
                  )}

                  {/* 操作按钮组 */}
                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      disabled={modules[selectedModule].status === "disabled" || isProcessing}
                      className="gap-1"
                    >
                      <RefreshCw className="w-4 h-4" />
                      重置
                    </Button>
                    <Button
                      type="submit"
                      disabled={modules[selectedModule].status === "disabled" || isProcessing}
                      className="gap-1 bg-primary hover:bg-primary/90"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          处理中...
                        </>
                      ) : (
                        <>
                          运行
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>

                {/* 运行结果显示区域 */}
                {showResults && (
                  <div className="mt-8 space-y-2">
                    <Separator />
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <span>运行结果</span>
                      <Badge variant="outline">已完成</Badge>
                    </h3>

                    <Card className="mt-3 border-primary/20">
                      <CardContent className="p-4">
                        <h4 className="font-medium text-primary mb-3">{modules[selectedModule].exampleResult.title}</h4>
                        <div className="space-y-3">
                          {modules[selectedModule].exampleResult.content.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                              <span>{item}</span>
                            </div>
                          ))}
                          <div className="mt-4 flex justify-end">
                            <Button variant="outline" size="sm">查看详细报告</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
