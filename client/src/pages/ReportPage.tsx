import React from 'react';
import { useRoute, Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { REPORTS_DATA } from '@/const';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  FileCheck2,
  FileText,
  Mail,
  Phone,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { Streamdown } from 'streamdown';

export default function ReportPage() {
  const [, params] = useRoute('/report/:slug');
  const slug = params?.slug || '';
  const isStaticGithubPages = typeof window !== 'undefined' && window.location.hostname.endsWith('github.io');
  const staticReport = REPORTS_DATA.find((item) => item.slug === slug);

  const { data: dbReport, isLoading, error } = trpc.reports.bySlug.useQuery({ slug }, {
    enabled: Boolean(slug) && !isStaticGithubPages,
  });
  const report = (dbReport || (staticReport ? { ...staticReport, protocolUrl: undefined } : undefined)) as any;

  if (isLoading && !staticReport) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-amber-500 border-t-transparent mb-3"></div>
          <p className="text-blue-950 font-medium text-sm">Загрузка отчета о результатах...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-panel rounded-2xl border border-slate-200/80 p-6 sm:p-8 text-center">
          <FileText className="w-10 h-10 text-blue-900 mx-auto mb-3" />
          <h2 className="text-xl sm:text-2xl font-bold text-blue-950 mb-2">Отчет не найден</h2>
          <p className="text-slate-600 text-sm mb-5">Возможно, отчет еще формируется или ссылка устарела.</p>
          <Link href="/">
            <Button className="w-full bg-amber-500 text-blue-950 font-bold">Вернуться на главную</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="light-artcode min-h-screen bg-transparent text-blue-950 flex flex-col font-sans selection:bg-amber-500 selection:text-blue-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/92 backdrop-blur-xl border-b border-slate-200/80 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-950 hover:text-amber-700 transition-colors whitespace-nowrap">
              <ArrowLeft className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>К конкурсам</span>
            </Link>
            <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
            <Link href="/" className="flex items-center gap-2 truncate">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-blue-950 hover:text-amber-700 transition-colors">
                ARTCODE
              </span>
            </Link>
          </div>

          <Link href="/">
            <Button variant="outline" size="sm" className="border-slate-300 hover:bg-slate-50 text-blue-950 text-xs sm:text-sm rounded-xl">
              Все конкурсы
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Report Body */}
      <main className="flex-grow py-8 sm:py-12 md:py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Meta badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> {report.category}
              </span>
              <span className="text-xs sm:text-sm text-slate-600 font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-700" /> Дата публикации: {report.publishedDate}
              </span>
              {report.periodLabel && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/80 border border-slate-200/80 text-blue-950">
                  Период: {report.periodLabel}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-950 leading-tight mb-4 font-serif">
              {report.title}
            </h1>

            <div className="p-4 sm:p-5 glass-panel rounded-2xl border border-slate-200 text-slate-800 text-sm sm:text-base leading-relaxed mb-6">
              <div className="font-bold text-amber-700 mb-1.5 flex items-center gap-1.5 text-sm sm:text-base">
                <ShieldCheck className="w-4 h-4 text-amber-700" /> Резюме оргкомитета
              </div>
              {report.summary}
            </div>

            {/* Document Content */}
            <div className="glass-panel rounded-2xl border border-slate-200/80 p-5 sm:p-8 mb-6 prose prose-slate max-w-none text-slate-700 text-xs sm:text-sm leading-relaxed">
              <Streamdown>{report.fullReport}</Streamdown>
            </div>

            {/* Official notice on results publication */}
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs sm:text-sm text-blue-950 space-y-1.5 mb-6">
              <div className="font-bold text-blue-950 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-blue-800" /> Официальный порядок получения документов:
              </div>
              <p className="text-slate-700 leading-relaxed">
                Официальные наградные дипломы и индивидуальные экспертные рецензии направляются на электронную почту участников в течение 3 рабочих дней после публикации итогов.
              </p>
            </div>

            <div className="text-center pt-2">
              <Link href="/">
                <Button className="button-motion bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-blue-950 font-bold px-7 py-3 rounded-xl shadow-md text-sm sm:text-base">
                  Перейти к актуальным конкурсам
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/90 text-slate-600 py-6 mt-auto border-t border-slate-200/80 text-xs">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500">
          © 2026 ARTCODE. Все права защищены. Творческое объединение «Триумф».
        </div>
      </footer>
    </div>
  );
}
