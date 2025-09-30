import { useState } from "react";
import { Upload, FileText, Plus, Trash2, Edit3, Save, FolderOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const mockProjects = [
  { id: "1", name: "电池包项目A", status: "active", dataCount: 1247 },
  { id: "2", name: "车身连接项目B", status: "active", dataCount: 856 },
  { id: "3", name: "测试项目C", status: "inactive", dataCount: 234 }
];

const mockDataRows = [
  { id: "1", data: ["钢铝连接", "6mm", "4.5kA", "380V", "2.1s", "优良", "98.5%", "Pass"] },
  { id: "2", data: ["铝铝连接", "8mm", "5.2kA", "400V", "2.3s", "良好", "96.2%", "Pass"] },
  { id: "3", data: ["钢钢连接", "5mm", "4.0kA", "360V", "1.9s", "优良", "99.1%", "Pass"] },
  { id: "4", data: ["复合连接", "7mm", "4.8kA", "390V", "2.0s", "良好", "97.3%", "Pass"] }
];

const categoryHeaders = [
  { id: "recommended", title: "默认推荐", items: [] },
  { id: "double-pin", title: "双钉共模", items: [] },
  { id: "shared-pin", title: "共钉共模", items: [] }
];

export default function DataImport() {
  const [selectedProject, setSelectedProject] = useState("1");
  const [projects, setProjects] = useState(mockProjects);
  const [dataRows, setDataRows] = useState(mockDataRows);
  const [categories, setCategories] = useState(categoryHeaders);
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (e, rowId) => {
    setDraggedItem(rowId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e, categoryId) => {
    e.preventDefault();
    if (draggedItem) {
      const rowData = dataRows.find(row => row.id === draggedItem);
      if (rowData) {
        setCategories(prev => prev.map(cat => 
          cat.id === categoryId 
            ? { ...cat, items: [...cat.items, rowData] }
            : { ...cat, items: cat.items.filter(item => item.id !== draggedItem) }
        ));
        setDataRows(prev => prev.filter(row => row.id !== draggedItem));
      }
      setDraggedItem(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

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
          <Button className="w-full gap-2 hover:scale-105 transition-smooth">
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
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:scale-110 transition-smooth">
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:scale-110 transition-smooth text-destructive">
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

        <div className="flex-1 p-6 space-y-6">
          {/* 数据行显示 */}
          {dataRows.length > 0 && (
            <Card className="border-border/50 shadow-card hover:shadow-elegant transition-smooth">
              <CardHeader>
                <CardTitle className="text-lg">导入数据</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dataRows.map((row) => (
                    <div
                      key={row.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, row.id)}
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

          {/* 分组区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="border-border/50 shadow-card hover:shadow-elegant transition-smooth"
                onDrop={(e) => handleDrop(e, category.id)}
                onDragOver={handleDragOver}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-center">{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="min-h-40 border-2 border-dashed border-border/50 rounded-lg p-4 space-y-2"
                  >
                    {category.items.length === 0 ? (
                      <p className="text-muted-foreground text-sm text-center py-8">
                        拖拽数据到此处进行分组
                      </p>
                    ) : (
                      category.items.map((item) => (
                        <div key={item.id} className="p-2 bg-primary/10 rounded border border-primary/20">
                          <div className="flex gap-1 flex-wrap">
                            {item.data.slice(0, 4).map((cell, index) => (
                              <span key={index} className="text-xs bg-background px-1 rounded">
                                {cell}
                              </span>
                            ))}
                          </div>
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
  );
}