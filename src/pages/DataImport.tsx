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

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

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
          ? { ...cat, groups: [...cat.groups, { id: `group-${Date.now()}`, items: [] }] }
          : cat
      )
    );
  };

  const handleNewProject = () => {
    if (!newProjectName.trim()) return;
    const newProject = { id: String(Date.now()), name: newProjectName.trim(), status: "active" as const, dataCount: 0 };
    setProjects(prev => [...prev, newProject]);
    setNewProjectName("");
    setIsNewProjectDialogOpen(false);
    toast.success("项目创建成功");
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
    if (!editingProjectName.trim() || !editingProjectId) return;
    setProjects(prev => prev.map(p => (p.id === editingProjectId ? { ...p, name: editingProjectName.trim() } : p)));
    setEditingProjectId(null);
    setEditingProjectName("");
    setIsEditProjectDialogOpen(false);
    toast.success("项目更新成功");
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (selectedProject === projectId && projects.length > 1) {
      const remaining = projects.filter(p => p.id !== projectId);
      setSelectedProject(remaining[0]?.id || "");
    }
    toast.success("项目已删除");
  };

  // 核心样式：grid + min-content + nowrap + overflow-x
  const gridStyle = {
    gridTemplateColumns: `50px repeat(${dataHeaders.length}, min-content)`,
    whiteSpace: "nowrap",
    overflowX: "auto"
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
            <Button className="w-full gap-2 hover:scale-105 transition-smooth" onClick={() => setIsNewProjectDialogOpen(true)}>
              <Plus className="w-4 h-4" /> 新建项目
            </Button>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-2">
              {projects.map(project => (
                <div
                  key={project.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-smooth hover:scale-105 ${
                    selectedProject === project.id ? "bg-primary/10 border-primary/20" : "bg-card border-border hover:bg-muted/30"
                  }`}
                  onClick={() => setSelectedProject(project.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm">{project.name}</h3>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:scale-110 transition-smooth" onClick={(e) => { e.stopPropagation(); handleEditProject(project.id); }}>
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:scale-110 transition-smooth text-destructive" onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }}>
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

        {/* 右侧数据导入 */}
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
                <FileText className="w-4 h-4" /> 选择文件导入
              </Button>
              <Button variant="outline" className="gap-2 hover:scale-105 transition-smooth">
                <Save className="w-4 h-4" /> 保存分组
              </Button>
            </div>
          </div>

          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* 导入数据表 */}
            {dataRows.length > 0 && (
              <Card className="border-border/50 shadow-card hover:shadow-elegant transition-smooth overflow-x-auto">
                <CardHeader>
                  <CardTitle className="text-lg">导入数据</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid items-center gap-2 p-2 font-medium bg-primary/10 rounded-lg border border-primary/20" style={{ gridTemplateColumns: `50px repeat(${dataHeaders.length}, min-content)` }}>
                    <div className="text-center">序号</div>
                    {dataHeaders.map((h, i) => <div key={i} className="text-center">{h}</div>)}
                  </div>

                  <div className="space-y-2 mt-2">
                    {dataRows.map((row, idx) => (
                      <div
                        key={row.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, row.id, row.data, "dataRows")}
                        className="grid items-center gap-2 p-2 bg-muted/30 rounded-lg cursor-move hover:bg-muted/50 transition-smooth hover:scale-105"
                        style={{ gridTemplateColumns: `50px repeat(${dataHeaders.length}, min-content)`, whiteSpace: "nowrap" }}
                      >
                        <div className="text-center">{idx + 1}</div>
                        {row.data.map((cell, i) => (
                          <div key={i} className="text-center">{cell}</div>
                        ))}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 分组区域 */}
            <div className="space-y-6">
              {categories.map(category => (
                <Card key={category.id} className="border-border/50 shadow-card hover:shadow-elegant transition-smooth overflow-x-auto">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid items-center gap-2 p-2 font-medium bg-primary/10 rounded-lg border border-primary/20 mb-4" style={{ gridTemplateColumns: `50px repeat(${dataHeaders.length}, min-content)` }}>
                      <div className="text-center">序号</div>
                      {dataHeaders.map((h, i) => <div key={i} className="text-center">{h}</div>)}
                    </div>

                    <div className="space-y-4">
                      {category.groups.map((group, gIdx) => (
                        <div
                          key={group.id}
                          onDrop={(e) => handleDrop(e, category.id, group.id)}
                          onDragOver={handleDragOver}
                          className="grid gap-2 p-2 border-2 border-dashed border-border/50 rounded-lg min-h-32"
                          style={{ gridTemplateColumns: `50px repeat(${dataHeaders.length}, min-content)`, whiteSpace: "nowrap" }}
                        >
                          {category.hasGroups && <div className="text-sm font-medium text-muted-foreground col-span-full mb-2">组 {gIdx + 1}</div>}

                          {group.items.length === 0 ? (
                            <div className="col-span-full text-center text-muted-foreground py-8">拖拽数据到此处进行分组</div>
                          ) : (
                            group.items.map((item, idx) => (
                              <div
                                key={item.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, item.id, item.data, category.id, group.id)}
                                className="grid items-center gap-2 p-2 bg-muted/30 rounded-lg cursor-move hover:bg-muted/50 transition-smooth hover:scale-105 relative"
                                style={{ gridTemplateColumns: `50px repeat(${dataHeaders.length}, min-content)`, whiteSpace: "nowrap" }}
                              >
                                <div className="text-center">{idx + 1}</div>
                                {item.data.map((cell, i) => (
                                  <div key={i} className="text-center">{cell}</div>
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

      {/* 新建项目对话框 & 编辑项目对话框 略，保持原逻辑不变 */}
    </>
  );
}
