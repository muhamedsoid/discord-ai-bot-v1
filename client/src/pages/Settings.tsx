import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Save, RotateCcw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";

export default function Settings() {
  const { user, loading } = useAuth();
  const [saved, setSaved] = useState(false);

  if (loading) {
    return <DashboardLayout>جاري التحميل...</DashboardLayout>;
  }

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">الإعدادات</h1>
          <p className="text-muted-foreground mt-2">تخصيص إعدادات البوت والنظام</p>
        </div>

        {saved && (
          <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              تم حفظ التغييرات بنجاح
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">عام</TabsTrigger>
            <TabsTrigger value="ai">الذكاء الاصطناعي</TabsTrigger>
            <TabsTrigger value="moderation">الإدارة</TabsTrigger>
            <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
          </TabsList>

          {/* الإعدادات العامة */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>الإعدادات العامة</CardTitle>
                <CardDescription>إعدادات البوت الأساسية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="botName">اسم البوت</Label>
                  <Input id="botName" defaultValue="Discord AI Bot" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="botStatus">حالة البوت</Label>
                  <Select defaultValue="online">
                    <SelectTrigger id="botStatus">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">متصل</SelectItem>
                      <SelectItem value="idle">خامل</SelectItem>
                      <SelectItem value="dnd">مشغول</SelectItem>
                      <SelectItem value="offline">غير متصل</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="statusMessage">رسالة الحالة</Label>
                  <Input id="statusMessage" placeholder="أكتب رسالة الحالة" defaultValue="!help للمساعدة" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prefix">البادئة الافتراضية</Label>
                  <Input id="prefix" defaultValue="!" maxLength={3} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>تفعيل وضع الصيانة</Label>
                    <p className="text-sm text-muted-foreground">إيقاف البوت مؤقتاً للصيانة</p>
                  </div>
                  <Switch />
                </div>

                <Button onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" />
                  حفظ التغييرات
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* إعدادات الذكاء الاصطناعي */}
          <TabsContent value="ai" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات الذكاء الاصطناعي</CardTitle>
                <CardDescription>تخصيص سلوك الذكاء الاصطناعي</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="aiModel">نموذج AI</Label>
                  <Select defaultValue="gemini">
                    <SelectTrigger id="aiModel">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gemini">Google Gemini</SelectItem>
                      <SelectItem value="gpt4">GPT-4</SelectItem>
                      <SelectItem value="claude">Claude</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aiTemperature">درجة الإبداع (Temperature)</Label>
                  <Input id="aiTemperature" type="number" min="0" max="1" step="0.1" defaultValue="0.7" />
                  <p className="text-sm text-muted-foreground">0 = دقيق، 1 = إبداعي</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aiMaxTokens">الحد الأقصى للرموز</Label>
                  <Input id="aiMaxTokens" type="number" defaultValue="2000" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aiSystemPrompt">التعليمات الأساسية</Label>
                  <Textarea
                    id="aiSystemPrompt"
                    placeholder="أدخل التعليمات الأساسية للبوت..."
                    defaultValue="أنت مساعد ذكي يساعد المستخدمين في الإجابة على أسئلتهم بطريقة ودية ومفيدة."
                    rows={4}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>تفعيل الإجابات الطويلة</Label>
                    <p className="text-sm text-muted-foreground">السماح بإجابات أطول من 2000 حرف</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Button onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" />
                  حفظ التغييرات
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* إعدادات الإدارة */}
          <TabsContent value="moderation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات الإدارة</CardTitle>
                <CardDescription>تخصيص أوامر الإدارة والحماية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="muteTime">مدة كتم الصوت (بالدقائق)</Label>
                  <Input id="muteTime" type="number" defaultValue="60" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warningLimit">حد التحذيرات قبل الطرد</Label>
                  <Input id="warningLimit" type="number" defaultValue="3" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>تفعيل الحماية من الرسائل المكررة</Label>
                    <p className="text-sm text-muted-foreground">حظر الرسائل المكررة تلقائياً</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>تفعيل الحماية من الروابط</Label>
                    <p className="text-sm text-muted-foreground">حذف الروابط غير الموثوقة</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>تسجيل الإجراءات الإدارية</Label>
                    <p className="text-sm text-muted-foreground">حفظ سجل لجميع الإجراءات الإدارية</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Button onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" />
                  حفظ التغييرات
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* إعدادات الإشعارات */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات الإشعارات</CardTitle>
                <CardDescription>تخصيص الإشعارات والتنبيهات</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>إشعارات الأوامر الجديدة</Label>
                    <p className="text-sm text-muted-foreground">إخطاري عند تنفيذ أوامر جديدة</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>إشعارات الأخطاء</Label>
                    <p className="text-sm text-muted-foreground">إخطاري عند حدوث أخطاء</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>إشعارات الإجراءات الإدارية</Label>
                    <p className="text-sm text-muted-foreground">إخطاري عند اتخاذ إجراءات إدارية</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>إشعارات الخوادم الجديدة</Label>
                    <p className="text-sm text-muted-foreground">إخطاري عند انضمام البوت لخادم جديد</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Button onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" />
                  حفظ التغييرات
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
