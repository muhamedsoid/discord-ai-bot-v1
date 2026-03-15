import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { Bot, Users, MessageSquare, Activity } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";

const dashboardData = [
  { name: "الإثنين", commands: 45, users: 120, ai: 32 },
  { name: "الثلاثاء", commands: 52, users: 135, ai: 48 },
  { name: "الأربعاء", commands: 48, users: 128, ai: 41 },
  { name: "الخميس", commands: 61, users: 145, ai: 55 },
  { name: "الجمعة", commands: 55, users: 140, ai: 50 },
  { name: "السبت", commands: 67, users: 155, ai: 62 },
  { name: "الأحد", commands: 72, users: 165, ai: 70 },
];

export default function Dashboard() {
  const { user, loading } = useAuth();
  const { data: stats, isLoading: statsLoading } = trpc.bot.getStats.useQuery();
  const { data: recentLogs } = trpc.bot.getRecentLogs.useQuery({ limit: 10 });
  const [dashboardData, setDashboardData] = useState([
    { name: "الإثنين", commands: 45, users: 120, ai: 32 },
    { name: "الثلاثاء", commands: 52, users: 135, ai: 48 },
    { name: "الأربعاء", commands: 48, users: 128, ai: 41 },
    { name: "الخميس", commands: 61, users: 145, ai: 55 },
    { name: "الجمعة", commands: 55, users: 140, ai: 50 },
    { name: "السبت", commands: 67, users: 155, ai: 62 },
    { name: "الأحد", commands: 72, users: 165, ai: 70 },
  ]);

  if (loading || statsLoading) {
    return <DashboardLayout>جاري التحميل...</DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">لوحة التحكم</h1>
          <p className="text-muted-foreground mt-2">مرحباً {user?.name || "بالمستخدم"}</p>
        </div>

        {/* الإحصائيات الرئيسية */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الخوادم النشطة</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalServers || 0}</div>
              <p className="text-xs text-muted-foreground">خوادم متصلة</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">مستخدم نشط</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الأوامر</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalCommands || 0}</div>
              <p className="text-xs text-muted-foreground">أمر منفذ</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">استخدام الذكاء الاصطناعي</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.aiUsage || 0}</div>
              <p className="text-xs text-muted-foreground">محادثة AI</p>
            </CardContent>
          </Card>
        </div>

        {/* الرسوم البيانية */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>نشاط الأوامر</CardTitle>
              <CardDescription>عدد الأوامر المنفذة يومياً</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="commands" fill="#3b82f6" name="الأوامر" />
                  <Bar dataKey="ai" fill="#10b981" name="استخدام AI" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>نمو المستخدمين</CardTitle>
              <CardDescription>إجمالي المستخدمين خلال الأسبوع</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#3b82f6" name="المستخدمين" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* الأنشطة الأخيرة */}
        <Card>
          <CardHeader>
            <CardTitle>الأنشطة الأخيرة</CardTitle>
            <CardDescription>آخر الأوامر والأحداث</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="commands" className="w-full">
              <TabsList>
                <TabsTrigger value="commands">الأوامر</TabsTrigger>
                <TabsTrigger value="moderation">الإدارة</TabsTrigger>
                <TabsTrigger value="ai">الذكاء الاصطناعي</TabsTrigger>
              </TabsList>

              <TabsContent value="commands" className="space-y-4">
                <div className="space-y-2">
                  {recentLogs && recentLogs.length > 0 ? (
                    recentLogs.map((log) => (
                      <div key={log.id} className="flex justify-between p-3 bg-muted rounded">
                        <span>{log.commandName}</span>
                        <span className="text-sm text-muted-foreground">{log.createdAt.toString()}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-4">لا توجد سجلات</div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="moderation" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between p-3 bg-red-50 dark:bg-red-950 rounded">
                    <span>طرد مستخدم</span>
                    <span className="text-sm text-muted-foreground">قبل 30 دقيقة</span>
                  </div>
                  <div className="flex justify-between p-3 bg-yellow-50 dark:bg-yellow-950 rounded">
                    <span>تحذير مستخدم</span>
                    <span className="text-sm text-muted-foreground">قبل ساعة</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ai" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between p-3 bg-green-50 dark:bg-green-950 rounded">
                    <span>إجابة AI: ما هو Python؟</span>
                    <span className="text-sm text-muted-foreground">قبل 20 دقيقة</span>
                  </div>
                  <div className="flex justify-between p-3 bg-green-50 dark:bg-green-950 rounded">
                    <span>إجابة AI: شرح الخوارزميات</span>
                    <span className="text-sm text-muted-foreground">قبل 45 دقيقة</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
