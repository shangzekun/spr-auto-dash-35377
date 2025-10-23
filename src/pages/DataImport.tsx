import { useState, useEffect, useRef } from "react";
import { Upload, FileText, Plus, Trash2, Edit3, Save, FolderOpen, Check, X, User, Users, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiSelect } from "@/components/ui/multi-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const mockProjects = [
  { 
    id: "1", 
    name: "Qinling", 
    status: "active", 
    dataCount: 1247,
    description: "秦岭项目是公司核心研发项目，专注于高强度钢材铆接工艺研究",
    creator: "张伟",
    createdAt: "2024-01-15",
    participants: ["张伟", "李明", "王芳", "刘强"]
  },
  { 
    id: "2", 
    name: "Pisces", 
    status: "active", 
    dataCount: 856,
    description: "双鱼座项目专注于轻量化材料应用研究",
    creator: "李明",
    createdAt: "2024-03-20",
    participants: ["李明", "赵敏", "孙健"]
  },
  { 
    id: "3", 
    name: "Dom G1.6", 
    status: "inactive", 
    dataCount: 234,
    description: "G1.6代工艺优化项目",
    creator: "王芳",
    createdAt: "2023-11-08",
    participants: ["王芳", "周杰"]
  }
];

// 每个项目的历史分析记录
const mockAnalysisHistory: Record<string, Array<{
  id: string;
  module: string;
  analyst: string;
  result: string;
  modelVersion: string;
  analysisDate: string;
  status: "success" | "warning" | "failed";
}>> = {
  "1": [
    { id: "a1", module: "强度分析", analyst: "张伟", result: "合格 - 强度满足设计要求", modelVersion: "v2.3.1", analysisDate: "2024-10-15 14:30", status: "success" },
    { id: "a2", module: "疲劳寿命", analyst: "李明", result: "良好 - 预计寿命>10万次", modelVersion: "v2.3.1", analysisDate: "2024-10-14 09:15", status: "success" },
    { id: "a3", module: "应力分布", analyst: "王芳", result: "警告 - 局部应力集中", modelVersion: "v2.2.8", analysisDate: "2024-10-13 16:45", status: "warning" },
    { id: "a4", module: "材料匹配", analyst: "刘强", result: "优秀 - 材料组合最优", modelVersion: "v2.3.0", analysisDate: "2024-10-12 11:20", status: "success" },
  ],
  "2": [
    { id: "b1", module: "重量优化", analyst: "李明", result: "达标 - 减重15%", modelVersion: "v2.3.1", analysisDate: "2024-10-20 10:00", status: "success" },
    { id: "b2", module: "成本分析", analyst: "赵敏", result: "合理 - 成本降低8%", modelVersion: "v2.3.0", analysisDate: "2024-10-18 15:30", status: "success" },
    { id: "b3", module: "工艺可行性", analyst: "孙健", result: "可行 - 现有设备可生产", modelVersion: "v2.2.9", analysisDate: "2024-10-17 14:10", status: "success" },
  ],
  "3": [
    { id: "c1", module: "工艺参数", analyst: "王芳", result: "需优化 - 温度控制不稳定", modelVersion: "v2.1.5", analysisDate: "2024-09-25 13:40", status: "warning" },
    { id: "c2", module: "质量检测", analyst: "周杰", result: "失败 - 检出率低于标准", modelVersion: "v2.1.5", analysisDate: "2024-09-20 09:50", status: "failed" },
  ]
};

const dataHeaders = ["Material 1", "Material 2", "Material 3", "Gauge 1", "Gauge 2", "Gauge 3", "Rivet", "Die"];

const mockDataRows = [
  { id: "1", data: ["LAC340Y410T", "6000-BR", "", "1.2", "1.5", "", "C5.3x5.0H2", "M260238"] },
  { id: "2", data: ["6000-BR", "6000-BR", "", "2.0", "2.0", "", "C5.3x6.0H2", "M260468"] },
  { id: "3", data: ["DPC420Y780T", "DC-N2 F", "", "1.8", "3.0", "", "HSS5.5x6.0H5", "M260406"] },
  { id: "4", data: ["LAC340Y410T", "LAC340Y410T", "DC-N2 F", "1.5", "1.2", "3.0", "C5.3x7.0H4", "M260412"] },
  { id: "5", data: ["HC340LA", "6000-BR", "", "1.0", "1.8", "", "C5.3x5.5H2", "M260301"] },
  { id: "6", data: ["DPC420Y780T", "LAC340Y410T", "", "1.5", "1.5", "", "HSS5.5x5.0H3", "M260502"] },
  { id: "7", data: ["6000-BR", "DC-N2 F", "HC340LA", "2.0", "2.5", "1.0", "C5.3x6.5H4", "M260618"] },
  { id: "8", data: ["LAC340Y410T", "DPC420Y780T", "", "1.2", "1.8", "", "HSS5.5x6.5H5", "M260721"] },
  { id: "9", data: ["DC-N2 F", "6000-BR", "", "3.0", "2.0", "", "C5.3x7.5H3", "M260834"] },
  { id: "10", data: ["HC340LA", "LAC340Y410T", "", "1.0", "1.5", "", "C5.3x5.0H2", "M260945"] },
  { id: "11", data: ["DPC420Y780T", "6000-BR", "DC-N2 F", "1.8", "2.0", "2.5", "HSS5.5x7.0H6", "M261056"] },
  { id: "12", data: ["LAC340Y410T", "HC340LA", "", "1.5", "1.0", "", "C5.3x6.0H3", "M261167"] },
  { id: "13", data: ["6000-BR", "DPC420Y780T", "", "2.0", "1.8", "", "HSS5.5x5.5H4", "M261278"] },
  { id: "14", data: ["DC-N2 F", "LAC340Y410T", "6000-BR", "2.5", "1.2", "2.0", "C5.3x8.0H5", "M261389"] },
  { id: "15", data: ["HC340LA", "DPC420Y780T", "", "1.0", "1.8", "", "HSS5.5x6.0H3", "M261490"] }
];

