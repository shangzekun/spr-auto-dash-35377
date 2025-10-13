import { useState, useEffect, useRef } from "react";
import { Upload, FileText, Plus, Trash2, Edit3, Save, FolderOpen, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiSelect } from "@/components/ui/multi-select";
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
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const columnWidthsRef = useRef<Record<string, Record<string, number[]>>>({});
  const baseColumnWidthsRef = useRef<number[]>([]); // 存储导入数据栏的列宽作为基准

  // 同步所有分组列宽到基准列宽
  const syncAllGroupWidthsToBase = () => {
    if (baseColumnWidthsRef.current.length === 0) return;
    
    const updatedCategories = [...categories];
    updatedCategories.forEach((category, catIndex) => {
      category.groups.forEach((group, groupIndex) => {
        // 强制使用基准列宽更新当前分组
        if (!columnWidthsRef.current[category.id]) {
          columnWidthsRef.current[category.id] = {};
        }
        columnWidthsRef.current[category.id][group.id] = [...baseColumnWidthsRef.current];
        
        // 浅拷贝触发更新
        updatedCategories[catIndex].groups[groupIndex] = {
          ...group,
          items: [...group.items]
        };
      });
    });
    setCategories(updatedCategories);
  };

  // 初始化列宽
  useEffect(() => {
    // 1. 先计算导入数据栏的列宽作为基准
    const baseWidths = calculateColumnWidths(dataRows);
    baseColumnWidthsRef.current = baseWidths;
    if (!columnWidthsRef.current["dataRows"]) {
      columnWidthsRef.current["dataRows"] = {};
    }
    columnWidthsRef.current["dataRows"]["default"] = baseWidths;
    
    // 2. 强制同步所有分组列宽到基准列宽
    syncAllGroupWidthsToBase();
  }, []);

  // 当导入数据栏列宽变化时，同步更新所有分组
  useEffect(() => {
    if (dataRows.length > 0) {
      const baseWidths = calculateColumnWidths(dataRows);
      baseColumnWidthsRef.current = baseWidths;
      if (!columnWidthsRef.current["dataRows"]) {
        columnWidthsRef.current["dataRows"] = {};
      }
      columnWidthsRef.current["dataRows"]["default"] = baseWidths;
      
      // 强制同步所有分组列宽
      syncAllGroupWidthsToBase();
    }
  }, [dataRows]);

  // 计算列宽 - 强制参考基准列宽
  const calculateColumnWidths = (items: Array<{ id: string; data: string[] }>) => {
    const minBaseWidth = 80;
    const widths = new Array(dataHeaders.length + 2).fill(0);
    widths[0] = 70; // 序号列固定宽度
    widths[widths.length - 1] = 60; // 操作列固定宽度

    // 计算标题宽度
    dataHeaders.forEach((header, index) => {
      const tempSpan = document.createElement('span');
      tempSpan.style.visibility = 'hidden';
      tempSpan.style.position = 'absolute';
      tempSpan.style.whiteSpace = 'nowrap';
      tempSpan.style.fontSize = '0.875rem';
      tempSpan.style.fontFamily = 'inherit';
      tempSpan.textContent = header;
      document.body.appendChild(tempSpan);
      
      const headerWidth = tempSpan.offsetWidth + 20; // 增加内边距
      document.body.removeChild(tempSpan);
      
      widths[index + 1] = Math.max(headerWidth, minBaseWidth);
    });

    // 计算内容宽度（如果有数据）
    if (items.length > 0) {
      items.forEach(item => {
        item.data.forEach((cell, index) => {
          const tempSpan = document.createElement('span');
          tempSpan.style.visibility = 'hidden';
          tempSpan.style.position = 'absolute';
          tempSpan.style.whiteSpace = 'nowrap';
          tempSpan.style.fontSize = '0.875rem';
          tempSpan.style.fontFamily = 'inherit';
          tempSpan.textContent = cell || ' ';
          document.body.appendChild(tempSpan);
          
          const cellWidth = tempSpan.offsetWidth + 20; // 增加内边距
          document.body.removeChild(tempSpan);
          
          if (cellWidth > widths[index + 1]) {
            widths[index + 1] = cellWidth;
          }
        });
      });
    }

    // 强制参考基准列宽（即使是空数据）
    if (baseColumnWidthsRef.current.length > 0) {
      return widths.map((w, i) => Math.max(w, baseColumnWidthsRef.current[i] || w));
    }
    return widths;
  };

  // 更新分类列宽 - 强制使用基准列宽
  const updateCategoryColumnWidths = (categoryId: string, groupId: string, updatedItems: Array<{ id: string; data: string[] }>) => {
    let widths = calculateColumnWidths(updatedItems);
    
    // 强制覆盖为基准列宽
    if (baseColumnWidthsRef.current.length > 0) {
      widths = [...baseColumnWidthsRef.current];
    }
    
    if (!columnWidthsRef.current[categoryId]) {
      columnWidthsRef.current[categoryId] = {};
    }
    columnWidthsRef.current[categoryId][groupId] = widths;
  };

  /** 拖拽开始 */
  const handleDragStart = (e: React.DragEvent, rowId: string, data: string[], source: string, groupId?: string) => {
    setDraggedItem({ id: rowId, data, source, groupId });
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", rowId);
    mainContentRef.current?.focus();
    document.body.classList.add('dragging-active');
  };

  /** 拖拽结束 */
  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedItem(null);
    document.body.classList.remove('dragging-active');
  };

  /** 拖拽到组 */
  const handleDrop = (e: React.DragEvent, categoryId: string, groupId?: string) => {
    e.preventDefault();
    if (!draggedItem || !groupId) return;

    const updatedCategories = [...categories];
    let updatedItems: Array<{ id: string; data: string[] }> = [];
    
    // 从原组中移除数据
    if (draggedItem.source !== "dataRows" && draggedItem.groupId) {
      const sourceCatIndex = updatedCategories.findIndex(cat => cat.id === draggedItem.source);
      if (sourceCatIndex !== -1) {
        updatedCategories[sourceCatIndex].groups = updatedCategories[sourceCatIndex].groups.map(g => {
          if (g.id === draggedItem.groupId) {
            const updatedSourceItems = g.items.filter(item => item.id !== draggedItem.id);
            updateCategoryColumnWidths(draggedItem.source, draggedItem.groupId, updatedSourceItems);
            return { ...g, items: updatedSourceItems };
          }
          return g;
        });
      }
    }

    // 向目标组添加数据
    const targetCatIndex = updatedCategories.findIndex(cat => cat.id === categoryId);
    if (targetCatIndex !== -1) {
      const targetCategory = { ...updatedCategories[targetCatIndex] };
      
      if (targetCategory.hasGroups && groupId) {
        targetCategory.groups = targetCategory.groups.map(g => {
          if (g.id === groupId) {
            updatedItems = [...g.items, { id: draggedItem.id, data: draggedItem.data }];
            updateCategoryColumnWidths(categoryId, groupId, updatedItems);
            return { ...g, items: updatedItems };
          }
          return g;
        });
      } else if (!targetCategory.hasGroups) {
        updatedItems = [...(targetCategory.groups[0]?.items || []), { id: draggedItem.id, data: draggedItem.data }];
        updateCategoryColumnWidths(categoryId, "default", updatedItems);
        targetCategory.groups = [{ 
          id: "default", 
          items: updatedItems 
        }];
      }
      
      updatedCategories[targetCatIndex] = targetCategory;
    }

    // 源为导入表时删除原行
    if (draggedItem.source === "dataRows") {
      setDataRows(prev => prev.filter(row => row.id !== draggedItem.id));
      const remainingRows = dataRows.filter(row => row.id !== draggedItem.id);
      if (!columnWidthsRef.current["dataRows"]) {
        columnWidthsRef.current["dataRows"] = {};
      }
      columnWidthsRef.current["dataRows"]["default"] = calculateColumnWidths(remainingRows);
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

    // 组内数据放回导入区
    const category = categories.find(cat => cat.id === categoryId);
    const group = category?.groups.find(g => g.id === groupId);
    if (group?.items.length) {
      setDataRows(prev => [...prev, ...group.items]);
      if (!columnWidthsRef.current["dataRows"]) {
        columnWidthsRef.current["dataRows"] = {};
      }
      columnWidthsRef.current["dataRows"]["default"] = calculateColumnWidths([...dataRows, ...group.items]);
    }

    // 删除组并清除列宽缓存
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? { ...cat, groups: cat.groups.filter(g => g.id !== groupId) }
          : cat
      )
    );
    
    if (columnWidthsRef.current[categoryId]) {
      delete columnWidthsRef.current[categoryId][groupId];
      if (Object.keys(columnWidthsRef.current[categoryId]).length === 0) {
        delete columnWidthsRef.current[categoryId];
      }
    }

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

    const updatedGroups = categories.map(cat =>
      cat.id === categoryId
        ? {
            ...cat,
            groups: cat.groups.map(g =>
              g.id === groupId 
                ? { ...g, items: g.items.filter(i => i.id !== itemId) } 
                : g
            )
          }
        : cat
    );

    setCategories(updatedGroups);
    setDataRows(prev => [...prev, item]);

    // 更新列宽
    const updatedGroupItems = group.items.filter(i => i.id !== itemId);
    updateCategoryColumnWidths(categoryId, groupId, updatedGroupItems);
    if (!columnWidthsRef.current["dataRows"]) {
      columnWidthsRef.current["dataRows"] = {};
    }
    columnWidthsRef.current["dataRows"]["default"] = calculateColumnWidths([...dataRows, item]);
  };

  /** 添加新组 */
  const handleAddGroup = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    const groupCount = category?.groups.length || 0;
    const newGroupId = `group-${Date.now()}`;
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? { 
              ...cat, 
              groups: [...cat.groups, { id: newGroupId, items: [] }] 
            }
          : cat
      )
    );
    
    // 新组直接使用基准列宽
    if (!columnWidthsRef.current[categoryId]) {
      columnWidthsRef.current[categoryId] = {};
    }
    columnWidthsRef.current[categoryId][newGroupId] = [...baseColumnWidthsRef.current];
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

  /** 单行移动到指定分组 */
  const handleMoveToGroup = (rowId: string, rowData: string[], categoryId: string, groupId: string) => {
    const updatedCategories = [...categories];
    const targetCatIndex = updatedCategories.findIndex(cat => cat.id === categoryId);
    
    if (targetCatIndex !== -1) {
      const targetCategory = { ...updatedCategories[targetCatIndex] };
      
      if (targetCategory.hasGroups && groupId) {
        targetCategory.groups = targetCategory.groups.map(g => {
          if (g.id === groupId) {
            const updatedItems = [...g.items, { id: rowId, data: rowData }];
            updateCategoryColumnWidths(categoryId, groupId, updatedItems);
            return { ...g, items: updatedItems };
          }
          return g;
        });
      } else if (!targetCategory.hasGroups) {
        const updatedItems = [...(targetCategory.groups[0]?.items || []), { id: rowId, data: rowData }];
        updateCategoryColumnWidths(categoryId, "default", updatedItems);
        targetCategory.groups = [{ id: "default", items: updatedItems }];
      }
      
      updatedCategories[targetCatIndex] = targetCategory;
    }

    setCategories(updatedCategories);
    setDataRows(prev => prev.filter(row => row.id !== rowId));
    const remainingRows = dataRows.filter(row => row.id !== rowId);
    if (!columnWidthsRef.current["dataRows"]) {
      columnWidthsRef.current["dataRows"] = {};
    }
    columnWidthsRef.current["dataRows"]["default"] = calculateColumnWidths(remainingRows);
    toast.success("数据已添加到分组");
  };

  /** 批量移动到指定分组 */
  const handleBatchMove = (categoryId: string, groupId: string) => {
    const selectedItems = dataRows.filter(row => selectedRows.includes(row.id));
    const updatedCategories = [...categories];
    const targetCatIndex = updatedCategories.findIndex(cat => cat.id === categoryId);
    
    if (targetCatIndex !== -1) {
      const targetCategory = { ...updatedCategories[targetCatIndex] };
      
      if (targetCategory.hasGroups && groupId) {
        targetCategory.groups = targetCategory.groups.map(g => {
          if (g.id === groupId) {
            const updatedItems = [...g.items, ...selectedItems];
            updateCategoryColumnWidths(categoryId, groupId, updatedItems);
            return { ...g, items: updatedItems };
          }
          return g;
        });
      } else if (!targetCategory.hasGroups) {
        const updatedItems = [...(targetCategory.groups[0]?.items || []), ...selectedItems];
        updateCategoryColumnWidths(categoryId, "default", updatedItems);
        targetCategory.groups = [{ id: "default", items: updatedItems }];
      }
      
      updatedCategories[targetCatIndex] = targetCategory;
    }

    setCategories(updatedCategories);
    setDataRows(prev => prev.filter(row => !selectedRows.includes(row.id)));
    setSelectedRows([]);
    const remainingRows = dataRows.filter(row => !selectedRows.includes(row.id));
    if (!columnWidthsRef.current["dataRows"]) {
      columnWidthsRef.current["dataRows"] = {};
    }
    columnWidthsRef.current["dataRows"]["default"] = calculateColumnWidths(remainingRows);
    toast.success(`已批量移动 ${selectedItems.length} 条数据`);
  };

  /** 拖拽时滚动处理 */
  useEffect(() => {
    if (!isDragging) return;

    // 鼠标边缘自动滚动
    const handleMouseMove = (e: MouseEvent) => {
      const scrollSpeed = 8;
      const edgeThreshold = 80;
      const windowHeight = window.innerHeight;
      const mouseY = e.clientY;

      if (mouseY < edgeThreshold) {
        window.scrollBy({ top: -scrollSpeed, behavior: 'smooth' });
      } else if (mouseY > windowHeight - edgeThreshold) {
        window.scrollBy({ top: scrollSpeed, behavior: 'smooth' });
      }
    };

    // 滚轮滚动处理
    const handleWheel = (e: WheelEvent) => {
      const scrollAmount = e.deltaY > 0 ? 20 : -20;
      window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("wheel", handleWheel, { passive: false });

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
                  className={`p-4 rounded-lg border cursor-pointer transition-smooth ${
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
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
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
          </div>

          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* 1. 导入数据 */}
            {dataRows.length > 0 && (
              <Card className="border-border/50 shadow-card hover:shadow-elegant transition-smooth overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">导入数据</CardTitle>
                  {selectedRows.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">已选 {selectedRows.length} 条</span>
                      <MultiSelect
                        options={categories.flatMap(cat => 
                          cat.hasGroups 
                            ? cat.groups.map((g, idx) => ({ 
                                label: `${cat.title} - 分组${idx + 1}`, 
                                value: `${cat.id}:${g.id}` 
                              }))
                            : [{ label: cat.title, value: `${cat.id}:default` }]
                        )}
                        selected={[]}
                        onChange={(values) => {
                          if (values.length > 0) {
                            const [categoryId, groupId] = values[0].split(':');
                            handleBatchMove(categoryId, groupId);
                          }
                        }}
                        placeholder="批量移动到..."
                      />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-4">
                  <div className="overflow-x-auto w-fit">
                    <table className="border-collapse">
                      <thead>
                        <tr>
                          <th className="p-3 bg-primary/10 text-center font-medium text-sm rounded-l-lg" style={{ width: 50 }}>
                            <Checkbox
                              checked={selectedRows.length === dataRows.length}
                              onCheckedChange={(checked) => {
                                setSelectedRows(checked ? dataRows.map(r => r.id) : []);
                              }}
                            />
                          </th>
                          <th 
                            className="p-3 bg-primary/10 text-center font-medium text-sm"
                            style={{ 
                              width: baseColumnWidthsRef.current[0] || 70,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            序号
                          </th>
                          {dataHeaders.map((header, index) => (
                            <th
                              key={index}
                              className="p-3 bg-primary/10 text-center font-medium text-sm"
                              style={{ 
                                width: baseColumnWidthsRef.current[index + 1] || 'auto',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {header}
                            </th>
                          ))}
                          <th 
                            className="p-3 bg-primary/10 text-center font-medium text-sm rounded-r-lg"
                            style={{ 
                              width: 120,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataRows.map((row, rowIndex) => (
                          <tr
                            key={row.id}
                            className={`transition-all duration-200 rounded-lg hover:bg-primary/5 ${
                              selectedRows.includes(row.id) ? 'bg-primary/10' : ''
                            }`}
                          >
                            <td className="p-3 text-center" style={{ width: 50 }}>
                              <Checkbox
                                checked={selectedRows.includes(row.id)}
                                onCheckedChange={(checked) => {
                                  setSelectedRows(prev => 
                                    checked 
                                      ? [...prev, row.id]
                                      : prev.filter(id => id !== row.id)
                                  );
                                }}
                              />
                            </td>
                            <td 
                              className="p-3 text-center text-sm"
                              style={{ 
                                width: baseColumnWidthsRef.current[0] || 70,
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {rowIndex + 1}
                            </td>
                            {row.data.map((cell, index) => (
                              <td
                                key={index}
                                className="p-3 text-center text-sm"
                                style={{ 
                                  width: baseColumnWidthsRef.current[index + 1] || 'auto',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {cell}
                              </td>
                            ))}
                            <td 
                              className="p-3 text-center"
                              style={{ 
                                width: 120,
                                whiteSpace: 'nowrap'
                              }}
                            >
                              <MultiSelect
                                options={categories.flatMap(cat => 
                                  cat.hasGroups 
                                    ? cat.groups.map((g, idx) => ({ 
                                        label: `${cat.title} - 分组${idx + 1}`, 
                                        value: `${cat.id}:${g.id}` 
                                      }))
                                    : [{ label: cat.title, value: `${cat.id}:default` }]
                                )}
                                selected={[]}
                                onChange={(values) => {
                                  if (values.length > 0) {
                                    const [categoryId, groupId] = values[0].split(':');
                                    handleMoveToGroup(row.id, row.data, categoryId, groupId);
                                  }
                                }}
                                placeholder="添加到..."
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 2. 分类分组 */}
            <div className="space-y-6">
              {categories.map(category => (
                <Card key={category.id} className="border-border/50 shadow-card hover:shadow-elegant transition-smooth overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="overflow-x-auto w-fit">
                      <table className="border-collapse mb-4">
                        <thead>
                          <tr>
                            <th 
                              className="p-3 bg-primary/10 text-center font-medium text-sm rounded-l-lg"
                              style={{ 
                                width: baseColumnWidthsRef.current[0] || 70,
                                whiteSpace: 'nowrap'
                              }}
                            >
                              序号
                            </th>
                            {dataHeaders.map((header, index) => (
                              <th
                                key={index}
                                className="p-3 bg-primary/10 text-center font-medium text-sm"
                                style={{ 
                                  width: baseColumnWidthsRef.current[index + 1] || 'auto',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {header}
                              </th>
                            ))}
                            <th 
                              className="p-3 bg-primary/10 text-center font-medium text-sm rounded-r-lg"
                              style={{ 
                                width: baseColumnWidthsRef.current[dataHeaders.length + 1] || 60,
                                whiteSpace: 'nowrap'
                              }}
                            >
                              &nbsp;
                            </th>
                          </tr>
                        </thead>
                      </table>

                      <div className="space-y-4">
                        {category.groups.map((group, groupIndex) => (
                          <div
                            key={group.id}
                            onDrop={(e) => handleDrop(e, category.id, group.id)}
                            onDragOver={handleDragOver}
                            className="border-2 border-dashed border-border/50 rounded-lg p-4 pt-6 pb-2 min-h-32 relative"
                          >
                            {/* 组编号与数量显示在左上角 */}
                            <div className="absolute top-2 left-2 flex items-center gap-2">
                              <span className="text-xs font-medium text-muted-foreground">
                                组{groupIndex + 1}
                              </span>
                              {group.items.length > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  {group.items.length} 条
                                </Badge>
                              )}
                            </div>
                            
                            {/* 删除按钮显示在右上角，不占一行 */}
                            {category.hasGroups && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-2 right-2 h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                                onClick={() => handleOpenDeleteGroupDialog(category.id, group.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}

                            {group.items.length === 0 ? (
                              <p className="text-muted-foreground text-sm text-center py-6">
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
                                      className="cursor-move transition-all duration-200 rounded-lg hover:border-primary hover:border-2 hover:bg-primary/5"
                                      style={{ 
                                        borderRadius: '6px',
                                        transition: 'all 0.2s ease'
                                      }}
                                    >
                                      <td 
                                        className="p-3 text-center text-sm"
                                        style={{ 
                                          width: baseColumnWidthsRef.current[0] || 70,
                                          whiteSpace: 'nowrap'
                                        }}
                                      >
                                        {itemIndex + 1}
                                      </td>
                                      {item.data.map((cell, index) => (
                                        <td
                                          key={index}
                                          className="p-3 text-center text-sm"
                                          style={{ 
                                            width: baseColumnWidthsRef.current[index + 1] || 'auto',
                                            whiteSpace: 'nowrap'
                                          }}
                                        >
                                          {cell}
                                        </td>
                                      ))}
                                      <td 
                                        className="p-3 text-center"
                                        style={{ 
                                          width: baseColumnWidthsRef.current[dataHeaders.length + 1] || 60,
                                          whiteSpace: 'nowrap'
                                        }}
                                      >
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

                        {category.hasGroups && (
                          <div
                            onClick={() => handleAddGroup(category.id)}
                            className="border-2 border-dashed border-border/50 rounded-lg p-2 min-h-16 flex items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-smooth group"
                          >
                            <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-smooth">
                              <Plus className="w-4 h-4" />
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
              <label className="text-sm font-medium">项目名称（建议名称：项目名+项目阶段）</label>
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
