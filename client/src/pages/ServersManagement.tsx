import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Settings, Trash2, Plus } from "lucide-react";
import { useState } from "react";

interface Server {
  id: number;
  serverId: string;
  serverName: string;
  prefix: string;
  aiEnabled: boolean;
  memberCount: number;
  createdAt: string;
}

const mockServers: Server[] = [
  {
    id: 1,
    serverId: "123456789",
    serverName: "سيرفر البرمجة",
    prefix: "!",
    aiEnabled: true,
    memberCount: 245,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    serverId: "987654321",
    serverName: "سيرفر الألعاب",
    prefix: "!",
    aiEnabled: true,
    memberCount: 512,
    createdAt: "2024-02-10",
  },
  {
    id: 3,
    serverId: "555666777",
    serverName: "سيرفر الدراسة",
    prefix: "?",
    aiEnabled: false,
    memberCount: 128,
    createdAt: "2024-03-05",
  },
];

export default function ServersManagement() {
  const { user, loading } = useAuth();
  const [servers, setServers] = useState<Server[]>(mockServers);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);

  if (loading) {
    return <DashboardLayout>جاري التحميل...</DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">إدارة الخوادم</h1>
            <p className="text-muted-foreground mt-2">إدارة إعدادات الخوادم المتصلة بالبوت</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            إضافة خادم
          </Button>
        </div>

        {/* جدول الخوادم */}
        <Card>
          <CardHeader>
            <CardTitle>الخوادم المتصلة</CardTitle>
            <CardDescription>قائمة جميع الخوادم التي يعمل عليها البوت</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم الخادم</TableHead>
                    <TableHead>معرف الخادم</TableHead>
                    <TableHead>البادئة</TableHead>
                    <TableHead>الأعضاء</TableHead>
                    <TableHead>الذكاء الاصطناعي</TableHead>
                    <TableHead>تاريخ الإضافة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {servers.map((server) => (
                    <TableRow key={server.id}>
                      <TableCell className="font-medium">{server.serverName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{server.serverId}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{server.prefix}</Badge>
                      </TableCell>
                      <TableCell>{server.memberCount}</TableCell>
                      <TableCell>
                        <Badge variant={server.aiEnabled ? "default" : "secondary"}>
                          {server.aiEnabled ? "مفعل" : "معطل"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{server.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedServer(server)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* إعدادات الخادم المحدد */}
        {selectedServer && (
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الخادم: {selectedServer.serverName}</CardTitle>
              <CardDescription>تخصيص إعدادات البوت لهذا الخادم</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="prefix">البادئة (Prefix)</Label>
                  <Input id="prefix" defaultValue={selectedServer.prefix} placeholder="!" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modLog">قناة السجلات</Label>
                  <Input id="modLog" placeholder="معرف القناة" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>تفعيل الذكاء الاصطناعي</Label>
                    <p className="text-sm text-muted-foreground">السماح للمستخدمين باستخدام أوامر AI</p>
                  </div>
                  <Switch defaultChecked={selectedServer.aiEnabled} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>تسجيل الأوامر</Label>
                    <p className="text-sm text-muted-foreground">حفظ سجل جميع الأوامر المنفذة</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>الرسائل الترحيبية</Label>
                    <p className="text-sm text-muted-foreground">إرسال رسالة ترحيب للأعضاء الجدد</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button>حفظ التغييرات</Button>
                <Button variant="outline" onClick={() => setSelectedServer(null)}>
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