type CategoryGroup = {
  id: string;
  name: string; // 组名
  items: Array<{ id: string; data: string[] }>;
  selectedItems: string[];
};

type Category = {
  id: string;
  title: string;
  groups: CategoryGroup[];
  hasGroups: boolean;
  allSelected: boolean;
  partiallySelected: boolean;
};

const initialCategories: Category[] = [
  { id: "recommended", title: "默认推荐", groups: [{ id: "default", name: "默认组", items: [], selectedItems: [] }], hasGroups: false, allSelected: false, partiallySelected: false },
  { id: "double-pin", title: "双钉共模", groups: [{ id: "group-1", name: "分组1", items: [], selectedItems: [] }], hasGroups: true, allSelected: false, partiallySelected: false },
  { id: "shared-pin", title: "共钉共模", groups: [{ id: "group-1", name: "分组1", items: [], selectedItems: [] }], hasGroups: true, allSelected: false, partiallySelected: false }
];

export default function DataImport() {
  const [selectedProject, setSelectedProject] = useState("1");
  const [projects, setProjects] = useState(mockProjects);
  const [activeTab, setActiveTab] = useState("data-management");
  
  // 每个项目有独立的数据状态
  const [projectDataState, setProjectDataState] = useState<Record<string, {
    dataRows: Array<{ id: string; data: string[] }>;
    categories: Category[];
    selectedRows: string[];
  }>>({
    "1": { dataRows: mockDataRows.slice(0, 5), categories: initialCategories, selectedRows: [] },
    "2": { dataRows: mockDataRows.slice(5, 10), categories: initialCategories, selectedRows: [] },
    "3": { dataRows: mockDataRows.slice(10, 15), categories: initialCategories, selectedRows: [] },
  });
  
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [isEditProjectDialogOpen, setIsEditProjectDialogOpen] = useState(false);
  const [isDeleteGroupDialogOpen, setIsDeleteGroupDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingProjectName, setEditingProjectName] = useState("");
  const [deleteGroupInfo, setDeleteGroupInfo] = useState<{ categoryId: string; groupId: string } | null>(null);
  const [allDataSelected, setAllDataSelected] = useState(false);
  const [partiallyDataSelected, setPartiallyDataSelected] = useState(false);
  const [deleteDataDialogOpen, setDeleteDataDialogOpen] = useState(false);
  const [dataToDelete, setDataToDelete] = useState<string | null>(null);
  // 组名编辑状态
  const [editingGroupName, setEditingGroupName] = useState<{ categoryId: string; groupId: string; name: string } | null>(null);
  const groupNameInputRef = useRef<HTMLInputElement>(null);
  
  const mainContentRef = useRef<HTMLDivElement>(null);
  const columnWidthsRef = useRef<Record<string, Record<string, number[]>>>({});
  const baseColumnWidthsRef = useRef<number[]>([]);
  
  // 获取当前项目的数据
  const currentProjectData = projectDataState[selectedProject] || { dataRows: [], categories: initialCategories, selectedRows: [] };
  const dataRows = currentProjectData.dataRows;
  const categories = currentProjectData.categories;
  const selectedRows = currentProjectData.selectedRows;
  
  // 更新当前项目的数据
  const updateProjectData = (updates: Partial<typeof currentProjectData>) => {
    setProjectDataState(prev => ({
      ...prev,
      [selectedProject]: { ...prev[selectedProject], ...updates }
    }));
  };
  
  // 当切换项目时，切换到数据管理标签
  useEffect(() => {
    setActiveTab("data-management");
  }, [selectedProject]);

  // 更新分类的选中状态
  const updateCategorySelectionState = (categoryId: string) => {
    updateProjectData({
      categories: categories.map((cat, catIndex) => {
        if (cat.id !== categoryId) return cat;
        
        const allItemsCount = cat.groups.reduce((sum, group) => sum + group.items.length, 0);
        const allSelectedCount = cat.groups.reduce((sum, group) => sum + group.selectedItems.length, 0);
        
        return {
          ...cat,
          allSelected: allItemsCount > 0 && allItemsCount === allSelectedCount,
          partiallySelected: allSelectedCount > 0 && allSelectedCount < allItemsCount
        };
      })
    });
  };

  // 处理分类中项目的选择
  const handleCategoryItemSelect = (categoryId: string, groupId: string, itemId: string, checked: boolean) => {
    updateProjectData({
      categories: categories.map(cat => {
        if (cat.id !== categoryId) return cat;
        
        return {
          ...cat,
          groups: cat.groups.map(group => {
            if (group.id !== groupId) return group;
            
            const updatedSelected = checked 
              ? [...group.selectedItems, itemId]
              : group.selectedItems.filter(id => id !== itemId);
            return { ...group, selectedItems: updatedSelected };
          })
        };
      })
    });
    
    setTimeout(() => updateCategorySelectionState(categoryId), 0);
  };

  // 处理分类的全选
  const handleCategorySelectAll = (categoryId: string, checked: boolean) => {
    updateProjectData({
      categories: categories.map(cat => {
        if (cat.id !== categoryId) return cat;
        
        return {
          ...cat,
          groups: cat.groups.map(group => ({
            ...group,
            selectedItems: checked ? group.items.map(item => item.id) : []
          })),
          allSelected: checked,
          partiallySelected: false
        };
      })
    });
  };

  // 处理分组的全选
  const handleGroupSelectAll = (categoryId: string, groupId: string, checked: boolean) => {
    updateProjectData({
      categories: categories.map(cat => {
        if (cat.id !== categoryId) return cat;
        
        return {
          ...cat,
          groups: cat.groups.map(group => {
            if (group.id !== groupId) return group;
            
            return {
              ...group,
              selectedItems: checked ? group.items.map(item => item.id) : []
            };
          })
        };
      })
    });
    
    setTimeout(() => updateCategorySelectionState(categoryId), 0);
  };

  // 更新导入数据的选择状态
  useEffect(() => {
    setAllDataSelected(dataRows.length > 0 && selectedRows.length === dataRows.length);
    setPartiallyDataSelected(selectedRows.length > 0 && selectedRows.length < dataRows.length);
  }, [selectedRows, dataRows, selectedProject]);

  // 同步所有分组列宽到基准列宽
  const syncAllGroupWidthsToBase = () => {
    if (baseColumnWidthsRef.current.length === 0) return;
    
    const updatedCategories = categories.map(category => ({
      ...category,
      groups: category.groups.map(group => {
        if (!columnWidthsRef.current[category.id]) {
          columnWidthsRef.current[category.id] = {};
        }
        columnWidthsRef.current[category.id][group.id] = [...baseColumnWidthsRef.current];
        
        return { ...group, items: [...group.items] };
      })
    }));
    
    updateProjectData({ categories: updatedCategories });
  };

  // 初始化列宽
  useEffect(() => {
    const baseWidths = calculateColumnWidths(dataRows);
    baseColumnWidthsRef.current = baseWidths;
    if (!columnWidthsRef.current["dataRows"]) {
      columnWidthsRef.current["dataRows"] = {};
    }
    columnWidthsRef.current["dataRows"]["default"] = baseWidths;
    
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
      
      syncAllGroupWidthsToBase();
    }
  }, [dataRows]);

  // 计算列宽
  const calculateColumnWidths = (items: Array<{ id: string; data: string[] }>) => {
    const minBaseWidth = 80;
    const widths = new Array(dataHeaders.length + 3).fill(0);
    widths[0] = 50; // 选择框列固定宽度
    widths[1] = 70; // 序号列固定宽度
    widths[widths.length - 1] = 120; // 操作列固定宽度

    dataHeaders.forEach((header, index) => {
      const tempSpan = document.createElement('span');
      tempSpan.style.visibility = 'hidden';
      tempSpan.style.position = 'absolute';
      tempSpan.style.whiteSpace = 'nowrap';
      tempSpan.style.fontSize = '0.875rem';
      tempSpan.style.fontFamily = 'inherit';
      tempSpan.textContent = header;
      document.body.appendChild(tempSpan);
      
      const headerWidth = tempSpan.offsetWidth + 20;
      document.body.removeChild(tempSpan);
      
      widths[index + 2] = Math.max(headerWidth, minBaseWidth);
    });

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
          
          const cellWidth = tempSpan.offsetWidth + 20;
          document.body.removeChild(tempSpan);
          
          if (cellWidth > widths[index + 2]) {
            widths[index + 2] = cellWidth;
          }
        });
      });
    }

    if (baseColumnWidthsRef.current.length > 0) {
      return widths.map((w, i) => Math.max(w, baseColumnWidthsRef.current[i] || w));
    }
    return widths;
  };

  // 更新分类列宽
  const updateCategoryColumnWidths = (categoryId: string, groupId: string, updatedItems: Array<{ id: string; data: string[] }>) => {
    let widths = calculateColumnWidths(updatedItems);
    
    if (baseColumnWidthsRef.current.length > 0) {
      widths = [...baseColumnWidthsRef.current];
    }
    
    if (!columnWidthsRef.current[categoryId]) {
      columnWidthsRef.current[categoryId] = {};
    }
    columnWidthsRef.current[categoryId][groupId] = widths;
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

    const category = categories.find(cat => cat.id === categoryId);
    const group = category?.groups.find(g => g.id === groupId);
    if (group?.items.length) {
      updateProjectData({ dataRows: [...dataRows, ...group.items] });
      if (!columnWidthsRef.current["dataRows"]) {
        columnWidthsRef.current["dataRows"] = {};
      }
      columnWidthsRef.current["dataRows"]["default"] = calculateColumnWidths([...dataRows, ...group.items]);
    }

    updateProjectData({
      categories: categories.map(cat =>
        cat.id === categoryId
          ? { ...cat, groups: cat.groups.filter(g => g.id !== groupId) }
          : cat
      )
    });
    
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

  /** 从组中移除单行（移回导入区） */
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
                ? { 
                    ...g, 
                    items: g.items.filter(i => i.id !== itemId), // 从原分组删除
                    selectedItems: g.selectedItems.filter(id => id !== itemId)
                  } 
                : g
            )
          }
        : cat
    );

    updateProjectData({ 
      categories: updatedGroups,
      dataRows: [...dataRows, item]
    });

    const updatedGroupItems = group.items.filter(i => i.id !== itemId);
    updateCategoryColumnWidths(categoryId, groupId, updatedGroupItems);
    if (!columnWidthsRef.current["dataRows"]) {
      columnWidthsRef.current["dataRows"] = {};
    }
    columnWidthsRef.current["dataRows"]["default"] = calculateColumnWidths([...dataRows, item]);
    
    updateCategorySelectionState(categoryId);
    toast.success("数据已移回导入区");
  };

  /** 从分类中批量移除选中数据（移回导入区） */
  const handleBulkRemoveFromCategory = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;
    
    const selectedItems: Array<{ id: string; data: string[] }> = [];
    
    const updatedCategories = categories.map(cat => {
      if (cat.id !== categoryId) return cat;
      
      const updatedGroups = cat.groups.map(group => {
        const itemsToRemove = group.items.filter(item => group.selectedItems.includes(item.id));
        selectedItems.push(...itemsToRemove);
        
        // 从原分组删除选中数据
        return {
          ...group,
          items: group.items.filter(item => !group.selectedItems.includes(item.id)),
          selectedItems: []
        };
      });
      
      return {
        ...cat,
        groups: updatedGroups,
        allSelected: false,
        partiallySelected: false
      };
    });
    
    updateProjectData({
      dataRows: [...dataRows, ...selectedItems],
      categories: updatedCategories
    });
    
    if (selectedItems.length > 0) {
      if (!columnWidthsRef.current["dataRows"]) {
        columnWidthsRef.current["dataRows"] = {};
      }
      columnWidthsRef.current["dataRows"]["default"] = calculateColumnWidths([...dataRows, ...selectedItems]);
    }
    
    toast.success(`已将 ${selectedItems.length} 条数据移回导入区`);
  };

  /** 添加新组 */
  const handleAddGroup = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    const groupCount = category?.groups.length || 0;
    const newGroupId = `group-${Date.now()}`;
    updateProjectData({
      categories: categories.map(cat =>
        cat.id === categoryId
          ? { 
              ...cat, 
              groups: [...cat.groups, { id: newGroupId, name: `分组${groupCount + 1}`, items: [], selectedItems: [] }] 
            }
          : cat
      )
    });
    
    if (!columnWidthsRef.current[categoryId]) {
      columnWidthsRef.current[categoryId] = {};
    }
    columnWidthsRef.current[categoryId][newGroupId] = [...baseColumnWidthsRef.current];
  };

  /** 开始编辑组名 */
  const handleStartEditGroupName = (categoryId: string, groupId: string, currentName: string) => {
    setEditingGroupName({ categoryId, groupId, name: currentName });
    
    // 在下一次渲染后聚焦输入框
    setTimeout(() => {
      groupNameInputRef.current?.focus();
    }, 0);
  };

  /** 保存组名编辑 */
  const handleSaveGroupName = () => {
    if (!editingGroupName) return;
    
    const { categoryId, groupId, name } = editingGroupName;
    const trimmedName = name.trim() || `分组${Date.now().toString().slice(-4)}`;
    
    updateProjectData({
      categories: categories.map(category => 
        category.id === categoryId
          ? {
              ...category,
              groups: category.groups.map(group => 
                group.id === groupId
                  ? { ...group, name: trimmedName }
                  : group
              )
            }
          : category
      )
    });
    
    setEditingGroupName(null);
  };

  /** 取消组名编辑 */
  const handleCancelEditGroupName = () => {
    setEditingGroupName(null);
  };

  /** 创建新项目 */
  const handleNewProject = () => {
    if (newProjectName.trim()) {
      const newProject = {
        id: String(Date.now()),
        name: newProjectName.trim(),
        status: "active" as const,
        dataCount: 0,
        description: "新建项目",
        creator: "当前用户",
        createdAt: new Date().toISOString().split('T')[0],
        participants: ["当前用户"]
      };
      setProjects(prev => [...prev, newProject]);
      setProjectDataState(prev => ({
        ...prev,
        [newProject.id]: { dataRows: [], categories: initialCategories, selectedRows: [] }
      }));
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

  /** 单行移动到指定分组 - 核心修改：确保从源分组彻底删除 */
  const handleMoveToGroup = (rowId: string, rowData: string[], categoryId: string, groupId: string, sourceCategoryId?: string, sourceGroupId?: string) => {
    // 1. 从源位置删除数据（优先级：先处理分组内移动，再处理导入区移动）
    let newCategories = categories;
    let newDataRows = dataRows;
    let newSelectedRows = selectedRows;
    
    if (sourceCategoryId && sourceGroupId) {
      // 从源分组删除数据
      newCategories = categories.map(cat => {
        if (cat.id !== sourceCategoryId) return cat;
        
        // 遍历源分类下的所有组，找到源组并过滤数据
        const updatedGroups = cat.groups.map(g => {
          if (g.id !== sourceGroupId) return g;
          
          // 核心：过滤掉要移动的rowId，确保源组不再包含该数据
          const updatedItems = g.items.filter(item => item.id !== rowId);
          // 同步删除源组的选中状态（避免残留选中）
          const updatedSelected = g.selectedItems.filter(id => id !== rowId);
          
          // 更新源组列宽（基于删除后的数据）
          updateCategoryColumnWidths(sourceCategoryId, sourceGroupId, updatedItems);
          
          return { ...g, items: updatedItems, selectedItems: updatedSelected };
        });
        
        return { ...cat, groups: updatedGroups };
      });
    } else {
      // 从导入区删除数据
      newDataRows = dataRows.filter(row => row.id !== rowId);
      newSelectedRows = selectedRows.filter(id => id !== rowId);
      
      // 更新导入区列宽（基于删除后的数据）
      if (!columnWidthsRef.current["dataRows"]) {
        columnWidthsRef.current["dataRows"] = {};
      }
      columnWidthsRef.current["dataRows"]["default"] = calculateColumnWidths(newDataRows);
    }

    // 2. 添加数据到目标分组
    newCategories = newCategories.map(cat => {
      if (cat.id !== categoryId) return cat;
      
      // 遍历目标分类下的所有组，找到目标组并添加数据
      const updatedGroups = cat.groups.map(g => {
        if (g.id !== groupId) return g;
        
        // 核心：添加数据到目标组（确保不重复添加）
        const isAlreadyExists = g.items.some(item => item.id === rowId);
        const updatedItems = isAlreadyExists 
          ? g.items 
          : [...g.items, { id: rowId, data: rowData }];
        
        // 更新目标组列宽（基于添加后的数据）
        updateCategoryColumnWidths(categoryId, groupId, updatedItems);
        
        return { ...g, items: updatedItems };
      });
      
      return { ...cat, groups: updatedGroups };
    });
    
    updateProjectData({
      categories: newCategories,
      dataRows: newDataRows,
      selectedRows: newSelectedRows
    });
    
    // 同步更新分类的选中状态
    if (sourceCategoryId) updateCategorySelectionState(sourceCategoryId);
    updateCategorySelectionState(categoryId);
    toast.success("数据已移动到目标分组");
  };

  /** 批量移动到指定分组 - 核心修改：确保从源分组彻底删除选中数据 */
  const handleBatchMove = (categoryId: string, groupId: string, sourceCategoryId?: string, sourceGroupId?: string) => {
    // 1. 从源位置删除选中数据
    let selectedItems: Array<{ id: string; data: string[] }> = [];
    let newCategories = categories;
    let newDataRows = dataRows;
    let newSelectedRows = selectedRows;
    
    if (sourceCategoryId && sourceGroupId) {
      // 从源分组获取并删除选中数据
      newCategories = categories.map(cat => {
        if (cat.id !== sourceCategoryId) return cat;
        
        const updatedGroups = cat.groups.map(g => {
          if (g.id !== sourceGroupId) return g;
          
          // 核心：获取源组中所有选中的items
          selectedItems = g.items.filter(item => g.selectedItems.includes(item.id));
          // 核心：过滤掉选中的items，确保源组不再包含
          const updatedItems = g.items.filter(item => !g.selectedItems.includes(item.id));
          
          // 更新源组列宽（基于删除后的数据）
          updateCategoryColumnWidths(sourceCategoryId, sourceGroupId, updatedItems);
          
          return { 
            ...g, 
            items: updatedItems, 
            selectedItems: [] // 清空源组选中状态
          };
        });
        
        return { ...cat, groups: updatedGroups };
      });
    } else {
      // 从导入区获取并删除选中数据
      selectedItems = dataRows.filter(row => selectedRows.includes(row.id));
      newDataRows = dataRows.filter(row => !selectedRows.includes(row.id));
      newSelectedRows = []; // 清空导入区选中状态
      
      // 更新导入区列宽
      if (!columnWidthsRef.current["dataRows"]) {
        columnWidthsRef.current["dataRows"] = {};
      }
      columnWidthsRef.current["dataRows"]["default"] = calculateColumnWidths(newDataRows);
    }

    // 2. 批量添加数据到目标分组
    if (selectedItems.length > 0) {
      newCategories = newCategories.map(cat => {
        if (cat.id !== categoryId) return cat;
        
        const updatedGroups = cat.groups.map(g => {
          if (g.id !== groupId) return g;
          
          // 核心：过滤掉已存在的数据（避免重复添加）
          const newItems = selectedItems.filter(newItem => 
            !g.items.some(existing => existing.id === newItem.id)
          );
          const updatedItems = [...g.items, ...newItems];
          
          // 更新目标组列宽
          updateCategoryColumnWidths(categoryId, groupId, updatedItems);
          
          return { ...g, items: updatedItems };
        });
        
        return { ...cat, groups: updatedGroups };
      });
      
      updateProjectData({
        categories: newCategories,
        dataRows: newDataRows,
        selectedRows: newSelectedRows
      });
      
      // 同步更新分类的选中状态
      if (sourceCategoryId) updateCategorySelectionState(sourceCategoryId);
      updateCategorySelectionState(categoryId);
      toast.success(`已批量移动 ${selectedItems.length} 条数据到目标分组`);
    } else {
      toast.warning("未选中任何数据，无法批量移动");
    }
  };

  /** 打开删除数据对话框 */
  const handleOpenDeleteDataDialog = (rowId: string) => {
    setDataToDelete(rowId);
    setDeleteDataDialogOpen(true);
  };

  /** 确认删除数据 */
  const handleConfirmDeleteData = () => {
    if (!dataToDelete) return;
    
    updateProjectData({
      dataRows: dataRows.filter(row => row.id !== dataToDelete),
      selectedRows: selectedRows.filter(id => id !== dataToDelete),
      categories: categories.map(category => ({
        ...category,
        groups: category.groups.map(group => ({
          ...group,
          items: group.items.filter(item => item.id !== dataToDelete), // 从所有分组中删除
          selectedItems: group.selectedItems.filter(id => id !== dataToDelete)
        }))
      }))
    });
    
    setDeleteDataDialogOpen(false);
    setDataToDelete(null);
    toast.success("数据已从项目中删除");
  };

  /** 批量删除导入区选中的数据 */
  const handleBulkDeleteData = () => {
    if (selectedRows.length === 0) return;
    
    const count = selectedRows.length;
    
    updateProjectData({
      dataRows: dataRows.filter(row => !selectedRows.includes(row.id)),
      selectedRows: [],
      categories: categories.map(category => ({
        ...category,
        groups: category.groups.map(group => ({
          ...group,
          items: group.items.filter(item => !selectedRows.includes(item.id)), // 从所有分组中删除
          selectedItems: group.selectedItems?.filter(id => !selectedRows.includes(id)) || []
        })),
        allSelected: false,
        partiallySelected: false
      }))
    });
    
    toast.success(`已批量删除 ${count} 条数据`);
  };

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

        {/* 右侧内容区域 */}
        <div className="flex-1 flex flex-col">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                <Upload className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {projects.find(p => p.id === selectedProject)?.name || "项目"}
                </h1>
                <p className="text-muted-foreground">项目管理与数据分析</p>
              </div>
            </div>
          </div>

          {/* 标签页 */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="px-6 pt-4 border-b border-border">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="project-info" className="gap-2">
                  <User className="w-4 h-4" />
                  项目信息
                </TabsTrigger>
                <TabsTrigger value="data-management" className="gap-2">
                  <Upload className="w-4 h-4" />
                  数据管理
                </TabsTrigger>
                <TabsTrigger value="analysis-results" className="gap-2">
                  <BarChart3 className="w-4 h-4" />
                  分析结果
                </TabsTrigger>
              </TabsList>
            </div>

            {/* 项目信息标签页 */}
            <TabsContent value="project-info" className="flex-1 m-0">
              <div className="p-6 space-y-6 overflow-y-auto h-full">
                {(() => {
                  const currentProject = projects.find(p => p.id === selectedProject);
                  if (!currentProject) return null;
                  
                  return (
                    <>
                      <Card className="border-border/50 shadow-card">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            项目基本信息
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">项目名称</label>
                              <p className="mt-1 text-base">{currentProject.name}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">项目状态</label>
                              <div className="mt-1">
                                <Badge variant={currentProject.status === "active" ? "default" : "secondary"}>
                                  {currentProject.status === "active" ? "活跃" : "非活跃"}
                                </Badge>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">创建人</label>
                              <p className="mt-1 text-base">{currentProject.creator}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">创建日期</label>
                              <p className="mt-1 text-base">{currentProject.createdAt}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">数据量</label>
                              <p className="mt-1 text-base">{currentProject.dataCount} 条</p>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">项目简介</label>
                            <p className="mt-1 text-base">{currentProject.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-border/50 shadow-card">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            参与人员
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {currentProject.participants.map((participant, idx) => (
                              <Badge key={idx} variant="outline" className="text-sm px-3 py-1">
                                {participant}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  );
                })()}
              </div>
            </TabsContent>

            {/* 数据管理标签页 */}
            <TabsContent value="data-management" className="flex-1 m-0">
              <div className="p-6 space-y-6 overflow-y-auto h-full">
                <div className="flex items-center justify-between mb-4">
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
            {/* 1. 导入数据 */}
            {dataRows.length > 0 && (
              <Card className="border-border/50 shadow-card hover:shadow-elegant transition-smooth overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-lg">导入数据</CardTitle>
                  {selectedRows.length > 0 && (
                    <div className="flex items-center gap-2 flex-1 min-w-[300px] max-w-md">
                      <Badge variant="secondary" className="flex-shrink-0">
                        已选 {selectedRows.length} 条
                      </Badge>
                      <MultiSelect
                        options={categories.flatMap(cat => 
                          cat.hasGroups 
                            ? cat.groups.map((g) => ({ 
                                label: `${cat.title} - ${g.name}`, 
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
                        className="flex-grow min-w-[150px]"
                      />
                      <Button 
                        variant="destructive" 
                        size="sm"
                        className="gap-1 h-8 flex-shrink-0"
                        onClick={handleBulkDeleteData}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        批量删除
                      </Button>
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
                              checked={allDataSelected}
                              data-state={partiallyDataSelected ? "indeterminate" : allDataSelected ? "checked" : "unchecked"}
                              onCheckedChange={(checked) => {
                                updateProjectData({ selectedRows: checked ? dataRows.map(r => r.id) : [] });
                              }}
                              className="rounded-sm"
                            />
                          </th>
                          <th 
                            className="p-3 bg-primary/10 text-center font-medium text-sm"
                            style={{ 
                              width: baseColumnWidthsRef.current[1] || 70,
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
                                width: baseColumnWidthsRef.current[index + 2] || 'auto',
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
                                  updateProjectData({
                                    selectedRows: checked 
                                      ? [...selectedRows, row.id]
                                      : selectedRows.filter(id => id !== row.id)
                                  });
                                }}
                                className="rounded-sm"
                              />
                            </td>
                            <td 
                              className="p-3 text-center text-sm"
                              style={{ 
                                width: baseColumnWidthsRef.current[1] || 70,
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
                                  width: baseColumnWidthsRef.current[index + 2] || 'auto',
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
                              <div className="flex items-center justify-center gap-1">
                                <MultiSelect
                                  options={categories.flatMap(cat => 
                                    cat.hasGroups 
                                      ? cat.groups.map((g) => ({ 
                                          label: `${cat.title} - ${g.name}`, 
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
                                  placeholder="移动到..."
                                  className="w-[100px]"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10 -ml-2"
                                  onClick={() => handleOpenDeleteDataDialog(row.id)}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
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
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                    {category.partiallySelected || category.allSelected ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="gap-1 h-8"
                        onClick={() => handleBulkRemoveFromCategory(category.id)}
                      >
                        <Check className="w-3.5 h-3.5" />
                        移回 {category.allSelected ? '全部' : category.partiallySelected ? '选中' : ''}
                      </Button>
                    ) : null}
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="overflow-x-auto w-fit">
                      <table className="border-collapse mb-4">
                        <thead>
                          <tr>
                            <th 
                              className="p-3 bg-primary/10 text-center font-medium text-sm rounded-l-lg"
                              style={{ width: 50 }}
                            >
                              <Checkbox
                                checked={category.allSelected}
                                data-state={category.partiallySelected ? "indeterminate" : category.allSelected ? "checked" : "unchecked"}
                                onCheckedChange={(checked) => handleCategorySelectAll(category.id, checked as boolean)}
                                className="rounded-sm"
                              />
                            </th>
                            <th 
                              className="p-3 bg-primary/10 text-center font-medium text-sm"
                              style={{ 
                                width: baseColumnWidthsRef.current[1] || 70,
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
                                  width: baseColumnWidthsRef.current[index + 2] || 'auto',
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
                      </table>

                      <div className="space-y-4">
                        {category.groups.map((group, groupIndex) => (
                          <div
                            key={group.id}
                            className={`border-2 border-dashed border-border/50 rounded-lg p-4 ${
                              category.id === "recommended" ? "pt-4" : "pt-8 pb-2"
                            } min-h-32 relative`}
                          >
                            {/* 组名和基本信息 - 仅在非默认推荐分类显示 */}
                            {category.id !== "recommended" && (
                              <>
                                <div className="absolute top-2 left-2 flex items-center gap-2 flex-wrap">
                                  {editingGroupName?.categoryId === category.id && editingGroupName?.groupId === group.id ? (
                                    <div className="flex items-center gap-1">
                                      <Input
                                        ref={groupNameInputRef}
                                        value={editingGroupName.name}
                                        onChange={(e) => setEditingGroupName({...editingGroupName, name: e.target.value})}
                                        onBlur={handleSaveGroupName}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') handleSaveGroupName();
                                          if (e.key === 'Escape') handleCancelEditGroupName();
                                        }}
                                        className="h-7 text-sm w-[100px]"
                                        autoFocus
                                      />
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-6 w-6 p-0"
                                        onClick={handleSaveGroupName}
                                      >
                                        <Check className="h-3 w-3" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-6 w-6 p-0"
                                        onClick={handleCancelEditGroupName}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <span 
                                      className="text-xs font-medium text-foreground cursor-pointer hover:text-primary transition-colors"
                                      onDoubleClick={() => handleStartEditGroupName(category.id, group.id, group.name)}
                                    >
                                      {group.name}
                                    </span>
                                  )}
                                  
                                  {group.items.length > 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                      {group.items.length} 条
                                    </Badge>
                                  )}
                                  
                                  {group.selectedItems.length > 0 && (
                                    <Badge variant="default" className="text-xs">
                                      已选 {group.selectedItems.length} 条
                                    </Badge>
                                  )}
                                </div>
                                
                                {/* 组内全选按钮 */}
                                {group.items.length > 0 && (
                                  <div className="absolute top-2 right-24 flex items-center gap-1">
                                    <Checkbox
                                      checked={group.items.length > 0 && group.selectedItems.length === group.items.length}
                                      data-state={group.selectedItems.length > 0 && group.selectedItems.length < group.items.length ? "indeterminate" : 
                                                group.selectedItems.length === group.items.length ? "checked" : "unchecked"}
                                      onCheckedChange={(checked) => handleGroupSelectAll(category.id, group.id, checked as boolean)}
                                      className="rounded-sm h-3.5 w-3.5"
                                    />
                                    <span className="text-xs text-muted-foreground">全选本组</span>
                                  </div>
                                )}
                                
                                {/* 删除按钮 */}
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
                              </>
                            )}

                            {group.items.length === 0 ? (
                              <p className="text-muted-foreground text-sm text-center py-6">
                                请使用"移动到..."功能添加数据
                              </p>
                            ) : (
                              <table className="border-collapse">
                                <tbody>
                                  {group.items.map((item, itemIndex) => (
                                    <tr
                                      key={item.id}
                                      className={`transition-all duration-200 rounded-lg hover:bg-primary/5 ${
                                        group.selectedItems.includes(item.id) ? 'bg-primary/10' : ''
                                      }`}
                                    >
                                      <td className="p-3 text-center" style={{ width: 50 }}>
                                        <Checkbox
                                          checked={group.selectedItems.includes(item.id)}
                                          onCheckedChange={(checked) => {
                                            handleCategoryItemSelect(category.id, group.id, item.id, checked as boolean);
                                          }}
                                          className="rounded-sm"
                                        />
                                      </td>
                                      <td 
                                        className="p-3 text-center text-sm"
                                        style={{ 
                                          width: baseColumnWidthsRef.current[1] || 70,
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
                                            width: baseColumnWidthsRef.current[index + 2] || 'auto',
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
                                        <div className="flex items-center justify-center gap-1">
                                          <MultiSelect
                                            options={categories.flatMap(cat => 
                                              cat.hasGroups 
                                                ? cat.groups
                                                    .filter(g => !(cat.id === category.id && g.id === group.id))
                                                    .map((g) => ({ 
                                                      label: `${cat.title} - ${g.name}`, 
                                                      value: `${cat.id}:${g.id}` 
                                                    }))
                                                : cat.id !== category.id 
                                                  ? [{ label: cat.title, value: `${cat.id}:default` }]
                                                  : []
                                            )}
                                            selected={[]}
                                            onChange={(values) => {
                                              if (values.length > 0) {
                                                const [targetCategoryId, targetGroupId] = values[0].split(':');
                                                // 传递源分组信息，确保从原分组删除
                                                handleMoveToGroup(item.id, item.data, targetCategoryId, targetGroupId, category.id, group.id);
                                              }
                                            }}
                                            placeholder="移动到..."
                                            className="w-[100px]"
                                          />
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10 -ml-2"
                                            onClick={() => handleRemoveFromCategory(category.id, group.id, item.id)}
                                          >
                                            <Trash2 className="h-3.5 w-3.5" />
                                          </Button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                          </div>
                        ))}

                        {/* 添加新组按钮 - 仅在有分组的分类显示 */}
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
            </TabsContent>

            {/* 分析结果标签页 */}
            <TabsContent value="analysis-results" className="flex-1 m-0">
              <div className="p-6 space-y-6 overflow-y-auto h-full">
                <Card className="border-border/50 shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      历史分析记录
                    </CardTitle>
                    <CardDescription>该项目的所有分析历史记录</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {(mockAnalysisHistory[selectedProject] || []).map((record) => (
                        <div key={record.id} className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-smooth">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-medium">{record.module}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{record.result}</p>
                            </div>
                            <Badge variant={
                              record.status === "success" ? "default" : 
                              record.status === "warning" ? "secondary" : 
                              "destructive"
                            }>
                              {record.status === "success" ? "成功" : record.status === "warning" ? "警告" : "失败"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                            <span>分析人：{record.analyst}</span>
                            <span>模型版本：{record.modelVersion}</span>
                            <span>分析时间：{record.analysisDate}</span>
                          </div>
                        </div>
                      ))}
                      {(!mockAnalysisHistory[selectedProject] || mockAnalysisHistory[selectedProject].length === 0) && (
                        <p className="text-center text-muted-foreground py-8">暂无分析记录</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
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

      {/* 删除数据对话框 */}
      <Dialog open={deleteDataDialogOpen} onOpenChange={setDeleteDataDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>删除数据</DialogTitle>
            <DialogDescription>
              确定要从项目中删除这条数据吗？此操作将从所有分组中移除该数据。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">此操作不可撤销，请确认后执行。</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDataDialogOpen(false)}>取消</Button>
            <Button className="bg-destructive hover:bg-destructive/90 text-destructive-foreground" onClick={handleConfirmDeleteData}>
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
