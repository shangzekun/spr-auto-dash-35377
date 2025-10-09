import { Home, Upload, Settings, Layers, BarChart3, ChevronRight } from "lucide-react";
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

const menuItems = [
  { 
    title: "主页", 
    url: "/", 
    icon: Home
  },
  { 
    title: "数据导入", 
    url: "/data-import", 
    icon: Upload
  },
  { 
    title: "功能模块", 
    url: "/modules", 
    icon: Layers
  },
  { 
    title: "核心场景", 
    url: "/scenarios", 
    icon: BarChart3
  },
  { 
    title: "设置", 
    url: "/settings", 
    icon: Settings
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
    const baseClasses = "w-full justify-start transition-smooth group relative overflow-hidden";
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
              <BarChart3 className="w-4 h-4 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-bold text-lg text-sidebar-foreground">Riv Insight</h1>
                <p className="text-xs text-sidebar-foreground/60">SPR工艺自动开发 by NIO</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <SidebarGroup className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <SidebarGroupLabel className="text-sidebar-foreground/60 font-medium">
              系统导航
            </SidebarGroupLabel>
            <SidebarTrigger className="hover:bg-sidebar-accent hover:scale-105 transition-smooth h-6 w-6" />
          </div>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClassName(item.url)}>
                      <item.icon className={`${isCollapsed ? "w-5 h-5" : "w-5 h-5 mr-3"} flex-shrink-0`} />
                      {!isCollapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                      {!isCollapsed && isActive(item.url) && (
                        <ChevronRight className="w-4 h-4 opacity-60" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
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