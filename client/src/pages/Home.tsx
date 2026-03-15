import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { Bot, Zap, Shield, Brain, Users, BarChart3 } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-purple-500/20 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bot className="h-8 w-8 text-purple-400" />
            <span className="text-xl font-bold text-white">Discord AI Bot</span>
          </div>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setLocation("/dashboard")}
                  className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
                >
                  الداشبورد
                </Button>
                <Button
                  variant="ghost"
                  onClick={logout}
                  className="text-white hover:bg-purple-500/20"
                >
                  تسجيل الخروج
                </Button>
              </>
            ) : (
              <Button
                onClick={() => window.location.href = getLoginUrl()}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                تسجيل الدخول
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            بوت ديسكورد ذكي مع
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              {" "}الذكاء الاصطناعي
            </span>
          </h1>
          <p className="text-xl text-gray-300">
            بوت متكامل يجمع بين إمكانيات الإدارة القوية والذكاء الاصطناعي المتقدم لتحسين تجربة خادمك
          </p>
          <div className="flex gap-4 justify-center pt-4">
            {isAuthenticated ? (
              <Button
                size="lg"
                onClick={() => setLocation("/dashboard")}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8"
              >
                اذهب إلى الداشبورد
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  onClick={() => window.location.href = getLoginUrl()}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                >
                  ابدأ الآن
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-purple-500 text-purple-400 hover:bg-purple-500/10 px-8"
                >
                  اعرف المزيد
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-16">المميزات الرئيسية</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-slate-800/50 border-purple-500/20 hover:border-purple-500/50 transition-colors">
            <CardHeader>
              <Brain className="h-8 w-8 text-purple-400 mb-2" />
              <CardTitle className="text-white">ذكاء اصطناعي متقدم</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                تقنية Gemini AI للإجابة على الأسئلة والمساعدة في حل المشاكل بذكاء
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/20 hover:border-purple-500/50 transition-colors">
            <CardHeader>
              <Shield className="h-8 w-8 text-purple-400 mb-2" />
              <CardTitle className="text-white">إدارة قوية</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                أوامر إدارية متقدمة للطرد والحظر والتحذير وكتم الصوت
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/20 hover:border-purple-500/50 transition-colors">
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-purple-400 mb-2" />
              <CardTitle className="text-white">لوحة تحكم شاملة</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                داشبورد احترافي لمراقبة الإحصائيات وإدارة الخوادم
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/20 hover:border-purple-500/50 transition-colors">
            <CardHeader>
              <Zap className="h-8 w-8 text-purple-400 mb-2" />
              <CardTitle className="text-white">سرعة عالية</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                استجابة فورية وأداء محسّن لأفضل تجربة مستخدم
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/20 hover:border-purple-500/50 transition-colors">
            <CardHeader>
              <Users className="h-8 w-8 text-purple-400 mb-2" />
              <CardTitle className="text-white">سهولة الاستخدام</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                واجهة بديهية وأوامر سهلة التذكر والاستخدام
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-purple-500/20 hover:border-purple-500/50 transition-colors">
            <CardHeader>
              <Bot className="h-8 w-8 text-purple-400 mb-2" />
              <CardTitle className="text-white">قابل للتخصيص</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                إعدادات مرنة لتخصيص البوت حسب احتياجات خادمك
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-purple-400">12+</div>
            <p className="text-gray-300 mt-2">خوادم نشطة</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-400">1,200+</div>
            <p className="text-gray-300 mt-2">مستخدم نشط</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-400">10,000+</div>
            <p className="text-gray-300 mt-2">أمر منفذ</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-400">99.9%</div>
            <p className="text-gray-300 mt-2">وقت التشغيل</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-12 max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold text-white mb-4">جاهز للبدء؟</h3>
          <p className="text-white/90 mb-6">
            انضم إلى آلاف الخوادم التي تستخدم بوتنا الذكي
          </p>
          {!isAuthenticated && (
            <Button
              size="lg"
              onClick={() => window.location.href = getLoginUrl()}
              className="bg-white text-purple-600 hover:bg-gray-100 px-8"
            >
              ابدأ الآن مجاناً
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 bg-slate-900/50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© 2024 Discord AI Bot. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
