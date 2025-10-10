import { useState } from "react";
import { Upload, FileText, Plus, Trash2, Edit3, Save, FolderOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
        // 添加到目标组
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

        // 删除原组的数据（修复bug）
        if (cat.id === draggedItem.source && draggedItem.groupId) {
          return {
            ...cat,
            groups: cat.groups.map(g =>
              g.id === draggedItem.groupId
                ? { ...g, items: g.items.filter(item => item.id !== draggedItem.id) }
                : g
            )
          };
        }

        return cat;
      })
    );

    // 如果源是导入表，删除原数据
    if (draggedItem.source === "dataRows") {
      setDataRows(prev => prev.filter(row => row.id !== draggedItem.id));
    }

    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  /** 表格样式：每列居中，横向滚动 */
  const tableWrapperStyle = "overflow-x-auto rounded-md border border-border";
  const tableStyle = "table-auto w-full text-center whitespace-nowrap";

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

  /** 数据行美化样式 */
  const rowStyle =
    "cursor-move transition-all hover:shadow-md hover:bg-primary/10 rounded-md px-2 py-1";

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
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* 右侧数据导入 */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* 导入数据表 */}
          {dataRows.length > 0 && (
            <Card className="shadow-card hover:shadow-elegant transition-smooth">
              <CardHeader>
                <CardTitle className="text-lg">导入数据</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={tableWrapperStyle}>
                  <table className={tableStyle}>
                    <thead>
                      <tr className="text-center font-medium bg-muted/20">
                        <th className="px-2 py-1">序号</th>
                        {dataHeaders.map(h => (
                          <th key={h} className="px-2 py-1">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dataRows.map((row, idx) => (
                        <tr
                          key={row.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, row.id, row.data, "dataRows")}
                          className={rowStyle}
                        >
                          <td className="px-2 py-1">{idx + 1}</td>
                          {row.data.map((cell, i) => (
                            <td key={i} className="px-2 py-1">{cell}</td>
                          ))}
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
                    <div className={tableWrapperStyle}>
                      <table className={tableStyle}>
                        <thead>
                          <tr className="text-center font-medium bg-muted/20">
                            <th className="px-2 py-1">序号</th>
                            {dataHeaders.map(h => <th key={h} className="px-2 py-1">{h}</th>)}
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
                                className={rowStyle}
                              >
                                <td className="px-2 py-1">{i + 1}</td>
                                {item.data.map((cell, idx) => (
                                  <td key={idx} className="px-2 py-1">{cell}</td>
                                ))}
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
