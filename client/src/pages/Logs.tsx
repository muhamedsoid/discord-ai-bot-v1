import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Trash2 } from "lucide-react";
import { useState } from "react";

interface LogEntry {
  id: number;
  timestamp: string;
  type: "command" | "moderation" | "ai" | "error";
  user: string;
  action: string;
  status: "success" | "error";
  details: string;
}

const mockLogs: LogEntry[] = [
  {
    id: 1,
    timestamp: "2024-12-03 14:30:45",
    type: "command",
    user: "Ahmed#1234",
    action: "!ping",
    status: "success",
    details: "Latency: 45ms",
  },
  {
    id: 2,
    timestamp: "2024-12-03 14:28:12",
    type: "ai",
    user: "Sara#5678",
    action: "!ai ما هو الذكاء الاصطناعي؟",
    status: "success",
    details: "Response generated successfully",
  },
  {
    id: 3,
    timestamp: "2024-12-03 14:25:33",
    type: "moderation",
    user: "Admin#9999",
    action: "!kick @User",
    status: "success",
    details: "User kicked for spam",
  },
  {
    id: 4,
    timestamp: "2024-12-03 14:20:15",
    type: "command",
    user: "John#4321",
    action: "!help",
    status: "success",
    details: "Help menu displayed",
  },
  {
    id: 5,
    timestamp: "2024-12-03 14:15:42",
    type: "error",
    user: "System",
    action: "Database connection",
    status: "error",
    details: "Connection timeout",
  },
];

const typeColors = {
  command: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  moderation: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  ai: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  error: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
};

export default function Logs() {
  const { user, loading } = useAuth();
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  if (loading) {
    return <DashboardLayout>جاري التحميل...</DashboardLayout>;
  }

  const filteredLogs = logs.filter((log) => {
    const matchesType = filterType === "all" || log.type === filterType;
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">السجلات والأحداث</h1>
          <p className="text-muted-foreground mt-2">عرض جميع الأوامر والأحداث والأخطاء</p>
        </div>

        {/* الفلاتر والبحث */}
        <Card>
          <CardHeader>
            <CardTitle>البحث والفلترة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث عن مستخدم أو أمر..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="نوع السجل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="command">الأوامر</SelectItem>
                  <SelectItem value="moderation">الإدارة</SelectItem>
                  <SelectItem value="ai">الذكاء الاصطناعي</SelectItem>
                  <SelectItem value="error">الأخطاء</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  تحميل
                </Button>
                <Button variant="outline" className="gap-2 text-red-600">
                  <Trash2 className="h-4 w-4" />
                  حذف الكل
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* جدول السجلات */}
        <Card>
          <CardHeader>
            <CardTitle>السجلات الأخيرة</CardTitle>
            <CardDescription>عدد السجلات: {filteredLogs.length}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الوقت</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>المستخدم</TableHead>
                    <TableHead>الإجراء</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>التفاصيل</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">{log.timestamp}</TableCell>
                      <TableCell>
                        <Badge className={typeColors[log.type]}>
                          {log.type === "command"
                            ? "أمر"
                            : log.type === "moderation"
                            ? "إدارة"
                            : log.type === "ai"
                            ? "AI"
                            : "خطأ"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{log.user}</TableCell>
                      <TableCell className="text-sm">{log.action}</TableCell>
                      <TableCell>
                        <Badge variant={log.status === "success" ? "default" : "destructive"}>
                          {log.status === "success" ? "نجح" : "فشل"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{log.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
