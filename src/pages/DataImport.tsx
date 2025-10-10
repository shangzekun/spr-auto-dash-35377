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

  /** 拖拽开始 */
  const handleDragStart = (e: React.DragEvent, rowId: string, data: string[], source: string, groupId?: string) => {
    setDraggedItem({ id: rowId, data, source, groupId });
    e.dataTransfer.effectAllowed = "move";
  };

  /** 拖拽到组 */
  const handleDrop = (e: React.DragEvent, categoryId: string, groupId?: string) => {
    e.preventDefault();
    if (!draggedItem) return;

    // 同组拖拽不操作
    if (draggedItem.source === categoryId && draggedItem.groupId === groupId) {
      setDraggedItem(null);
      return;
    }

    setCategories(prev =>
      prev.map(cat => {
        // 目标组添加数据
        if (cat.id === categoryId) {
          if (cat.hasGroups && groupId) {
            return {
              ...cat,
              groups: cat.groups.map(g =>
                g.id === groupId ? { ...g, items: [...g.items, { id: draggedItem.id, data: draggedItem.data }] } : g
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

        // 源组删除数据（如果源是其他组）
        if (draggedItem.source !== "dataRows") {
          return {
            ...cat,
            groups: cat.groups.map(g =>
              g.id === draggedItem.groupId ? { ...g, items: g.items.filter(item => item.id !== draggedItem.id) } : g
            )
          };
        }

        return cat;
      })
    );

    // 如果拖拽源是导入数据表，删除原表行
    if (draggedItem.source === "dataRows") {
      setDataRows(prev => prev.filter(row => row.id !== draggedItem.id));
    }

    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  /** 删除组 */
  const handleDeleteGroup = (categoryId: string, groupId: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? { ...cat, groups: cat.groups.filter(g => g.id !== groupId) }
          : cat
      )
    );
  };

  /** 从组中移除单行 */
  const handleRemoveFromCategory = (categoryId: string, groupId: string, itemId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    const group = category?.groups.find(g => g.id === groupId);
    const item = group?.items.find(i => i.id === itemId);
    if (!item) return;

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
  };

  /** 添加新组 */
  const handleAddGroup = (categoryId: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? { ...cat, groups: [...cat.groups, { id: `group-${Date.now()}`, items: [] }] }
          : cat
      )
    );
  };

  /** 创建新项目 */
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

  /** 编辑项目 */
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

  /** 删除项目 */
  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (selectedProject === projectId && projects.length > 1) {
      const remaining = projects.filter(p => p.id !== projectId);
      setSelectedProject(remaining[0]?.id || "");
    }
    toast.success("项目已删除");
  };

  /** 表格样式：取消边框，内容不换行，横向滚动 */
  const tableStyle = "table-auto w-full whitespace-nowrap overflow-x-auto";

  return (
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
            {projects.map(project => (
              <div
                key={project.id}
                className={`p-4 rounded-lg cursor-pointer transition-smooth hover:scale-105 ${
                  selectedProject === project.id ? "bg-primary/10" : "bg-card"
                }`}
                onClick={() => setSelectedProject(project.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm">{project.name}</h3>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => { e.stopPropagation(); handleEditProject(project.id); }}
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-destructive"
                      onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }}
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
          {/* 导入数据表 */}
          {dataRows.length > 0 && (
            <Card className="shadow-card hover:shadow-elegant transition-smooth">
              <CardHeader>
                <CardTitle className="text-lg">导入数据</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className={tableStyle}>
                    <thead>
                      <tr className="text-center font-medium">
                        <th>序号</th>
                        {dataHeaders.map(h => <th key={h}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {dataRows.map((row, idx) => (
                        <tr
                          key={row.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, row.id, row.data, "dataRows")}
                          className="cursor-move hover:bg-muted/20 transition-smooth"
                        >
                          <td className="text-center px-2">{idx + 1}</td>
                          {row.data.map((cell, i) => <td key={i} className="px-2">{cell}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 分类分组 */}
          {categories.map(cat => (
            <Card key={cat.id} className="shadow-card hover:shadow-elegant transition-smooth">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{cat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {cat.groups.map((group, idx) => (
                  <div
                    key={group.id}
                    onDrop={(e) => handleDrop(e, cat.id, group.id)}
                    onDragOver={handleDragOver}
                    className="mb-4 relative p-2 rounded-lg bg-muted/10"
                  >
                    {cat.hasGroups && (
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-muted-foreground">组 {idx + 1}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleDeleteGroup(cat.id, group.id)}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    )}
                    <div className="overflow-x-auto">
                      <table className={tableStyle}>
                        <thead>
                          <tr className="text-center font-medium">
                            <th>序号</th>
                            {dataHeaders.map(h => <th key={h}>{h}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {group.items.length === 0 ? (
                            <tr className="text-center text-muted-foreground">
                              <td colSpan={dataHeaders.length + 1} className="py-4">拖拽数据到此处进行分组</td>
                            </tr>
                          ) : (
                            group.items.map((item, i) => (
                              <tr
                                key={item.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, item.id, item.data, cat.id, group.id)}
                                className="cursor-move hover:bg-muted/20 transition-smooth"
                              >
                                <td className="text-center px-2">{i + 1}</td>
                                {item.data.map((cell, idx) => <td key={idx} className="px-2">{cell}</td>)}
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}

                {/* 添加组按钮 */}
                {cat.hasGroups && (
                  <div
                    onClick={() => handleAddGroup(cat.id)}
                    className="flex items-center justify-center gap-2 cursor-pointer border-2 border-dashed p-2 rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-smooth"
                  >
                    <Plus className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">添加新组</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
