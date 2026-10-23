import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { REPORTS_DATA } from '@/const';
import { Calendar, CheckCircle2, FileCheck2, FileText, ShieldCheck } from 'lucide-react';
import { Streamdown } from 'streamdown';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, slug }) => {
  const isStaticGithubPages = typeof window !== 'undefined' && window.location.hostname.endsWith('github.io');
  const staticReport = REPORTS_DATA.find((item) => item.slug === slug);

  const { data: dbReport, isLoading, error } = trpc.reports.bySlug.useQuery(
    { slug },
    { enabled: Boolean(slug) && isOpen && !isStaticGithubPages },
  );

  const report = dbReport || (staticReport ? { ...staticReport, protocolUrl: undefined } : undefined);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        aria-describedby="report-modal-description"
        className="light-artcode-modal grid-cols-1 min-w-0 w-[calc(100vw-1rem)] sm:w-[calc(100vw-2rem)] max-w-4xl bg-white border-slate-200 text-blue-950 max-h-[min(92vh,900px)] overflow-x-hidden overflow-y-auto overscroll-contain p-0 rounded-3xl shadow-2xl"
      >
        <div className="min-w-0 px-4 py-5 sm:px-7 sm:py-7">
          {isLoading && !staticReport ? (
            <div className="min-h-[260px] flex items-center justify-center text-center">
              <div>
                <div className="inline-block animate-spin rounded-full h-9 w-9 border-4 border-amber-500 border-t-transparent mb-3" />
                <p className="text-blue-950 font-medium text-sm">Загрузка отчёта о результатах...</p>
              </div>
            </div>
          ) : error || !report ? (
            <div className="min-h-[260px] flex flex-col items-center justify-center text-center px-2">
              <FileText className="w-10 h-10 text-blue-900 mb-3" />
              <DialogTitle className="text-xl sm:text-2xl font-bold text-blue-950 mb-2">Отчёт не найден</DialogTitle>
              <DialogDescription id="report-modal-description" className="text-slate-600 text-sm mb-5">
                Возможно, отчёт ещё формируется или ссылка устарела.
              </DialogDescription>
              <Button onClick={onClose} className="bg-amber-500 hover:bg-amber-400 text-blue-950 font-bold">
                Вернуться к конкурсам
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader className="min-w-0 pr-7 text-left gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {report.category}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-600 font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-700" /> {report.publishedDate}
                  </span>
                  {report.periodLabel && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-slate-200 text-blue-950">
                      Период: {report.periodLabel}
                    </span>
                  )}
                </div>

                <DialogTitle className="text-xl sm:text-3xl font-extrabold text-blue-950 leading-tight font-serif">
                  {report.title}
                </DialogTitle>
                <DialogDescription id="report-modal-description" className="text-slate-700 text-sm sm:text-base leading-relaxed">
                  Подробные результаты конкурса, списки лауреатов и информация о наградных пакетах.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-5 p-4 sm:p-5 glass-panel rounded-2xl border border-slate-200 text-blue-950 text-sm sm:text-base leading-relaxed">
                <div className="font-bold text-amber-700 mb-1.5 flex items-center gap-1.5 text-sm sm:text-base">
                  <ShieldCheck className="w-4 h-4 text-amber-700" /> Резюме оргкомитета
                </div>
                {report.summary}
              </div>

              <div className="mt-4 glass-panel rounded-2xl border border-slate-200/80 p-4 sm:p-7 prose prose-slate max-w-none text-slate-700 text-xs sm:text-sm leading-relaxed overflow-x-auto">
                <Streamdown>{report.fullReport}</Streamdown>
              </div>

              <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs sm:text-sm text-blue-950 space-y-1.5">
                <div className="font-bold text-blue-950 flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-blue-800" /> Официальный порядок получения документов:
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Официальные наградные дипломы и индивидуальные экспертные рецензии направляются на электронную почту участников в течение 3 рабочих дней после публикации итогов.
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
