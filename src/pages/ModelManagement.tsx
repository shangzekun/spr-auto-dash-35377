import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, Download, Play, Pause, Trash2, Settings, Plus, RefreshCw, Eye, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

interface Model {
  id: string;
  name: string;
  version: string;
  type: string;
  status: "active" | "inactive" | "deploying" | "failed";
  developer: string;
  uploadDate: Date;
  description: string;
  accuracy: number;
  performance: number;
  size: string;
  framework: string;
  lastUsed?: Date;
}

// 模拟数据
const mockModels: Model[] = [
  {
    id: "1",
    name: "SPR工艺预测模型",
    version: "v2.3.1",
    type: "预测模型",
    status: "active",
    developer: "张工",
    uploadDate: new Date(2025, 0, 15),
    description: "用于SPR工艺参数预测和优化的深度学习模型",
    accuracy: 95.8,
    performance: 88.5,
    size: "156 MB",
    framework: "TensorFlow",
    lastUsed: new Date(2025, 0, 20)
  },
  {
    id: "2",
    name: "质量检测模型",
    version: "v1.5.2",
    type: "检测模型",
    status: "active",
    developer: "李工",
    uploadDate: new Date(2025, 0, 10),
    description: "实时质量检测和异常识别模型",
    accuracy: 92.3,
    performance: 91.2,
    size: "89 MB",
    framework: "PyTorch",
    lastUsed: new Date(2025, 0, 19)
  },
  {
    id: "3",
    name: "参数优化模型",
    version: "v3.0.0",
    type: "优化模型",
    status: "deploying",
    developer: "王工",
    uploadDate: new Date(2025, 0, 18),
    description: "多目标参数优化模型，支持实时调优",
    accuracy: 0,
    performance: 0,
    size: "234 MB",
    framework: "TensorFlow",
  },
  {
    id: "4",
    name: "故障诊断模型",
    version: "v1.2.0",
    type: "诊断模型",
    status: "inactive",
    developer: "赵工",
    uploadDate: new Date(2024, 11, 20),
    description: "设备故障预测和诊断模型",
    accuracy: 89.5,
    performance: 85.7,
    size: "112 MB",
    framework: "PyTorch",
    lastUsed: new Date(2024, 11, 28)
  },
];

