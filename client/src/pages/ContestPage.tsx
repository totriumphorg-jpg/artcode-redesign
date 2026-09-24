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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-slate-600 font-medium">Загрузка положения конкурса...</p>
        </div>
      </div>
    );
  }

  if (error || !contest) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Конкурс не найден</h2>
          <p className="text-slate-600 mb-6">Возможно, конкурс был перенесен или ссылка изменилась.</p>
          <Link href="/">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Вернуться на главную</Button>
          </Link>
        </div>
      </div>
    );
  }

  const juryList: string[] = contest.juryNames
    ? contest.juryNames.split(contest.juryNames.includes(' | ') ? ' | ' : ',').map((j: string) => j.trim())
    : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Все конкурсы</span>
            </Link>
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
            <Link href="/" className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-tight text-blue-900">ARTCODE</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <img src={ASSETS.triumphLogo} alt="ТО Триумф" className="h-9 w-auto object-contain hidden md:block opacity-90" />
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all"
            >
              Подать заявку
            </Button>
          </div>
        </div>
      </header>

      {/* Main Hero of Contest */}
      <section className="bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-slate-200 py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-blue-100 text-blue-800">
                {contest.disciplineLabel}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                {contest.badge}
              </span>
              {contest.isSeasonal && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Сезонный спецпроект
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
              {contest.title}
            </h1>

            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              {contest.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm mb-8">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <div className="text-xs text-slate-500 font-medium">Срок приема заявок</div>
                  <div className="text-sm font-bold text-slate-900">{contest.receptionPeriod}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <div className="text-xs text-slate-500 font-medium">Подведение итогов</div>
                  <div className="text-sm font-bold text-slate-900">{contest.resultsPeriod}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <div>
                  <div className="text-xs text-slate-500 font-medium">Организационный взнос</div>
                  <div className="text-sm font-bold text-slate-900">{contest.feeAmount} руб. / номер</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl shadow-md transition-all text-base"
              >
                Заполнить онлайн-заявку
              </Button>
              <a href="#regulations" className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base transition-colors">
                Читать положение
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Jury Members Section */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Экспертный совет конкурса</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Работы оценивает коллегия из 3 квалифицированных экспертов
                </p>
              </div>
              <ShieldCheck className="w-8 h-8 text-blue-600 hidden sm:block" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {juryList.map((name, index) => {
                // Ищем портрет в существующих экспертах
                const matched = JURY_MEMBERS.find((j) => name.toLowerCase().includes(j.name.toLowerCase().split(' ')[0]));
                const imageSrc = matched ? getJuryImage(matched.id) : null;
                const initials = name
                  .split(' ')
                  .map((part) => part.charAt(0))
                  .join('')
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <div key={index} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-200 mb-4 border-2 border-white shadow-sm flex items-center justify-center">
                      {imageSrc ? (
                        <img src={imageSrc} alt={name} className="block w-full h-full object-contain p-1" />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-slate-200 text-blue-800 font-extrabold text-2xl">
                          {initials}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">{name}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {matched ? matched.role : 'Член международной экспертной коллегии'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Regulations Accordion Sections */}
      <section id="regulations" className="py-14 bg-slate-50 flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                Официальный документ
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
                Положение о проведении конкурса
              </h2>
              <p className="text-slate-600 mt-2 text-sm sm:text-base">
                Ознакомьтесь с подробными регламентами, номинациями и критериями оценки
              </p>
            </div>

            <div className="space-y-3">
              {contest.regulations && contest.regulations.length > 0 ? (
                contest.regulations.map((reg: any) => {
                  const isOpen = openSection === reg.sectionKey;
                  return (
                    <div
                      key={reg.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-200"
                    >
                      <button
                        onClick={() => setOpenSection(isOpen ? '' : reg.sectionKey)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors"
                      >
                        <span className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                          {reg.title}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''}`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-6 pt-2 text-slate-700 text-sm sm:text-base leading-relaxed border-t border-slate-100 whitespace-pre-line">
                          {reg.content}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
                  Положение конкурса формируется оргкомитетом.
                </div>
              )}
            </div>

            <div className="mt-10 p-6 bg-blue-600 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
              <div>
                <h3 className="text-xl font-bold">Готовы принять участие?</h3>
                <p className="text-blue-100 text-sm mt-1">
                  Заполните заявку и прикрепите ссылку на конкурсный номер.
                </p>
              </div>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-7 py-3 rounded-xl shadow whitespace-nowrap"
              >
                Подать заявку
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-10 border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-sm">
            <div>
              <span className="font-extrabold text-xl text-white tracking-tight">ARTCODE</span>
              <p className="text-slate-400 text-xs mt-1">Творческое объединение «Триумф» © 2026. Все права защищены.</p>
            </div>
            <div className="flex items-center gap-6 text-xs text-slate-400">
              <a href="mailto:hello@my-artcode.com" className="hover:text-white transition-colors flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-amber-400" /> hello@my-artcode.com
              </a>
              <a href="tel:+78002508055" className="hover:text-white transition-colors flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-amber-400" /> 8 (800) 250-80-55
              </a>
            </div>
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
