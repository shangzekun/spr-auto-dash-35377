import { useState } from "react";
import { Upload, FileText, Plus, Trash2, Edit3, Save, FolderOpen, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

const mockProjects = [
  { id: "1", name: "电池包项目A", status: "active", dataCount: 1247 },
  { id: "2", name: "车身连接项目B", status: "active", dataCount: 856 },
  { id: "3", name: "测试项目C", status: "inactive", dataCount: 234 }
];

const dataHeaders = ["连接类型", "厚度", "电流", "电压", "时间", "质量", "合格率", "结果"];

const mockDataRows = [
  { id: "1", data: ["钢铝连接", "6mm", "4.5kA", "380V", "2.1s", "优良", "98.5%", "Pass"] },
  { id: "2", data: ["铝铝连接", "8mm", "5.2kA", "400V", "2.3s", "良好", "96.2%", "Pass"] },
  { id: "3", data: ["钢钢连接", "5mm", "4.0kA", "360V", "1.9s", "优良", "99.1%", "Pass"] },
  { id: "4", data: ["复合连接", "7mm", "4.8kA", "390V", "2.0s", "良好", "97.3%", "Pass"] }
];

const categoryHeaders = [
  { id: "recommended", title: "默认推荐", items: [] as Array<{ id: string; data: string[] }> },
  { id: "double-pin", title: "双钉共模", items: [] as Array<{ id: string; data: string[] }> },
  { id: "shared-pin", title: "共钉共模", items: [] as Array<{ id: string; data: string[] }> }
];

export default function DataImport() {
  const [selectedProject, setSelectedProject] = useState("1");
  const [projects, setProjects] = useState(mockProjects);
  const [dataRows, setDataRows] = useState(mockDataRows);
  const [categories, setCategories] = useState(categoryHeaders);
  const [draggedItem, setDraggedItem] = useState<{ id: string; data: string[]; source: string } | null>(null);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [isEditProjectDialogOpen, setIsEditProjectDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingProjectName, setEditingProjectName] = useState("");

  const handleDragStart = (e: React.DragEvent, rowId: string, data: string[], source: string) => {
    setDraggedItem({ id: rowId, data, source });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    if (draggedItem) {
      if (draggedItem.source === "dataRows") {
        // 从数据行拖拽到分类
        setCategories(prev => prev.map(cat => 
          cat.id === categoryId 
            ? { ...cat, items: [...cat.items, { id: draggedItem.id, data: draggedItem.data }] }
            : cat
        ));
        setDataRows(prev => prev.filter(row => row.id !== draggedItem.id));
      } else {
        // 从一个分类拖拽到另一个分类
        setCategories(prev => prev.map(cat => {
          if (cat.id === categoryId) {
            // 添加到目标分类
            const exists = cat.items.some(item => item.id === draggedItem.id);
            if (!exists) {
              return { ...cat, items: [...cat.items, { id: draggedItem.id, data: draggedItem.data }] };
            }
            return cat;
          } else {
            // 从源分类移除
            return { ...cat, items: cat.items.filter(item => item.id !== draggedItem.id) };
          }
        }));
      }
      setDraggedItem(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleRemoveFromCategory = (categoryId: string, itemId: string) => {
    const item = categories.find(cat => cat.id === categoryId)?.items.find(i => i.id === itemId);
    if (item) {
      setCategories(prev => prev.map(cat => 
        cat.id === categoryId 
          ? { ...cat, items: cat.items.filter(i => i.id !== itemId) }
          : cat
      ));
      setDataRows(prev => [...prev, item]);
    }
  };

  const handleNewProject = () => {
    if (newProjectName.trim()) {
      const newProject = {
        id: String(Date.now()),
        name: newProjectName.trim(),
        status: "active" as const,
        dataCount: 0
      };
      setProjects(prev => [...prev, newProject]);
      setNewProjectName("");
      setIsNewProjectDialogOpen(false);
      toast.success("项目创建成功");
    }
  };

  const handleEditProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setEditingProjectId(projectId);
      setEditingProjectName(project.name);
      setIsEditProjectDialogOpen(true);
    }
  };

  const handleSaveEditProject = () => {
    if (editingProjectName.trim() && editingProjectId) {
      setProjects(prev => prev.map(p => 
        p.id === editingProjectId 
          ? { ...p, name: editingProjectName.trim() }
          : p
      ));
      setEditingProjectId(null);
      setEditingProjectName("");
      setIsEditProjectDialogOpen(false);
      toast.success("项目更新成功");
    }
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (selectedProject === projectId && projects.length > 1) {
      const remaining = projects.filter(p => p.id !== projectId);
      setSelectedProject(remaining[0]?.id || "");
    }
    toast.success("项目已删除");
  };

  return (
    <>
      <div className="flex h-full">
        {/* 左侧项目管理 */}
        <div className="w-80 border-r border-border bg-card">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                <FolderOpen className="w-4 h-4 text-primary-foreground" />
              </div>
              <h2 className="text-lg font-semibold">项目管理</h2>
            </div>
            <Button 
              className="w-full gap-2 hover:scale-105 transition-smooth"
              onClick={() => setIsNewProjectDialogOpen(true)}
            >
              <Plus className="w-4 h-4" />
              新建项目
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-2">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-smooth hover:scale-105 ${
                    selectedProject === project.id
                      ? "bg-primary/10 border-primary/20"
                      : "bg-card border-border hover:bg-muted/30"
                  }`}
                  onClick={() => setSelectedProject(project.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm">{project.name}</h3>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 hover:scale-110 transition-smooth"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditProject(project.id);
                        }}
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 hover:scale-110 transition-smooth text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={project.status === "active" ? "default" : "secondary"} className="text-xs">
                      {project.status === "active" ? "活跃" : "非活跃"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{project.dataCount} 条数据</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* 右侧数据导入区域 */}
        <div className="flex-1 flex flex-col">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                <Upload className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">数据导入</h1>
                <p className="text-muted-foreground">工艺数据导入与管理</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button className="gap-2 hover:scale-105 transition-smooth">
                <FileText className="w-4 h-4" />
                选择文件导入
              </Button>
              <Button variant="outline" className="gap-2 hover:scale-105 transition-smooth">
                <Save className="w-4 h-4" />
                保存分组
              </Button>
            </div>
          </div>

          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* 数据行显示 */}
            {dataRows.length > 0 && (
              <Card className="border-border/50 shadow-card hover:shadow-elegant transition-smooth">
                <CardHeader>
                  <CardTitle className="text-lg">导入数据</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {/* 标题行 */}
                    <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
                      {dataHeaders.map((header, index) => (
                        <div key={index} className="px-2 py-1 font-medium text-sm min-w-20 text-center">
                          {header}
                        </div>
                      ))}
                    </div>
                    
                    {dataRows.map((row) => (
                      <div
                        key={row.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, row.id, row.data, "dataRows")}
                        className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg cursor-move hover:bg-muted/50 transition-smooth hover:scale-105"
                      >
                        {row.data.map((cell, index) => (
                          <div key={index} className="px-2 py-1 bg-background rounded border text-sm min-w-20 text-center">
                            {cell}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 分组区域 - 纵向显示 */}
            <div className="space-y-6">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className="border-border/50 shadow-card hover:shadow-elegant transition-smooth"
                  onDrop={(e) => handleDrop(e, category.id)}
                  onDragOver={handleDragOver}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* 标题行 */}
                    <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20 mb-2">
                      {dataHeaders.map((header, index) => (
                        <div key={index} className="px-2 py-1 font-medium text-sm min-w-20 text-center">
                          {header}
                        </div>
                      ))}
                    </div>
                    
                    <div 
                      className="min-h-40 border-2 border-dashed border-border/50 rounded-lg p-4 space-y-2"
                    >
                      {category.items.length === 0 ? (
                        <p className="text-muted-foreground text-sm text-center py-8">
                          拖拽数据到此处进行分组
                        </p>
                      ) : (
                        category.items.map((item) => (
                          <div 
                            key={item.id} 
                            draggable
                            onDragStart={(e) => handleDragStart(e, item.id, item.data, category.id)}
                            className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg cursor-move hover:bg-muted/50 transition-smooth hover:scale-105 group relative"
                          >
                            {item.data.map((cell, index) => (
                              <div key={index} className="px-2 py-1 bg-background rounded border text-sm min-w-20 text-center">
                                {cell}
                              </div>
                            ))}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute -right-2 -top-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-smooth bg-destructive/10 hover:bg-destructive/20"
                              onClick={() => handleRemoveFromCategory(category.id, item.id)}
                            >
                              <X className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 新建项目对话框 */}
      <Dialog open={isNewProjectDialogOpen} onOpenChange={setIsNewProjectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新建项目</DialogTitle>
            <DialogDescription>创建一个新的工艺项目</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">项目名称</label>
              <Input
                placeholder="请输入项目名称"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleNewProject();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewProjectDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleNewProject}>
              创建
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑项目对话框 */}
      <Dialog open={isEditProjectDialogOpen} onOpenChange={setIsEditProjectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑项目</DialogTitle>
            <DialogDescription>修改项目信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">项目名称</label>
              <Input
                placeholder="请输入项目名称"
                value={editingProjectName}
                onChange={(e) => setEditingProjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveEditProject();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditProjectDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSaveEditProject}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