export default function ModelManagement() {
  const [models, setModels] = useState<Model[]>(mockModels);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // 上传表单状态
  const [uploadForm, setUploadForm] = useState({
    name: "",
    version: "",
    type: "预测模型",
    developer: "",
    description: "",
    framework: "TensorFlow",
  });

  const handleUploadModel = () => {
    setIsUploading(true);
    setUploadProgress(0);

    // 模拟上传进度
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setIsUploadDialogOpen(false);
          
          // 添加新模型
          const newModel: Model = {
            id: (models.length + 1).toString(),
            name: uploadForm.name,
            version: uploadForm.version,
            type: uploadForm.type,
            status: "deploying",
            developer: uploadForm.developer,
            uploadDate: new Date(),
            description: uploadForm.description,
            accuracy: 0,
            performance: 0,
            size: "0 MB",
            framework: uploadForm.framework,
          };
          
          setModels([newModel, ...models]);
          
          toast({
            title: "上传成功",
            description: `模型 ${uploadForm.name} 正在部署中...`,
          });

          // 重置表单
          setUploadForm({
            name: "",
            version: "",
            type: "预测模型",
            developer: "",
            description: "",
            framework: "TensorFlow",
          });
          
          return 0;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleToggleModelStatus = (modelId: string) => {
    setModels(models.map(model => {
      if (model.id === modelId) {
        const newStatus = model.status === "active" ? "inactive" : "active";
        toast({
          title: newStatus === "active" ? "模型已激活" : "模型已停用",
          description: `${model.name} ${model.version}`,
        });
        return { ...model, status: newStatus };
      }
      return model;
    }));
  };

  const handleDeleteModel = () => {
    if (selectedModel) {
      setModels(models.filter(m => m.id !== selectedModel.id));
      toast({
        title: "删除成功",
        description: `已删除模型 ${selectedModel.name}`,
      });
      setIsDeleteDialogOpen(false);
      setSelectedModel(null);
    }
  };

  const handleDownloadModel = (model: Model) => {
    toast({
      title: "开始下载",
      description: `正在下载 ${model.name} ${model.version}`,
    });
  };

  const handleViewDetail = (model: Model) => {
    setSelectedModel(model);
    setIsDetailDialogOpen(true);
  };

  const handleOpenConfig = (model: Model) => {
    setSelectedModel(model);
    setIsConfigDialogOpen(true);
  };

  const handleRefresh = () => {
    toast({
      title: "刷新成功",
      description: "模型列表已更新",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            运行中
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="secondary">
            <Pause className="w-3 h-3 mr-1" />
            已停用
          </Badge>
        );
      case "deploying":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
            部署中
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            失败
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">模型管理</h1>
          <p className="text-muted-foreground">管理和部署AI模型，支持版本控制和性能监控</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </Button>
          <Button onClick={() => setIsUploadDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            上传模型
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>总模型数</CardDescription>
            <CardTitle className="text-3xl">{models.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>运行中</CardDescription>
            <CardTitle className="text-3xl text-green-500">
              {models.filter(m => m.status === "active").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>部署中</CardDescription>
            <CardTitle className="text-3xl text-blue-500">
              {models.filter(m => m.status === "deploying").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>平均准确率</CardDescription>
            <CardTitle className="text-3xl">
              {(models.filter(m => m.accuracy > 0).reduce((acc, m) => acc + m.accuracy, 0) / 
                models.filter(m => m.accuracy > 0).length).toFixed(1)}%
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* 模型列表 */}
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>模型列表</CardTitle>
          <CardDescription>
            共 {models.length} 个模型
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>模型名称</TableHead>
                <TableHead>版本</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>开发者</TableHead>
                <TableHead>框架</TableHead>
                <TableHead>准确率</TableHead>
                <TableHead>性能</TableHead>
                <TableHead>大小</TableHead>
                <TableHead>上传时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models.map((model) => (
                <TableRow key={model.id}>
                  <TableCell className="font-medium">{model.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{model.version}</Badge>
                  </TableCell>
                  <TableCell>{model.type}</TableCell>
                  <TableCell>{getStatusBadge(model.status)}</TableCell>
                  <TableCell>{model.developer}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{model.framework}</Badge>
                  </TableCell>
                  <TableCell>
                    {model.accuracy > 0 ? (
                      <div className="flex items-center gap-2">
                        <Progress value={model.accuracy} className="w-16" />
                        <span className="text-sm">{model.accuracy}%</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {model.performance > 0 ? (
                      <div className="flex items-center gap-2">
                        <Progress value={model.performance} className="w-16" />
                        <span className="text-sm">{model.performance}%</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{model.size}</TableCell>
                  <TableCell className="text-sm">
                    {model.uploadDate.toLocaleDateString('zh-CN')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetail(model)}
                        title="查看详情"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenConfig(model)}
                        title="配置"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadModel(model)}
                        title="下载"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleModelStatus(model.id)}
                        title={model.status === "active" ? "停用" : "激活"}
                        disabled={model.status === "deploying"}
                      >
                        {model.status === "active" ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedModel(model);
                          setIsDeleteDialogOpen(true);
                        }}
                        title="删除"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 上传模型对话框 */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>上传新模型</DialogTitle>
            <DialogDescription>填写模型信息并上传模型文件</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">模型名称 *</Label>
                <Input
                  id="name"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                  placeholder="例如：SPR工艺预测模型"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="version">版本号 *</Label>
                <Input
                  id="version"
                  value={uploadForm.version}
                  onChange={(e) => setUploadForm({ ...uploadForm, version: e.target.value })}
                  placeholder="例如：v1.0.0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">模型类型 *</Label>
                <Select value={uploadForm.type} onValueChange={(value) => setUploadForm({ ...uploadForm, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="预测模型">预测模型</SelectItem>
                    <SelectItem value="检测模型">检测模型</SelectItem>
                    <SelectItem value="优化模型">优化模型</SelectItem>
                    <SelectItem value="诊断模型">诊断模型</SelectItem>
                    <SelectItem value="分类模型">分类模型</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="framework">框架 *</Label>
                <Select value={uploadForm.framework} onValueChange={(value) => setUploadForm({ ...uploadForm, framework: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TensorFlow">TensorFlow</SelectItem>
                    <SelectItem value="PyTorch">PyTorch</SelectItem>
                    <SelectItem value="ONNX">ONNX</SelectItem>
                    <SelectItem value="Keras">Keras</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="developer">开发者 *</Label>
              <Input
                id="developer"
                value={uploadForm.developer}
                onChange={(e) => setUploadForm({ ...uploadForm, developer: e.target.value })}
                placeholder="例如：张工"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">描述</Label>
              <Textarea
                id="description"
                value={uploadForm.description}
                onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                placeholder="描述模型的功能和特点..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">模型文件 *</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="file"
                  type="file"
                  accept=".h5,.pt,.onnx,.pb"
                  disabled={isUploading}
                />
              </div>
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>上传进度</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)} disabled={isUploading}>
              取消
            </Button>
            <Button onClick={handleUploadModel} disabled={isUploading || !uploadForm.name || !uploadForm.version}>
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? "上传中..." : "开始上传"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 详情对话框 */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>模型详情</DialogTitle>
            <DialogDescription>查看完整的模型信息和性能指标</DialogDescription>
          </DialogHeader>
          {selectedModel && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">模型ID</label>
                  <p className="text-sm font-mono mt-1">{selectedModel.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">状态</label>
                  <div className="mt-1">{getStatusBadge(selectedModel.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">模型名称</label>
                  <p className="text-sm font-medium mt-1">{selectedModel.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">版本</label>
                  <p className="text-sm mt-1">
                    <Badge variant="outline">{selectedModel.version}</Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">类型</label>
                  <p className="text-sm mt-1">{selectedModel.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">框架</label>
                  <p className="text-sm mt-1">
                    <Badge variant="secondary">{selectedModel.framework}</Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">开发者</label>
                  <p className="text-sm mt-1">{selectedModel.developer}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">模型大小</label>
                  <p className="text-sm font-mono mt-1">{selectedModel.size}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">上传时间</label>
                  <p className="text-sm mt-1">
                    {selectedModel.uploadDate.toLocaleDateString('zh-CN')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">最后使用</label>
                  <p className="text-sm mt-1">
                    {selectedModel.lastUsed 
                      ? selectedModel.lastUsed.toLocaleDateString('zh-CN')
                      : '-'
                    }
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">准确率</label>
                  <div className="flex items-center gap-3 mt-2">
                    <Progress value={selectedModel.accuracy} className="flex-1" />
                    <span className="text-sm font-medium w-12">{selectedModel.accuracy}%</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">性能指标</label>
                  <div className="flex items-center gap-3 mt-2">
                    <Progress value={selectedModel.performance} className="flex-1" />
                    <span className="text-sm font-medium w-12">{selectedModel.performance}%</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">模型描述</label>
                <p className="text-sm mt-2 p-3 bg-muted rounded-md">
                  {selectedModel.description}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 配置对话框 */}
      <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>模型配置</DialogTitle>
            <DialogDescription>
              配置 {selectedModel?.name} {selectedModel?.version} 的运行参数
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>推理批次大小</Label>
              <Input type="number" defaultValue="32" />
            </div>
            <div className="space-y-2">
              <Label>GPU内存限制 (MB)</Label>
              <Input type="number" defaultValue="4096" />
            </div>
            <div className="space-y-2">
              <Label>超时时间 (秒)</Label>
              <Input type="number" defaultValue="30" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfigDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={() => {
              toast({ title: "配置已保存" });
              setIsConfigDialogOpen(false);
            }}>
              保存配置
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除模型？</AlertDialogTitle>
            <AlertDialogDescription>
              您即将删除模型 <strong>{selectedModel?.name} {selectedModel?.version}</strong>。
              此操作无法撤销，请谨慎操作。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteModel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
