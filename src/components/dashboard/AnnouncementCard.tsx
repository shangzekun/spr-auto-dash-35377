import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Clock } from "lucide-react";
interface Announcement {
  id: string;
  title: string;
  content: string;
  type: "info" | "warning" | "success" | "error";
  timestamp: string;
  isNew?: boolean;
}
interface AnnouncementCardProps {
  announcements: Announcement[];
}
export function AnnouncementCard({
  announcements
}: AnnouncementCardProps) {
  const getTypeColor = (type: Announcement["type"]) => {
    switch (type) {
      case "info":
        return "bg-primary/10 text-primary";
      case "warning":
        return "bg-warning/10 text-warning";
      case "success":
        return "bg-success/10 text-success";
      case "error":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };
  const getTypeLabel = (type: Announcement["type"]) => {
    switch (type) {
      case "info":
        return "信息";
      case "warning":
        return "警告";
      case "success":
        return "成功";
      case "error":
        return "错误";
      default:
        return "通知";
    }
  };
  return <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-elegant transition-smooth">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="h-5 w-5 text-primary" />
          更新公告
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {announcements.length === 0 ? <p className="text-muted-foreground text-sm text-center py-4">
            暂无公告
          </p> : announcements.map(announcement => <div key={announcement.id} className="border border-border/50 rounded-lg p-4 hover:bg-muted/30 hover:scale-105 transition-smooth cursor-pointer">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-medium text-foreground text-sm">
                  {announcement.title}
                </h4>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {announcement.isNew && <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      新
                    </Badge>}
                  
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {announcement.content}
              </p>
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {announcement.timestamp}
              </div>
            </div>)}
      </CardContent>
    </Card>;
}