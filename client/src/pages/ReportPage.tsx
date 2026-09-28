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
      <div className="min-h-screen bg-[#060913] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent mb-4"></div>
          <p className="text-slate-300 font-medium">Загрузка отчета о результатах...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-[#060913] flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-panel rounded-3xl border border-white/10 p-8 text-center">
          <FileText className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Отчет не найден</h2>
          <p className="text-slate-400 mb-6">Возможно, отчет еще формируется или ссылка устарела.</p>
          <Link href="/">
            <Button className="w-full bg-amber-500 text-slate-950 font-bold">Вернуться на главную</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#080d1a]/90 backdrop-blur-xl border-b border-white/10 shadow-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-amber-400 transition-colors whitespace-nowrap">
              <ArrowLeft className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>К конкурсам</span>
            </Link>
            <div className="h-5 w-px bg-white/15 hidden sm:block"></div>
            <Link href="/" className="flex items-center gap-2 truncate">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white hover:text-amber-400 transition-colors">
                ARTCODE
              </span>
            </Link>
          </div>

          <Link href="/">
            <Button variant="outline" className="border-white/20 hover:bg-white/10 text-slate-200 text-xs sm:text-sm rounded-xl">
              Все конкурсы
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Report Body */}
      <main className="flex-grow py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Meta badges */}
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> {report.category}
              </span>
              <span className="text-xs sm:text-sm text-slate-400 font-medium flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400" /> Дата публикации: {report.publishedDate}
              </span>
              {report.periodLabel && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-slate-300">
                  Период: {report.periodLabel}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-6 font-serif">
              {report.title}
            </h1>

            <div className="p-6 glass-panel rounded-2xl border border-white/15 text-slate-200 text-base leading-relaxed mb-8">
              <div className="font-bold text-amber-400 mb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" /> Резюме оргкомитета
              </div>
              {report.summary}
            </div>

            {/* Document Content */}
            <div className="glass-panel rounded-3xl border border-white/10 p-6 sm:p-10 mb-8 prose prose-invert max-w-none text-slate-300">
              <Streamdown>{report.fullReport}</Streamdown>
            </div>

            {/* Official notice on results publication */}
            <div className="p-6 rounded-2xl bg-blue-950/40 border border-blue-500/30 text-sm text-blue-200 space-y-2 mb-8">
              <div className="font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-blue-400" /> Официальный порядок получения документов:
              </div>
              <p>
                Официальные наградные дипломы и индивидуальные экспертные рецензии направляются на электронную почту участников в течение 3 рабочих дней после публикации итогов.
              </p>
            </div>

            <div className="text-center pt-4">
              <Link href="/">
                <Button className="button-motion bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-8 py-3 rounded-xl shadow-lg shadow-amber-500/20 text-base">
                  Перейти к актуальным конкурсам
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-slate-500 py-10 mt-auto border-t border-white/10 text-xs">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          © 2026 ARTCODE. Все права защищены. Творческое объединение «Триумф».
        </div>
      </footer>
    </div>
  );
}
