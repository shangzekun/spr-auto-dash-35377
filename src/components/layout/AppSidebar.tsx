import {
  Activity,
  AlertTriangle,
  Bell,
  Brain,
  ChevronRight,
  Factory,
  Layers,
  LineChart,
  NotebookText,
  Settings,
  TestTubes,
  Upload,
  Workflow,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

import type { ComponentType } from "react";

type MenuSection = {
  label: string;
  items: {
    title: string;
    url: string;
    icon: ComponentType<{ className?: string }>;
    tag?: string;
  }[];
};

const menuSections: MenuSection[] = [
  {
    label: "监控",
    items: [
      { title: "实时监控 + 预警", url: "/", icon: Activity, tag: "监控" },
      { title: "异常预警中心", url: "/alerts", icon: Bell, tag: "预警" },
    ],
  },
  {
    label: "工艺设计",
    items: [
      { title: "工艺方案设计", url: "/process-design", icon: Layers },
      { title: "知识资产库", url: "/knowledge", icon: NotebookText },
    ],
  },
  {
    label: "仿真",
    items: [{ title: "仿真验证", url: "/simulation", icon: LineChart }],
  },
  {
    label: "试验",
    items: [{ title: "试验排程", url: "/pilot-test", icon: TestTubes }],
  },
  {
    label: "量产",
    items: [{ title: "生产监控", url: "/production-monitor", icon: Factory }],
  },
  {
    label: "模型",
    items: [{ title: "模型与AI工作流", url: "/ai-models", icon: Brain }],
  },
  {
    label: "协同",
    items: [{ title: "协同流程", url: "/collaboration", icon: Workflow }],
  },
  {
    label: "数据/日志",
    items: [
      { title: "数据导入", url: "/data-import", icon: Upload },
      { title: "功能模块", url: "/modules", icon: Layers },
      { title: "核心场景", url: "/scenarios", icon: Activity },
      { title: "操作日志", url: "/operation-logs", icon: AlertTriangle },
    ],
  },
  {
    label: "设置",
    items: [
      { title: "模型管理（旧版）", url: "/model-management", icon: Brain },
      { title: "系统设置", url: "/settings", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavClassName = (path: string) => {
    const baseClasses =
      "w-full justify-start transition-smooth group relative overflow-hidden";
    if (isActive(path)) {
      return `${baseClasses} bg-gradient-primary text-primary-foreground shadow-glow`;
    }
    return `${baseClasses} hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`;
  };

  return (
    <Sidebar
      className="border-r border-sidebar-border transition-smooth"
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar">
        {/* Logo/Brand Section */}
        <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
              <Activity className="w-4 h-4 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-bold text-lg text-sidebar-foreground">
                  Riv Insight
                </h1>
                <p className="text-xs text-sidebar-foreground/60">
                  SPR工艺自动开发 by NIO
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <SidebarGroup className="px-4 py-6">
          <div className="flex items-center gap-2 mb-4">
            <SidebarGroupLabel className="text-sidebar-foreground/60 font-medium flex-1">
              系统导航
            </SidebarGroupLabel>
            {!isCollapsed && (
              <SidebarTrigger className="hover:bg-sidebar-accent hover:scale-105 transition-smooth h-6 w-6 flex-shrink-0" />
            )}
          </div>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-4">
              {menuSections.map((section) => (
                <div key={section.label} className="space-y-2">
                  {!isCollapsed && (
                    <div className="text-xs uppercase tracking-wide text-sidebar-foreground/60 px-2">
                      {section.label}
                    </div>
                  )}
                  <div className="space-y-2">
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <NavLink to={item.url} className={getNavClassName(item.url)}>
                            <item.icon
                              className={`${
                                isCollapsed ? "w-5 h-5" : "w-5 h-5 mr-3"
                              } flex-shrink-0`}
                            />
                            {!isCollapsed && (
                              <span className="font-medium flex-1">{item.title}</span>
                            )}
                            {!isCollapsed && item.tag && (
                              <span className="text-[10px] rounded-full bg-primary/10 text-primary px-2 py-0.5">
                                {item.tag}
                              </span>
                            )}
                            {!isCollapsed && isActive(item.url) && (
                              <ChevronRight className="w-4 h-4 opacity-60" />
                            )}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </div>
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Status Indicator */}
        <div className="mt-auto p-4 border-t border-sidebar-border">
          {!isCollapsed && (
            <div className="flex items-center gap-2 text-sm text-sidebar-foreground/60">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse-glow"></div>
              <span>系统运行正常</span>
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
