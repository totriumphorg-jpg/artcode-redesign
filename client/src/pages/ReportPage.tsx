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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-slate-600 font-medium">Загрузка отчета о результатах...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Отчет не найден</h2>
          <p className="text-slate-600 mb-6">Возможно, отчет еще формируется или ссылка устарела.</p>
          <Link href="/">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Вернуться на главную</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Все конкурсы и итоги</span>
            </Link>
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
            <Link href="/" className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-tight text-blue-900">ARTCODE</span>
            </Link>
          </div>

          <Link href="/">
            <Button variant="outline" className="border-slate-300 hover:bg-slate-50 font-medium">
              К конкурсам
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Report Body */}
      <main className="flex-grow py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Meta badges */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> {report.category}
              </span>
              <span className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" /> Дата публикации: {report.publishedDate}
              </span>
              {report.periodLabel && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                  Период: {report.periodLabel}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-6">
              {report.title}
            </h1>

            <div className="p-6 bg-blue-50/70 border border-blue-100 rounded-2xl text-blue-950 text-base leading-relaxed mb-8">
              <div className="font-bold text-blue-900 mb-1 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" /> Резюме оргкомитета
              </div>
              {report.summary}
            </div>

            {/* Document Content */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 mb-8 prose prose-slate max-w-none">
              <Streamdown>{report.fullReport}</Streamdown>
            </div>

            {/* Official notice on results publication */}
            <div className="bg-slate-100/80 rounded-2xl p-6 border border-slate-200 text-sm text-slate-700 space-y-2 mb-8">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-blue-600" /> Официальный порядок получения документов:
              </div>
              <p>
                1. Итоги конкурсов и списки лауреатов официально публикуются на сайте <strong>my-artcode.ru</strong> и в сообществе <strong>vk.com/triumph_org</strong>.
              </p>
              <p>
                2. Наградной пакет (диплом международного образца, благодарственное письмо педагогу и персональная экспертная рецензия на официальном бланке) направляется на электронную почту в течение 7 дней с момента публикации отчета.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
              <Link href="/">
                <Button variant="outline" className="w-full sm:w-auto border-slate-300">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Назад к списку конкурсов
                </Button>
              </Link>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                {report.protocolUrl && (
                  <a href={report.protocolUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 font-bold">
                      <FileCheck2 className="w-4 h-4 mr-2" /> Скачать протокол
                    </Button>
                  </a>
                )}
                <Link href="/#competitions" className="w-full sm:w-auto">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold">
                    Выбрать конкурс текущего месяца
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8 border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div>ARTCODE © 2026. Творческое объединение «Триумф».</div>
            <div className="flex items-center gap-4">
              <a href="mailto:hello@my-artcode.com" className="hover:text-white">hello@my-artcode.com</a>
              <a href="tel:+78002508055" className="hover:text-white">8 (800) 250-80-55</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
