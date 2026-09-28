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
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent mb-4"></div>
          <p className="text-slate-700 font-medium">Загрузка положения конкурса...</p>
        </div>
      </div>
    );
  }

  if (error || !contest) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-panel rounded-3xl border border-slate-200/80 p-8 text-center">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Конкурс не найден</h2>
          <p className="text-slate-600 mb-6">Возможно, конкурс был перенесен или ссылка изменилась.</p>
          <Link href="/">
            <Button className="w-full bg-amber-500 text-slate-950 font-bold">Вернуться на главную</Button>
          </Link>
        </div>
      </div>
    );
  }

  const juryList: string[] = contest.juryNames
    ? contest.juryNames.split(contest.juryNames.includes(' | ') ? ' | ' : ',').map((j: string) => j.trim())
    : [];

  return (
    <div className="light-artcode min-h-screen bg-transparent text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-amber-700 transition-colors whitespace-nowrap">
              <ArrowLeft className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>Все конкурсы</span>
            </Link>
            <div className="h-5 w-px bg-slate-100 hidden sm:block"></div>
            <Link href="/" className="flex items-center gap-2 truncate">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 hover:text-amber-700 transition-colors">
                ARTCODE
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <img src={ASSETS.triumphLogo} alt="ТО Триумф" className="h-8 w-auto object-contain hidden md:block opacity-90" />
            <Button
              onClick={() => setIsModalOpen(true)}
              className="button-motion bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-slate-950 font-bold px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm shadow-md"
            >
              Подать заявку
            </Button>
          </div>
        </div>
      </header>

      {/* Main Hero of Contest */}
      <section className="relative overflow-hidden py-12 md:py-20 border-b border-slate-200/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-blue-500/10 text-blue-700 border border-blue-200">
                {contest.disciplineLabel}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/80 border border-slate-200/80 text-slate-700">
                {contest.badge}
              </span>
              {contest.isSeasonal && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 border border-amber-200 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Сезонный спецпроект
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6 font-serif">
              {contest.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-700 mb-8 leading-relaxed">
              {contest.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 glass-panel rounded-2xl border border-slate-200/80 mb-8">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-700 flex-shrink-0" />
                <div>
                  <div className="text-xs text-slate-600 font-medium">Срок приема заявок</div>
                  <div className="text-sm font-bold text-slate-900">{contest.receptionPeriod}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <div className="text-xs text-slate-600 font-medium">Подведение итогов</div>
                  <div className="text-sm font-bold text-slate-900">{contest.resultsPeriod}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-amber-700 flex-shrink-0" />
                <div>
                  <div className="text-xs text-slate-600 font-medium">Организационный взнос</div>
                  <div className="text-sm font-bold text-amber-700">{contest.feeAmount} руб. / номер</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="button-motion bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-slate-950 font-extrabold px-8 py-3.5 rounded-xl shadow-lg shadow-amber-500/25 text-base"
              >
                Заполнить онлайн-заявку
              </Button>
              <a
                href="#regulations"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-slate-300 bg-white/80 hover:bg-slate-50 text-slate-900 font-semibold text-base transition-colors"
              >
                Читать положение
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Jury Members Section */}
      <section className="py-14 border-b border-slate-200/80 bg-slate-100/65">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Экспертный совет конкурса</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Работы оценивает коллегия из 3 квалифицированных экспертов
                </p>
              </div>
              <ShieldCheck className="w-8 h-8 text-amber-700 hidden sm:block" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <div key={index} className="glass-panel rounded-2xl p-5 border border-slate-200/80 flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 mb-4 border-2 border-amber-500/40 shadow-lg flex items-center justify-center">
                      {imageSrc ? (
                        <img src={imageSrc} alt={name} className="block w-full h-full object-contain p-1" />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center bg-white text-amber-700 font-extrabold text-2xl">
                          {initials}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">{name}</h3>
                    <p className="text-xs text-amber-700/90 font-medium">{matched ? matched.role : 'Член экспертного совета'}</p>
                    <p className="text-[11px] text-slate-600 mt-1">{matched ? `${matched.country}, ${matched.city}` : 'Международный эксперт'}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Official Regulations Accordion */}
      <section id="regulations" className="py-16 border-b border-slate-200/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 border border-amber-200">
                Официальный документ
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
                Положение конкурса
              </h2>
              <p className="text-slate-600 mt-2 text-sm sm:text-base">
                Регламент проведения, цели, номинации, критерии оценки и финансовые условия
              </p>
            </div>

            <div className="space-y-4">
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
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/80 transition-colors"
                      >
                        <span className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-3">
                          <FileText className="w-5 h-5 text-amber-700" />
                          {sec.title}
                        </span>
                        <ChevronDown className={`w-5 h-5 text-slate-600 transition-transform ${isOpen ? 'rotate-180 text-amber-700' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-6 pt-2 text-sm text-slate-700 leading-relaxed border-t border-slate-200/80 whitespace-pre-line">
                          {sec.content}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-8 glass-panel rounded-2xl border border-slate-200/80 text-center text-slate-600">
                  Положение конкурса формируется оргкомитетом. Вы можете подать заявку уже сейчас.
                </div>
              )}
            </div>

            <div className="mt-12 text-center">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="button-motion bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-slate-950 font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-amber-500/25 text-base"
              >
                Подать заявку на участие в конкурсе
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/85 text-slate-600 py-10 mt-auto border-t border-slate-200/80 text-xs">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 ARTCODE. Все права защищены. Творческое объединение «Триумф».</div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-slate-900">На главную</Link>
            <span>•</span>
            <Link href="/admin" className="text-amber-700 hover:text-amber-700">Вход для организаторов</Link>
          </div>
        </div>
      </footer>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultContestId={contest.slug}
      />
    </div>
  );
}
