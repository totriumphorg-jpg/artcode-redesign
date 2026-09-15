import React, { useState } from 'react';
import {
  COMPETITIONS_DATA,
  JURY_MEMBERS,
  PARTNERS_DATA,
  RECENT_WINNERS,
  PARTICIPATION_RULES,
  FAQ_DATA,
} from '@/const';
import { ApplicationModal } from '@/components/ApplicationModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Award,
  Globe2,
  Calendar,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Star,
  Users,
  Music,
  ArrowRight,
  FileCheck2,
  Mail,
  Send,
  HelpCircle,
  ExternalLink,
  Flame,
  Check,
  Menu,
  X,
  CreditCard,
  Building2,
  HeartHandshake,
  Video,
  FileText
} from 'lucide-react';

export default function Home() {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCompId, setActiveCompId] = useState<string>('misteriya-vokala');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterName, setNewsletterName] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredCompetitions =
    selectedDiscipline === 'all'
      ? COMPETITIONS_DATA
      : COMPETITIONS_DATA.filter((c) => c.discipline === selectedDiscipline);

  const handleOpenModal = (compId: string) => {
    setActiveCompId(compId);
    setModalOpen(true);
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950 overflow-x-hidden">
      {/* Top Banner */}
      <div className="bg-[#0b1329] border-b border-amber-500/20 py-2.5 px-4 text-center text-xs sm:text-sm text-amber-200/90 flex items-center justify-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Открыт прием заявок на ежемесячные международные проекты • <strong>Итоги через 14 дней</strong></span>
        <button
          onClick={() => handleOpenModal('misteriya-vokala')}
          className="ml-2 underline font-semibold text-amber-300 hover:text-white transition-colors"
        >
          Подать заявку &rarr;
        </button>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#020617]/90 backdrop-blur-xl border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-serif text-slate-950 font-bold text-xl shadow-lg shadow-amber-500/20">
              A
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-serif font-black tracking-wider text-white">
                ART<span className="text-amber-400">CODE</span>
              </span>
              <span className="block text-[10px] tracking-widest uppercase text-slate-400 -mt-1 font-medium">
                CA Triumph • CID UNESCO
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
            <a href="#competitions" className="hover:text-amber-400 transition-colors">
              Конкурсы
            </a>
            <a href="#steps" className="hover:text-amber-400 transition-colors">
              Как принять участие
            </a>
            <a href="#rules" className="hover:text-amber-400 transition-colors">
              Требования к видео
            </a>
            <a href="#jury" className="hover:text-amber-400 transition-colors">
              Экспертный совет
            </a>
            <a href="#winners" className="hover:text-amber-400 transition-colors">
              Итоги и призеры
            </a>
            <a href="#partners" className="hover:text-amber-400 transition-colors">
              Партнеры
            </a>
            <a href="#faq" className="hover:text-amber-400 transition-colors">
              Вопросы
            </a>
          </nav>

          <div className="hidden sm:flex items-center gap-3">
            <Button
              onClick={() => handleOpenModal('misteriya-vokala')}
              className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-semibold px-5 py-2 rounded-xl shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all text-sm"
            >
              Подать заявку
            </Button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white"
            aria-label="Открыть меню"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-800 bg-[#0f172a] px-4 py-5 space-y-4">
            <nav className="flex flex-col gap-3 text-sm font-medium text-slate-200">
              <a
                href="#competitions"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-amber-400"
              >
                Конкурсы
              </a>
              <a
                href="#steps"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-amber-400"
              >
                Как принять участие
              </a>
              <a
                href="#rules"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-amber-400"
              >
                Требования к видео
              </a>
              <a
                href="#jury"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-amber-400"
              >
                Экспертный совет
              </a>
              <a
                href="#winners"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-amber-400"
              >
                Итоги и призеры
              </a>
              <a
                href="#partners"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-amber-400"
              >
                Партнеры
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-amber-400"
              >
                Вопросы и ответы
              </a>
            </nav>
            <Button
              onClick={() => {
                setMobileMenuOpen(false);
                handleOpenModal('misteriya-vokala');
              }}
              className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-2.5 rounded-xl"
            >
              Подать заявку онлайн
            </Button>
          </div>
        )}
      </header>

      {/* Hero Section with High-Contrast Atmosphere */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden bg-gradient-to-b from-[#020617] via-[#09122c] to-[#020617]">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-amber-500/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0f172a] border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Всемирный проект Творческого Объединения «Триумф»</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-tight text-white leading-[1.1] mb-6">
            Творческие конкурсы <br className="hidden sm:inline" />
            <span className="gold-gradient-text">мирового уровня</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
            Онлайн-платформа для проведения международных творческих конкурсов мирового значения. Выйдите на новый уровень мастерства: абсолютная обратная связь от мировых экспертов, международный диплом и рецензия на официальном бланке.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Button
              onClick={() => handleOpenModal('misteriya-vokala')}
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold px-8 py-6 rounded-2xl text-base shadow-xl shadow-amber-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Подать заявку на конкурс</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
            <a
              href="#competitions"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl border border-slate-700 bg-[#0f172a] hover:bg-[#1e293b] text-slate-200 hover:text-white transition-all text-sm font-semibold flex items-center justify-center gap-2"
            >
              <span>Ознакомиться со списком</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Core Trust Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-[#0f172a]/80 border border-slate-800 backdrop-blur-md">
            <div className="text-center p-2">
              <div className="text-2xl sm:text-4xl font-serif font-bold text-amber-400 mb-1">12+</div>
              <div className="text-xs sm:text-sm text-slate-400">Стран в экспертном совете</div>
            </div>
            <div className="text-center p-2">
              <div className="text-2xl sm:text-4xl font-serif font-bold text-amber-400 mb-1">14 дней</div>
              <div className="text-xs sm:text-sm text-slate-400">Срок подведения итогов</div>
            </div>
            <div className="text-center p-2">
              <div className="text-2xl sm:text-4xl font-serif font-bold text-amber-400 mb-1">100%</div>
              <div className="text-xs sm:text-sm text-slate-400">Дипломы с синими печатями</div>
            </div>
            <div className="text-center p-2">
              <div className="text-2xl sm:text-4xl font-serif font-bold text-amber-400 mb-1">Гранты</div>
              <div className="text-xs sm:text-sm text-slate-400">Поездки на очные фестивали</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Accreditations Ribbon */}
      <section className="py-6 border-y border-slate-800 bg-[#070d1e]">
        <div className="container mx-auto px-4 sm:px-6">
          <p className="text-center text-xs uppercase tracking-widest text-slate-400 font-semibold mb-4">
            В организационный комитет входят CA Triumph и образовательная платформа ARTCOMPASS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-400">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <ShieldCheck className="w-4 h-4 text-amber-400" /> CID UNESCO Paris
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Award className="w-4 h-4 text-amber-400" /> ТО «Триумф»
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Globe2 className="w-4 h-4 text-amber-400" /> Progetto Voce (Италия)
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Star className="w-4 h-4 text-amber-400" /> Cap Ferret Music Festival (Франция)
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-amber-400" /> ARTCOMPASS
            </span>
          </div>
        </div>
      </section>

      {/* Competitions Catalog Section */}
      <section id="competitions" className="py-20 bg-[#020617] relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-3">
                <Flame className="w-3.5 h-3.5" /> Проекты платформы
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
                Выберите проект для участия
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
                Одновременно на платформе открыт прием заявок на несколько конкурсов. Каждый месяц проекты обновляются. Подведение итогов проходит через 14 дней.
              </p>
            </div>

            {/* Discipline Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-[#0f172a] border border-slate-800 rounded-2xl overflow-x-auto max-w-full">
              {[
                { id: 'all', label: 'Все проекты' },
                { id: 'vocal', label: 'Вокал' },
                { id: 'choreography', label: 'Хореография' },
                { id: 'theater', label: 'Театр' },
                { id: 'instrumental', label: 'Инструментал' },
                { id: 'circus', label: 'Цирк' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedDiscipline(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    selectedDiscipline === tab.id
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompetitions.map((comp) => (
              <div
                key={comp.id}
                className="group relative flex flex-col justify-between rounded-3xl bg-[#0f172a] border border-slate-800 hover:border-amber-500/40 transition-all duration-300 p-6 sm:p-7 hover:shadow-2xl hover:shadow-amber-500/10"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      {comp.disciplineLabel}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {comp.deadline}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-white group-hover:text-amber-300 transition-colors mb-3 leading-snug">
                    {comp.title}
                  </h3>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-5">
                    {comp.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {comp.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#020617] border border-slate-800 mb-6 text-xs">
                    <div className="text-slate-400 text-[11px] mb-1">Призовой фонд:</div>
                    <div className="text-amber-400 font-semibold">{comp.grandPrix}</div>
                    <div className="text-slate-400 text-[11px] mt-2">Эксперты конкурса:</div>
                    <div className="text-slate-300">{comp.juryPreview}</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="block text-[11px] text-slate-400">Срок оценки</span>
                    <span className="text-xs font-semibold text-slate-200">{comp.resultsDate}</span>
                  </div>

                  <Button
                    onClick={() => handleOpenModal(comp.id)}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md active:scale-[0.98] transition-all"
                  >
                    Подать заявку
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Package Contents Section */}
      <section className="py-16 bg-[#080e22] border-y border-slate-800">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              В пакет участника конкурса обязательно включены:
            </h2>
            <p className="text-slate-300 text-sm mt-2">
              Официальные документы с печатями и подписями для подтверждения квалификации и профессионального портфолио
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 text-left">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-4 border border-amber-400/20">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white mb-2">Диплом международного образца</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Официальный диплом с указанием степени лауреатства или звания дипломанта на бланке ТО «Триумф».
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 text-left">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-4 border border-amber-400/20">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white mb-2">Благодарственное письмо педагогу</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Именная благодарность преподавателям и руководителям коллективов для успешного прохождения аттестации.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 text-left">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-4 border border-amber-400/20">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white mb-2">Именная рецензия экспертов</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                В большинстве проектов артисты получают рецензию с рекомендациями специалистов экспертного совета с мировым именем на официальном бланке с печатями и подписями.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 text-left">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-4 border border-amber-400/20">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white mb-2">Призовой фонд и гранты</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Бесплатные поездки и гранты на очные конкурсы ТО «Триумф», ценные призы, сертификаты и подарки от партнеров.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Step by Step from original site */}
      <section id="steps" className="py-20 bg-[#020617]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-3">
              Инструкция
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              Как принять участие в конкурсе
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Простая последовательность подачи заявки и получения итогов
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-[#0f172a] border border-slate-800 text-left">
              <div className="text-3xl font-serif font-black text-amber-400 mb-3">Шаг 1</div>
              <h3 className="text-lg font-serif font-bold text-white mb-2">Выберите проект</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Выберите проект из списка: многожанровый конкурс или узкопрофильные проекты в рамках дисциплины (вокал, танцы, театр, цирк, инструменты).
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0f172a] border border-slate-800 text-left">
              <div className="text-3xl font-serif font-black text-amber-400 mb-3">Шаг 2</div>
              <h3 className="text-lg font-serif font-bold text-white mb-2">Оформите материал</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Запишите живое выступление на статичную камеру (HD от 720p) и разместите ссылку на YouTube, Vimeo, VK Видео, Яндекс.Диске или Google Диске.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0f172a] border border-slate-800 text-left">
              <div className="text-3xl font-serif font-black text-amber-400 mb-3">Шаг 3</div>
              <h3 className="text-lg font-serif font-bold text-white mb-2">Отправьте заявку и оплатите</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Заполните онлайн-форму, прикрепите ссылку на материал и оплатите организационный взнос банковской картой МИР / картой российского банка.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0f172a] border border-slate-800 text-left">
              <div className="text-3xl font-serif font-black text-amber-400 mb-3">Шаг 4</div>
              <h3 className="text-lg font-serif font-bold text-white mb-2">Дождитесь объявления итогов</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Через 14 дней оглашаются результаты на основании баллов в протоколах. В течение 7 дней наградной пакет отправляется на ваш e-mail.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Button
              onClick={() => handleOpenModal('misteriya-vokala')}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-8 py-3 rounded-xl text-sm shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all"
            >
              Заполнить онлайн-заявку прямо сейчас
            </Button>
          </div>
        </div>
      </section>

      {/* Rules Section - Verbatim from original */}
      <section id="rules" className="py-16 bg-[#080e22] border-y border-slate-800">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-3">
              Положение и регламент
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Правила оформления конкурсного материала
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Официальные требования к видеозаписям и работам для объективной экспертной оценки
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {PARTICIPATION_RULES.map((block, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 text-left">
                <h3 className="text-base font-serif font-bold text-white mb-3 flex items-center gap-2">
                  <Video className="w-4 h-4 text-amber-400 shrink-0" />
                  {block.title}
                </h3>
                <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                  {block.rules.map((rule, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs max-w-4xl mx-auto mt-6 text-center">
            <strong>Важная информация по оплате:</strong> Оплата участия в конкурсе возможна банковской картой, выпущенной российским банком, или картами зарубежных банков с платежной системой МИР. Для уточнения информации по платежам картами банков стран СНГ напишите e-mail на <a href="mailto:hello@my-artcode.com" className="underline font-bold text-amber-300">hello@my-artcode.com</a>
          </div>
        </div>
      </section>

      {/* Jury Section */}
      <section id="jury" className="py-20 bg-[#020617]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-3">
                Жюри мирового значения
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
                Экспертный совет платформы ARTCODE
              </h2>
              <p className="text-slate-400 text-sm mt-2 max-w-xl">
                В экспертные советы конкурсов приглашены действующие артисты и педагоги ведущих творческих вузов мира.
              </p>
            </div>
            <div className="text-xs text-amber-300 font-medium">
              Именная рецензия с рекомендациями каждому участнику
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {JURY_MEMBERS.map((member) => (
              <div
                key={member.id}
                className="p-6 rounded-3xl bg-[#0f172a] border border-slate-800 flex flex-col justify-between hover:border-amber-500/30 transition-all text-left"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-500/30 flex items-center justify-center font-serif font-bold text-lg text-amber-300 mb-4">
                    {member.avatarText}
                  </div>
                  <h3 className="text-lg font-serif font-bold text-white mb-1">{member.name}</h3>
                  <div className="text-xs text-amber-400 font-medium mb-1">
                    {member.country}, {member.city}
                  </div>
                  <div className="text-[11px] text-slate-400 font-semibold mb-3">{member.role}</div>
                  <p className="text-xs text-slate-300 leading-relaxed">{member.credentials}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Winners Section */}
      <section id="winners" className="py-20 bg-[#080e22] border-y border-slate-800">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-3">
              Итоги конкурсов
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              Победители и обладатели Гран-при
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Официальные итоги прошедших конкурсов платформы ARTCODE
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {RECENT_WINNERS.map((win) => (
              <div
                key={win.id}
                className="p-6 rounded-3xl bg-[#0f172a] border border-slate-800 flex flex-col justify-between text-left"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="text-amber-400 font-medium">{win.award}</span>
                    <span>{win.date}</span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-white mb-1">{win.winner}</h3>
                  <div className="text-xs text-slate-400 mb-3">
                    Руководитель: <span className="text-slate-200">{win.director}</span>
                  </div>
                  <p className="text-xs text-slate-300 mb-3 bg-[#020617] p-3 rounded-xl border border-slate-800">
                    <strong>Проект:</strong> {win.competition}
                  </p>
                </div>
                <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 pt-2 border-t border-slate-800">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{win.specialPrize}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="py-16 bg-[#020617]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl font-serif font-bold text-white">
              Партнеры конкурсов
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Поддержку проведению конкурсов оказывают престижные европейские и международные культурные ассоциации
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {PARTNERS_DATA.map((p, idx) => (
              <a
                key={idx}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-amber-500/40 transition-all text-center group"
              >
                <div className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                  {p.name}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">{p.country}</div>
                <div className="text-[10px] text-amber-400/90 mt-1">{p.category}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-[#080e22] border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-white">
              Часто задаваемые вопросы
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Информация по регламенту, судейству и выдаче дипломов
            </p>
          </div>

          <div className="space-y-4">
            {FAQ_DATA.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 text-left"
              >
                <h3 className="text-base font-serif font-semibold text-white flex items-center gap-2 mb-2">
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  {item.q}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-6">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-[#020617] border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold mb-4">
            <Mail className="w-3.5 h-3.5" /> Подписка на рассылку
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-3">
            Будьте в курсе новых конкурсов и грантов
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mb-6 max-w-md mx-auto">
            Подпишись и будь в курсе новых конкурсов, вручений специальных призов и розыгрышей денежных грантов!
          </p>

          {!newsletterSubscribed ? (
            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="text"
                placeholder="Имя"
                value={newsletterName}
                onChange={(e) => setNewsletterName(e.target.value)}
                className="bg-[#0f172a] border-slate-700 text-white rounded-xl text-sm"
              />
              <Input
                type="email"
                required
                placeholder="E-mail *"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="bg-[#0f172a] border-slate-700 text-white rounded-xl text-sm"
              />
              <Button
                type="submit"
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-2 rounded-xl text-sm shrink-0"
              >
                Подписаться
              </Button>
            </form>
          ) : (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm max-w-md mx-auto flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Вы успешно подписаны на новости ARTCODE!</span>
            </div>
          )}

          <p className="text-[11px] text-slate-400 mt-3">
            Согласие на обработку персональных данных в соответствии с <a href="http://www.triumph-org.ru/ru/terms" target="_blank" rel="noopener noreferrer" className="underline text-slate-300">политикой безопасности</a>
          </p>

          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-400">
            <span>Электронная почта оргкомитета: <a href="mailto:hello@my-artcode.com" className="text-amber-400 hover:underline">hello@my-artcode.com</a></span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-[#020617] border-t border-slate-900 text-xs text-slate-400">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 font-serif font-black flex items-center justify-center text-sm">
              A
            </div>
            <div>
              <div className="text-white font-serif font-bold text-sm">ARTCODE</div>
              <div>Всемирный проект Творческого Объединения «Триумф» (CA TRIUMPH).</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <a href="https://vk.com/triumph_org" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
              ВКонтакте
            </a>
            <a href="https://ok.ru/triumphorg/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
              Одноклассники
            </a>
            <a href="https://triumph-org.ru/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
              CA Triumph
            </a>
            <a href="http://artcompass.ru/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
              ARTCOMPASS
            </a>
            <a href="http://www.triumph-org.ru/ru/terms" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
              Политика безопасности
            </a>
          </div>
        </div>
      </footer>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultCompetitionId={activeCompId}
      />
    </div>
  );
}
