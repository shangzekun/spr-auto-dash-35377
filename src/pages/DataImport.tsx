import { useState, useEffect, useRef } from "react";
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
  { id: "2", data: ["6000-BR", "6000-BR", "", "2.0", "2.0", "", "C5.3x6.0H2", "M260468"] },
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
  const [isDeleteGroupDialogOpen, setIsDeleteGroupDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingProjectName, setEditingProjectName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [deleteGroupInfo, setDeleteGroupInfo] = useState<{ categoryId: string; groupId: string } | null>(null);
  const mainContentRef = useRef<HTMLDivElement>(null); // 主内容区域引用

  /** 拖拽开始 */
  const handleDragStart = (e: React.DragEvent, rowId: string, data: string[], source: string, groupId?: string) => {
    setDraggedItem({ id: rowId, data, source, groupId });
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", rowId);
    // 拖拽开始时聚焦主内容区，确保滚轮事件能被捕获
    mainContentRef.current?.focus();
  };

  /** 拖拽结束 */
  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedItem(null);
  };

  /** 拖拽到组 */
  const handleDrop = (e: React.DragEvent, categoryId: string, groupId?: string) => {
    e.preventDefault();
    if (!draggedItem) return;

    const updatedCategories = [...categories];
    
    // 1. 从原组中移除数据
    if (draggedItem.source !== "dataRows" && draggedItem.groupId) {
      const sourceCatIndex = updatedCategories.findIndex(cat => cat.id === draggedItem.source);
      if (sourceCatIndex !== -1) {
        updatedCategories[sourceCatIndex].groups = updatedCategories[sourceCatIndex].groups.map(g => 
          g.id === draggedItem.groupId 
            ? { ...g, items: g.items.filter(item => item.id !== draggedItem.id) }
            : g
        );
      }
    }

    // 2. 向目标组添加数据
    const targetCatIndex = updatedCategories.findIndex(cat => cat.id === categoryId);
    if (targetCatIndex !== -1) {
      const targetCategory = { ...updatedCategories[targetCatIndex] };
      
      if (targetCategory.hasGroups && groupId) {
        targetCategory.groups = targetCategory.groups.map(g =>
          g.id === groupId 
            ? { ...g, items: [...g.items, { id: draggedItem.id, data: draggedItem.data }] }
            : g
        );
      } else if (!targetCategory.hasGroups) {
        const currentItems = targetCategory.groups[0]?.items || [];
        targetCategory.groups = [{ 
          id: "default", 
          items: [...currentItems, { id: draggedItem.id, data: draggedItem.data }] 
        }];
      }
      
      updatedCategories[targetCatIndex] = targetCategory;
    }

    // 3. 源为导入表时删除原行
    if (draggedItem.source === "dataRows") {
      setDataRows(prev => prev.filter(row => row.id !== draggedItem.id));
    }

    setCategories(updatedCategories);
    handleDragEnd();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  /** 打开删除组对话框 */
  const handleOpenDeleteGroupDialog = (categoryId: string, groupId: string) => {
    setDeleteGroupInfo({ categoryId, groupId });
    setIsDeleteGroupDialogOpen(true);
  };

  /** 确认删除组 */
  const handleConfirmDeleteGroup = () => {
    if (!deleteGroupInfo) return;
    const { categoryId, groupId } = deleteGroupInfo;

    // 1. 组内数据放回导入区
    const category = categories.find(cat => cat.id === categoryId);
    const group = category?.groups.find(g => g.id === groupId);
    if (group?.items.length) {
      setDataRows(prev => [...prev, ...group.items]);
    }

    // 2. 删除组
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? { ...cat, groups: cat.groups.filter(g => g.id !== groupId) }
          : cat
      )
    );

    setIsDeleteGroupDialogOpen(false);
    setDeleteGroupInfo(null);
    toast.success("分组删除成功");
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
          ? { 
              ...cat, 
              groups: [...cat.groups, { id: `group-${Date.now()}`, items: [] }] 
            }
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

  /** 拖拽时滚动处理（同时支持鼠标边缘滚动和滚轮滚动） */
  useEffect(() => {
    if (!isDragging) return;

    // 鼠标边缘自动滚动
    const handleMouseMove = (e: MouseEvent) => {
      const scrollSpeed = 8;
      const edgeThreshold = 80;
      const windowHeight = window.innerHeight;
      const mouseY = e.clientY;

      if (mouseY < edgeThreshold) {
        window.scrollBy(0, -scrollSpeed);
      } else if (mouseY > windowHeight - edgeThreshold) {
        window.scrollBy(0, scrollSpeed);
      }
    };

    // 滚轮滚动处理（核心修复）
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // 阻止默认行为，避免冲突
      const scrollAmount = e.deltaY > 0 ? 20 : -20; // 根据滚轮方向设置滚动量
      window.scrollBy(0, scrollAmount);
    };

    // 绑定事件
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("wheel", handleWheel, { passive: false }); // 必须设置passive: false才能阻止默认行为

    // 清理事件
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("wheel", handleWheel);
    };
  }, [isDragging]);

  return (
    <>
      <div className="flex h-full" ref={mainContentRef} tabIndex={-1}>
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
                  className={`p-4 rounded-lg border cursor-pointer transition-smooth hover:scale-105 ${
                    selectedProject === project.id ? "bg-primary/10 border-primary/20" : "bg-card border-border hover:bg-muted/30"
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
                        onClick={(e) => { e.stopPropagation(); handleEditProject(project.id); }}
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:scale-110 transition-smooth text-destructive"
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
            {/* 1. 导入数据（Table结构+列对齐） */}
            {dataRows.length > 0 && (
              <Card className="border-border/50 shadow-card hover:shadow-elegant transition-smooth overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg">导入数据</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {/* 横向滚动容器 */}
                  <div className="overflow-x-auto w-fit">
                    {/* Table结构：列对齐核心 */}
                    <table className="border-collapse">
                      <thead>
                        <tr>
                          {/* 表头行：与数据行严格对齐 */}
                          <th className="p-3 bg-primary/10 text-center font-medium text-sm rounded-l-lg border border-primary/20 min-w-[50px]">
                            序号
                          </th>
                          {dataHeaders.map((header, index) => (
                            <th
                              key={index}
                              className={`p-3 bg-primary/10 text-center font-medium text-sm border-y border-primary/20 ${
                                index === dataHeaders.length - 1 ? "rounded-r-lg" : ""
                              } min-w-[max-content]`}
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {dataRows.map((row, rowIndex) => (
                          <tr
                            key={row.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, row.id, row.data, "dataRows")}
                            onDragEnd={handleDragEnd}
                            className="cursor-move hover:bg-primary/5 transition-all duration-200"
                          >
                            {/* 序号列 */}
                            <td className="p-3 text-center text-sm border border-border/20 bg-background min-w-[50px]">
                              {rowIndex + 1}
                            </td>
                            {/* 数据列：与表头一一对应 */}
                            {row.data.map((cell, index) => (
                              <td
                                key={index}
                                className={`p-3 text-center text-sm border-y border-r border-border/20 bg-background ${
                                  index === row.data.length - 1 ? "border-r-0" : ""
                                } min-w-[max-content]`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 2. 分类分组（Table结构+列对齐） */}
            <div className="space-y-6">
              {categories.map(category => (
                <Card key={category.id} className="border-border/50 shadow-card hover:shadow-elegant transition-smooth overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    {/* 横向滚动容器 */}
                    <div className="overflow-x-auto w-fit">
                      {/* 分类标题行（Table表头样式） */}
                      <table className="border-collapse mb-4">
                        <thead>
                          <tr>
                            <th className="p-3 bg-primary/10 text-center font-medium text-sm rounded-l-lg border border-primary/20 min-w-[50px]">
                              序号
                            </th>
                            {dataHeaders.map((header, index) => (
                              <th
                                key={index}
                                className="p-3 bg-primary/10 text-center font-medium text-sm border-y border-primary/20 min-w-[max-content]"
                              >
                                {header}
                              </th>
                            ))}
                            {/* 操作列 */}
                            <th className="p-3 bg-primary/10 text-center font-medium text-sm rounded-r-lg border border-primary/20 min-w-[40px]">
                              &nbsp;
                            </th>
                          </tr>
                        </thead>
                      </table>

                      {/* 分组列表 */}
                      <div className="space-y-4">
                        {category.groups.map((group, groupIndex) => (
                          <div
                            key={group.id}
                            onDrop={(e) => handleDrop(e, category.id, group.id)}
                            onDragOver={handleDragOver}
                            className="border-2 border-dashed border-border/50 rounded-lg p-4 min-h-32"
                          >
                            {/* 组删除按钮 */}
                            {category.hasGroups && (
                              <div className="flex justify-end mb-3">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                                  onClick={() => handleOpenDeleteGroupDialog(category.id, group.id)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            )}

                            {/* 组内数据（Table结构） */}
                            {group.items.length === 0 ? (
                              <p className="text-muted-foreground text-sm text-center py-8">
                                拖拽数据到此处进行分组
                              </p>
                            ) : (
                              <table className="border-collapse">
                                <tbody>
                                  {group.items.map((item, itemIndex) => (
                                    <tr
                                      key={item.id}
                                      draggable
                                      onDragStart={(e) => handleDragStart(e, item.id, item.data, category.id, group.id)}
                                      onDragEnd={handleDragEnd}
                                      className="cursor-move hover:bg-primary/5 transition-all duration-200"
                                    >
                                      {/* 序号列 */}
                                      <td className="p-3 text-center text-sm border border-border/20 bg-background min-w-[50px]">
                                        {itemIndex + 1}
                                      </td>
                                      {/* 数据列 */}
                                      {item.data.map((cell, index) => (
                                        <td
                                          key={index}
                                          className="p-3 text-center text-sm border-y border-r border-border/20 bg-background min-w-[max-content]"
                                        >
                                          {cell}
                                        </td>
                                      ))}
                                      {/* 操作列 */}
                                      <td className="p-3 text-center border border-border/20 bg-background min-w-[40px]">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10"
                                          onClick={() => handleRemoveFromCategory(category.id, group.id, item.id)}
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                          </div>
                        ))}

                        {/* 添加新组按钮 */}
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

      {/* 删除组对话框 */}
      <Dialog open={isDeleteGroupDialogOpen} onOpenChange={setIsDeleteGroupDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>删除分组</DialogTitle>
            <DialogDescription>
              确定要删除该分组吗？分组内的所有数据将自动返回至「导入数据」区。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">此操作不可撤销，请确认后执行。</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteGroupDialogOpen(false)}>取消</Button>
            <Button className="bg-destructive hover:bg-destructive/90 text-destructive-foreground" onClick={handleConfirmDeleteGroup}>
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
