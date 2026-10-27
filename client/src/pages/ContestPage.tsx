import React, { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { ASSETS, getJuryImage } from '@/assets';
import { COMPETITIONS_DATA, JURY_MEMBERS } from '@/const';
import { ApplicationModal } from '@/components/ApplicationModal';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  FileText,
  HelpCircle,
  Mail,
  Phone,
  ShieldCheck,
  UserCheck,
  ChevronDown,
  Sparkles,
  Award,
  Lock,
  Download,
} from 'lucide-react';

export default function ContestPage() {
  const [, params] = useRoute('/contest/:slug');
  const slug = params?.slug || '';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string>('goals');
  const isStaticGithubPages = typeof window !== 'undefined' && window.location.hostname.endsWith('github.io');
  const staticContest = COMPETITIONS_DATA.find((item) => item.slug === slug);
  const staticRegulations = staticContest ? [
    {
      id: `${staticContest.slug}-about`,
      sectionKey: 'about',
      title: 'О конкурсе',
      content: staticContest.description,
    },
    {
      id: `${staticContest.slug}-nominations`,
      sectionKey: 'nominations',
      title: 'Номинации и направления',
      content: staticContest.features[0],
    },
    {
      id: `${staticContest.slug}-awards`,
      sectionKey: 'awards',
      title: 'Наградной пакет',
      content: staticContest.features.slice(1).join('. '),
    },
    {
      id: `${staticContest.slug}-timeline`,
      sectionKey: 'timeline',
      title: 'Сроки проведения',
      content: `${staticContest.deadline}. ${staticContest.resultsDate}.`,
    },
    {
      id: `${staticContest.slug}-jury`,
      sectionKey: 'jury',
      title: 'Экспертный совет',
      content: staticContest.juryList.join(', '),
    },
    {
      id: `${staticContest.slug}-fee`,
      sectionKey: 'fee',
      title: 'Финансовые условия',
      content: `Организационный взнос — ${staticContest.feeAmount} руб. за конкурсный номер.`,
    },
  ] : [];

  const { data: dbContest, isLoading, error } = trpc.contests.bySlug.useQuery({ slug }, {
    enabled: Boolean(slug) && !isStaticGithubPages,
  });
  const contest = (dbContest || (staticContest ? {
    ...staticContest,
    receptionPeriod: staticContest.deadline,
    resultsPeriod: staticContest.resultsDate,
    juryNames: staticContest.juryList.join(' | '),
    regulations: staticRegulations,
  } : undefined)) as any;

  if (isLoading && !staticContest) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-amber-500 border-t-transparent mb-3"></div>
          <p className="text-blue-950 font-medium text-sm">Загрузка положения конкурса...</p>
        </div>
      </div>
    );
  }

  if (error || !contest) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-panel rounded-2xl border border-slate-200/80 p-6 sm:p-8 text-center">
          <FileText className="w-10 h-10 text-blue-900 mx-auto mb-3" />
          <h2 className="text-xl sm:text-2xl font-bold text-blue-950 mb-2">Конкурс не найден</h2>
          <p className="text-slate-600 text-sm mb-5">Возможно, конкурс был перенесен или ссылка изменилась.</p>
          <Link href="/">
            <Button className="w-full bg-amber-500 text-blue-950 font-bold">Вернуться на главную</Button>
          </Link>
        </div>
      </div>
    );
  }

  const juryList: string[] = contest.juryNames
    ? contest.juryNames.split(contest.juryNames.includes(' | ') ? ' | ' : ',').map((j: string) => j.trim())
    : [];

  return (
    <div className="light-artcode min-h-screen bg-transparent text-blue-950 flex flex-col font-sans selection:bg-amber-500 selection:text-blue-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/92 backdrop-blur-xl border-b border-slate-200/80 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-950 hover:text-amber-700 transition-colors whitespace-nowrap">
              <ArrowLeft className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>Все конкурсы</span>
            </Link>
            <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
            <Link href="/" className="flex items-center gap-2 truncate">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-blue-950 hover:text-amber-700 transition-colors">
                ARTCODE
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <img
              src={ASSETS.triumphLogo}
              alt="Творческое объединение «Триумф»"
              className="h-7 sm:h-8 w-auto max-w-[120px] sm:max-w-[150px] object-contain opacity-95"
            />
            <Button
              onClick={() => setIsModalOpen(true)}
              className="button-motion bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-blue-950 font-bold px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm shadow-md"
            >
              Подать заявку
            </Button>
          </div>
        </div>
      </header>

      {/* Main Hero of Contest */}
      <section className="relative overflow-hidden py-8 sm:py-12 md:py-14 border-b border-slate-200/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase bg-blue-500/10 text-blue-800 border border-blue-200">
                {contest.disciplineLabel}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/80 border border-slate-200/80 text-blue-950">
                {contest.badge}
              </span>
              {contest.isSeasonal && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 border border-amber-200 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Сезонный спецпроект
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-blue-950 leading-tight mb-4 font-serif">
              {contest.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-700 mb-6 leading-relaxed">
              {contest.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 glass-panel rounded-2xl border border-slate-200/80 mb-6">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-blue-800 flex-shrink-0" />
                <div>
                  <div className="text-xs text-slate-500 font-medium">Срок приема заявок</div>
                  <div className="text-sm font-bold text-blue-950">{contest.receptionPeriod}</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div>
                  <div className="text-xs text-slate-500 font-medium">Подведение итогов</div>
                  <div className="text-sm font-bold text-blue-950">{contest.resultsPeriod}</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <div>
                  <div className="text-xs text-slate-500 font-medium">Организационный взнос</div>
                  <div className="text-sm font-bold text-amber-700">{contest.feeAmount} руб. / номер</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="button-motion bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-blue-950 font-extrabold px-6 py-3 rounded-xl shadow-md shadow-amber-500/20 text-sm sm:text-base"
              >
                Заполнить онлайн-заявку
              </Button>
              <a
                href="#regulations"
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-slate-300 bg-white/85 hover:bg-slate-50 text-blue-950 font-semibold text-sm sm:text-base transition-colors"
              >
                Читать положение
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Jury Members Section */}
      <section className="py-10 sm:py-12 border-b border-slate-200/80 bg-slate-100/65">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-blue-950">Экспертный совет конкурса</h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Работы оценивает коллегия из 3 квалифицированных экспертов
                </p>
              </div>
              <ShieldCheck className="w-7 h-7 text-amber-700 hidden sm:block" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              {juryList.map((name, index) => {
                const matched = JURY_MEMBERS.find((j) => name.toLowerCase().includes(j.name.toLowerCase().split(' ')[0]));
                const imageSrc = matched ? getJuryImage(matched.id) : null;
                const initials = name
                  .split(' ')
                  .map((part) => part.charAt(0))
                  .join('')
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <div key={index} className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-200/80 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 mb-3 border-2 border-amber-500/40 shadow-md flex items-center justify-center">
                      {imageSrc ? (
                        <img src={imageSrc} alt={name} className="block w-full h-full object-contain p-1" />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center bg-white text-amber-700 font-extrabold text-xl">
                          {initials}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-blue-950 text-base mb-0.5">{name}</h3>
                    <p className="text-xs text-amber-700 font-medium">{matched ? matched.role : 'Член экспертного совета'}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{matched ? `${matched.country}, ${matched.city}` : 'Международный эксперт'}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Official Regulations Accordion */}
      <section id="regulations" className="scroll-mt-24 py-10 sm:py-14 border-b border-slate-200/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 border border-amber-200">
                Официальный документ
              </span>
              <div className="mt-3">
                <a
                  href={`/documents/${slug}-polozhenie.docx`}
                  download={`${slug}-polozhenie.docx`}
                  className="button-motion inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-950 font-bold text-xs sm:text-sm shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Скачать положение
                </a>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 mt-2">
                Положение конкурса
              </h2>
              <p className="text-slate-600 mt-1 text-xs sm:text-sm">
                Регламент проведения, цели, номинации, критерии оценки и финансовые условия
              </p>
            </div>

            <div className="space-y-3">
              {contest.regulations && contest.regulations.length > 0 ? (
                contest.regulations.map((sec: any) => {
                  const isOpen = openSection === sec.sectionKey;
                  return (
                    <div
                      key={sec.id}
                      className="glass-panel rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm"
                    >
                      <button
                        onClick={() => setOpenSection(isOpen ? '' : sec.sectionKey)}
                        className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-white/80 transition-colors"
                      >
                        <span className="font-bold text-blue-950 text-sm sm:text-base flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          {sec.title}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180 text-amber-700' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-200/80 whitespace-pre-line">
                          {sec.content}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 glass-panel rounded-2xl border border-slate-200/80 text-xs sm:text-sm text-slate-600">
                  Положение конкурса формируется оргкомитетом. Подайте заявку или обратитесь на hello@my-artcode.com.
                </div>
              )}
            </div>

            {/* Bottom action block inside regulations */}
            <div className="mt-8 p-5 sm:p-6 rounded-2xl glass-panel border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-blue-950">Готовы принять участие?</h3>
                <p className="text-xs text-slate-600 mt-0.5">Заполните простую онлайн-форму прямо сейчас — это займет не более 3 минут</p>
              </div>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="button-motion bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-blue-950 font-bold px-6 py-2.5 rounded-xl shadow-md text-sm whitespace-nowrap"
              >
                Подать заявку
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-white to-slate-50 text-slate-700 py-10 mt-auto border-t border-slate-200/90 shadow-inner">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-extrabold text-xl text-blue-950">ARTCODE</span>
              <span className="text-xs font-semibold text-amber-700">ТО «Триумф»</span>
            </Link>
            <div className="text-xs text-slate-500">
              © 2026 Международная конкурсная платформа ARTCODE. Все права защищены.
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
              <a href="tel:+78002508055" className="hover:text-amber-700 flex items-center gap-1 text-blue-950 font-semibold">
                <Phone className="w-3.5 h-3.5 text-amber-700" /> 8 (800) 250-80-55
              </a>
              <a href="mailto:hello@my-artcode.com" className="hover:text-amber-700 flex items-center gap-1 text-blue-950">
                <Mail className="w-3.5 h-3.5 text-amber-700" /> hello@my-artcode.com
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Application Dialog */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultContestId={slug}
      />
    </div>
  );
}
