import { useState } from "react";
import { Upload, FileText, Plus, Trash2, Edit3, Save, FolderOpen, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

const mockProjects = [
  { id: "1", name: "Qinling", status: "active", dataCount: 1247 },
  { id: "2", name: "Pisces", status: "active", dataCount: 856 },
  { id: "3", name: "Dom G1.6", status: "inactive", dataCount: 234 }
];

const dataHeaders = ["Material 1", "Material 2", "Material 3", "Gauge 1", "Gauge 2", "Gauge 3", "Rivet", "Die"];

const mockDataRows = [
  { id: "1", data: ["LAC340Y410T", "6000-BR", "", "1.2", "1.5", "", "C5.3x5.0H2", "M260238"] },
  { id: "2", data: ["6000-BR", "6000-BR", "", "2.0", "2.5", "", "C5.3x6.0H2", "M260468"] },
  { id: "3", data: ["DPC420Y780T", "DC-N2 F", "", "1.8", "3.0", "", "HSS5.5x6.0H5", "M260406"] },
  { id: "4", data: ["LAC340Y410T", "LAC340Y410T", "DC-N2 F", "1.5", "1.2", "3.0", "C5.3x7.0H4", "M260412"] }
];

type CategoryGroup = {
  id: string;
  items: Array<{ id: string; data: string[] }>;
};

const categoryHeaders = [
  { id: "recommended", title: "默认推荐", groups: [{ id: "default", items: [] }], hasGroups: false },
  { id: "double-pin", title: "双钉共模", groups: [{ id: "group-1", items: [] }], hasGroups: true },
  { id: "shared-pin", title: "共钉共模", groups: [{ id: "group-1", items: [] }], hasGroups: true }
];

// CSS Grid列宽模板
const gridTemplateColumns = "80px 120px 120px 80px 80px 80px 100px 100px";

export default function DataImport() {
  const [selectedProject, setSelectedProject] = useState("1");
  const [projects, setProjects] = useState(mockProjects);
  const [dataRows, setDataRows] = useState(mockDataRows);
  const [categories, setCategories] = useState(categoryHeaders);
  const [draggedItem, setDraggedItem] = useState<{ id: string; data: string[]; source: string; groupId?: string } | null>(null);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [isEditProjectDialogOpen, setIsEditProjectDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingProjectName, setEditingProjectName] = useState("");

  const handleDragStart = (e: React.DragEvent, rowId: string, data: string[], source: string, groupId?: string) => {
    setDraggedItem({ id: rowId, data, source, groupId });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent, categoryId: string, groupId?: string) => {
    e.preventDefault();
    if (!draggedItem) return;

    setCategories(prev =>
      prev.map(cat => {
        if (cat.id === categoryId) {
          if (cat.hasGroups && groupId) {
            return {
              ...cat,
              groups: cat.groups.map(g =>
                g.id === groupId
                  ? { ...g, items: [...g.items, { id: draggedItem.id, data: draggedItem.data }] }
                  : g
              )
            };
          } else if (!cat.hasGroups) {
            const currentItems = cat.groups[0]?.items || [];
            return {
              ...cat,
              groups: [{ id: "default", items: [...currentItems, { id: draggedItem.id, data: draggedItem.data }] }]
            };
          }
        }
        if (cat.hasGroups) {
          return {
            ...cat,
            groups: cat.groups.map(g => ({
              ...g,
              items: g.items.filter(item => item.id !== draggedItem.id)
            }))
          };
        } else {
          return {
            ...cat,
            groups: cat.groups.map(g => ({
              ...g,
              items: g.items.filter(item => item.id !== draggedItem.id)
            }))
          };
        }
      })
    );

    if (draggedItem.source === "dataRows") {
      setDataRows(prev => prev.filter(row => row.id !== draggedItem.id));
    }

    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDeleteGroup = (categoryId: string, groupId: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? { ...cat, groups: cat.groups.filter(g => g.id !== groupId) }
          : cat
      )
    );
  };

  const handleRemoveFromCategory = (categoryId: string, groupId: string, itemId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    const group = category?.groups.find(g => g.id === groupId);
    const item = group?.items.find(i => i.id === itemId);

    if (item) {
      setCategories(prev =>
        prev.map(cat =>
          cat.id === categoryId
            ? {
                ...cat,
                groups: cat.groups.map(g =>
                  g.id === groupId ? { ...g, items: g.items.filter(i => i.id !== itemId) } : g
                )
              }
            : cat
        )
      );
      setDataRows(prev => [...prev, item]);
    }
  };

  const handleAddGroup = (categoryId: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              groups: [...cat.groups, { id: `group-${Date.now()}`, items: [] }]
            }
          : cat
      )
    );
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
      setProjects(prev =>
        prev.map(p => (p.id === editingProjectId ? { ...p, name: editingProjectName.trim() } : p))
      );
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
                    {/* 表头 */}
                    <div className="grid items-center gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20" style={{ gridTemplateColumns }}>
                      <div className="text-center font-medium text-sm">序号</div>
                      {dataHeaders.map((header) => (
                        <div key={header} className="text-center font-medium text-sm">{header}</div>
                      ))}
                    </div>

                    {/* 数据行 */}
                    {dataRows.map((row, rowIndex) => (
                      <div
                        key={row.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, row.id, row.data, "dataRows")}
                        className="grid items-center gap-2 px-2 py-1 bg-muted/30 rounded-lg cursor-move hover:bg-muted/50 transition-smooth hover:scale-105"
                        style={{ gridTemplateColumns }}
                      >
                        <div className="text-center">{rowIndex + 1}</div>
                        {row.data.map((cell, index) => (
                          <div key={index} className="text-left">{cell}</div>
                        ))}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 分组区域 */}
            <div className="space-y-6">
              {categories.map((category) => (
                <Card key={category.id} className="border-border/50 shadow-card hover:shadow-elegant transition-smooth">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* 表头 */}
                    <div className="grid items-center gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20 mb-4" style={{ gridTemplateColumns }}>
                      <div className="text-center font-medium text-sm">序号</div>
                      {dataHeaders.map((header) => (
                        <div key={header} className="text-center font-medium text-sm">{header}</div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      {category.groups.map((group, groupIndex) => (
                        <div
                          key={group.id}
                          onDrop={(e) => handleDrop(e, category.id, group.id)}
                          onDragOver={handleDragOver}
                          className="border-2 border-dashed border-border/50 rounded-lg p-4 space-y-2 min-h-32"
                        >
                          {category.hasGroups && (
                            <div className="text-sm font-medium text-muted-foreground mb-2">
                              组 {groupIndex + 1}
                            </div>
                          )}

                          {group.items.length === 0 ? (
                            <div
                              className="grid items-center justify-center text-muted-foreground text-sm py-8"
                              style={{ gridTemplateColumns }}
                            >
                              <div className="col-span-8 text-center">拖拽数据到此处进行分组</div>
                            </div>
                          ) : (
                            group.items.map((item, itemIndex) => (
                              <div
                                key={item.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, item.id, item.data, category.id, group.id)}
                                className="grid items-center gap-2 px-2 py-1 bg-muted/30 rounded-lg cursor-move hover:bg-muted/50 transition-smooth hover:scale-105 group relative"
                                style={{ gridTemplateColumns }}
                              >
                                <div className="text-center">{itemIndex + 1}</div>
                                {item.data.map((cell, index) => (
                                  <div key={index} className="text-left">{cell}</div>
                                ))}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute -right-2 -top-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-smooth bg-destructive/10 hover:bg-destructive/20"
                                  onClick={() => handleRemoveFromCategory(category.id, group.id, item.id)}
                                >
                                  <X className="h-3 w-3 text-destructive" />
                                </Button>
                              </div>
                            ))
                          )}
                        </div>
                      ))}

                      {category.hasGroups && (
                        <div
                          onClick={() => handleAddGroup(category.id)}
                          className="border-2 border-dashed border-border/50 rounded-lg p-4 min-h-20 flex items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-smooth group"
                        >
                          <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-smooth">
                            <Plus className="w-5 h-5" />
                            <span className="text-sm font-medium">添加新组</span>
                          </div>
                        </div>
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
                onKeyDown={(e) => { if (e.key === 'Enter') handleNewProject(); }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewProjectDialogOpen(false)}>取消</Button>
            <Button onClick={handleNewProject}>创建</Button>
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
                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveEditProject(); }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditProjectDialogOpen(false)}>取消</Button>
            <Button onClick={handleSaveEditProject}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
