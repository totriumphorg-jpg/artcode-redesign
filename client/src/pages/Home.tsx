import React, { useState } from 'react';
import {
  COMPETITIONS_DATA,
  JURY_MEMBERS,
  PARTNERS_DATA,
  RECENT_WINNERS,
  FAQ_DATA,
  Competition,
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
  Download,
  FileCheck2,
  Mail,
  Send,
  HelpCircle,
  ExternalLink,
  SlidersHorizontal,
  Flame,
  Check,
  Menu,
  X,
  CreditCard,
  Building2,
  HeartHandshake
} from 'lucide-react';

export default function Home() {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCompId, setActiveCompId] = useState<string>('misteriya-vokala');
  const [newsletterEmail, setNewsletterEmail] = useState('');
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950 overflow-x-hidden">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/60 border-b border-amber-500/20 py-2 px-4 text-center text-xs sm:text-sm text-amber-200/90 flex items-center justify-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Открыт прием заявок на ежемесячный международный сезон • <strong>Итоги за 14 дней</strong></span>
        <button
          onClick={() => handleOpenModal('misteriya-vokala')}
          className="ml-2 underline font-semibold text-amber-300 hover:text-white transition-colors"
        >
          Участвовать &rarr;
        </button>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
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
              Как участвовать
            </a>
            <a href="#jury" className="hover:text-amber-400 transition-colors">
              Международное жюри
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
          <div className="lg:hidden border-b border-slate-800 bg-slate-900/95 backdrop-blur-xl px-4 py-5 space-y-4">
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
                Как участвовать
              </a>
              <a
                href="#jury"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-amber-400"
              >
                Международное жюри
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

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-amber-500/10 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 blur-[130px] pointer-events-none rounded-full" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-medium mb-6 shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span>Всемирный проект Творческого Объединения «Триумф»</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-tight text-white leading-[1.1] mb-6">
            Международные конкурсы <br className="hidden sm:inline" />
            <span className="gold-gradient-text">мирового уровня</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            Выйдите на глобальную сцену. Получите экспертную рецензию от звезд мировых театров и консерваторий, международный диплом для аттестации и гранты на очные финалы.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Button
              onClick={() => handleOpenModal('misteriya-vokala')}
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold px-8 py-6 rounded-2xl text-base shadow-xl shadow-amber-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Выбрать конкурс и подать заявку</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
            <a
              href="#competitions"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 hover:text-white transition-all text-sm font-semibold flex items-center justify-center gap-2"
            >
              <span>Смотреть список конкурсов</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="text-center p-2">
              <div className="text-2xl sm:text-4xl font-serif font-bold text-amber-400 mb-1">12+</div>
              <div className="text-xs sm:text-sm text-slate-400">Стран в экспертном жюри</div>
            </div>
            <div className="text-center p-2">
              <div className="text-2xl sm:text-4xl font-serif font-bold text-amber-400 mb-1">14 дней</div>
              <div className="text-xs sm:text-sm text-slate-400">Быстрое подведение итогов</div>
            </div>
            <div className="text-center p-2">
              <div className="text-2xl sm:text-4xl font-serif font-bold text-amber-400 mb-1">100%</div>
              <div className="text-xs sm:text-sm text-slate-400">Дипломы для аттестации</div>
            </div>
            <div className="text-center p-2">
              <div className="text-2xl sm:text-4xl font-serif font-bold text-amber-400 mb-1">50 000+</div>
              <div className="text-xs sm:text-sm text-slate-400">Участников по всему миру</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Accreditations Ribbon */}
      <section className="py-6 border-y border-slate-900 bg-slate-950/50">
        <div className="container mx-auto px-4 sm:px-6">
          <p className="text-center text-xs uppercase tracking-widest text-slate-500 font-semibold mb-4">
            Признание и патронаж ведущих культурных институтов
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
              <Star className="w-4 h-4 text-amber-400" /> Cap Ferret Festival (Франция)
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-amber-400" /> Платформа ARTCOMPASS
            </span>
          </div>
        </div>
      </section>

      {/* Competitions Catalog Section */}
      <section id="competitions" className="py-20 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-3">
                <Flame className="w-3.5 h-3.5" /> Актуальные конкурсы
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
                Выберите направление и начните путь к победе
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
                Проекты обновляются каждый месяц. Прием заявок открыт прямо сейчас — итоги оглашаются ровно через 14 дней.
              </p>
            </div>

            {/* Discipline Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto max-w-full">
              {[
                { id: 'all', label: 'Все' },
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
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
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
                className="group relative flex flex-col justify-between rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 transition-all duration-300 p-6 sm:p-7 hover:shadow-2xl hover:shadow-amber-500/10"
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

                  <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 mb-6 text-xs">
                    <div className="text-slate-400 text-[11px] mb-1">Призовой фонд и гранты:</div>
                    <div className="text-amber-400 font-semibold">{comp.grandPrix}</div>
                    <div className="text-slate-400 text-[11px] mt-2">Эксперты конкурса:</div>
                    <div className="text-slate-200">{comp.juryPreview}</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  <div>
                    <span className="block text-[11px] text-slate-400">Организационный взнос</span>
                    <span className="text-lg font-bold text-white">{comp.fee}</span>
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

      {/* What Every Participant Gets */}
      <section className="py-16 bg-slate-900/40 border-y border-slate-900">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Что входит в наградной пакет каждого участника
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Официальные документы с печатями и подписями экспертов, принимаемые аттестационными комиссиями
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-left">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-4 border border-amber-400/20">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white mb-2">Диплом мирового образца</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Персональный диплом с защитным номером, степенями лауреатства или дипломанта и официальными подписями жюри.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-left">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-4 border border-amber-400/20">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white mb-2">Благодарность педагогу</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Именные благодарственные письма преподавателям, руководителям студий и концертмейстерам для портфолио и надбавок.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-left">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-4 border border-amber-400/20">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white mb-2">Развернутая рецензия</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Письменный экспертный разбор сильных сторон номера, техники исполнения и вектора творческого роста от мировых мэтров.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-left">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-4 border border-amber-400/20">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white mb-2">Гранты на очные фестивали</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Лучшие артисты получают сертификаты на бесплатное участие и денежные гранты в очных премиях Москвы, Санкт-Петербурга и Сочи.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - 4 Steps */}
      <section id="steps" className="py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-3">
              Прозрачный процесс
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              Как принять участие за 4 простых шага
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Вам не нужно никуда ехать — отправьте видеозапись номера прямо из вашего репетиционного зала или сцены
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              {
                step: '01',
                title: 'Выберите конкурс',
                desc: 'Ознакомьтесь с актуальными дисциплинами (вокал, хореография, театр, инструменты, цирк) и выберите подходящую категорию.'
              },
              {
                step: '02',
                title: 'Загрузите запись',
                desc: 'Снимите живое выступление на статичную камеру (HD от 720p) и разместите на YouTube, Rutube, VK или Яндекс.Диске.'
              },
              {
                step: '03',
                title: 'Заполните заявку',
                desc: 'Внесите данные исполнителя и ссылку на видео в онлайн-форму, затем безопасно оплатите оргвзнос банковской картой.'
              },
              {
                step: '04',
                title: 'Получите дипломы',
                desc: 'Через 14 дней жюри выставляет баллы, публикует протокол и отправляет международные наградные документы на почту.'
              }
            ].map((s, index) => (
              <div
                key={index}
                className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 relative group hover:border-slate-700 transition-all text-left"
              >
                <div className="text-4xl font-serif font-black text-amber-500/30 group-hover:text-amber-400/80 transition-colors mb-4">
                  {s.step}
                </div>
                <h3 className="text-lg font-serif font-bold text-white mb-2">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              onClick={() => handleOpenModal('misteriya-vokala')}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-8 py-3 rounded-xl text-sm shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all"
            >
              Заполнить онлайн-заявку сейчас
            </Button>
          </div>
        </div>
      </section>

      {/* Jury Section */}
      <section id="jury" className="py-20 bg-slate-900/50 border-t border-slate-900">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-3">
                Мировой экспертный совет
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
                Судейство от признанных деятелей искусств
              </h2>
              <p className="text-slate-400 text-sm mt-2 max-w-xl">
                Ваше творчество оценивают оперные солисты La Scala, профессора Венской и Парижской консерваторий, хореографы Бродвея и театральные режиссеры Лондона.
              </p>
            </div>
            <div className="text-xs text-amber-300 font-medium">
              Официальная рецензия с синей печатью каждому участнику
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {JURY_MEMBERS.map((member) => (
              <div
                key={member.id}
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800/90 flex flex-col justify-between hover:border-amber-500/30 transition-all"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center font-serif font-bold text-lg text-amber-300 mb-4">
                    {member.avatarText}
                  </div>
                  <h3 className="text-lg font-serif font-bold text-white mb-1">{member.name}</h3>
                  <div className="text-xs text-amber-400/90 font-medium mb-1">
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

      {/* Recent Winners & Results Section */}
      <section id="winners" className="py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-3">
              Гордость платформы
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              Недавние призеры и обладатели грантов
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Каждый месяц мы публикуем официальные протоколы и поздравляем лауреатов со всего мира
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {RECENT_WINNERS.map((win) => (
              <div
                key={win.id}
                className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="text-amber-400 font-medium">{win.award}</span>
                    <span>{win.date}</span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-white mb-1">{win.winner}</h3>
                  <div className="text-xs text-slate-400 mb-3">
                    {win.city} • Руководитель: <span className="text-slate-300">{win.director}</span>
                  </div>
                  <p className="text-xs text-slate-300 mb-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <strong>Конкурс:</strong> {win.competition}
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
      <section id="partners" className="py-16 bg-slate-900/40 border-y border-slate-900">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl font-serif font-bold text-white">
              Международные партнеры и культурные фонды
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Проекты ARTCODE поддерживают авторитетные ассоциации Европы и стран СНГ
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {PARTNERS_DATA.map((p, idx) => (
              <a
                key={idx}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-amber-500/40 transition-all text-center group"
              >
                <div className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                  {p.name}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">{p.country}</div>
                <div className="text-[10px] text-amber-400/80 mt-1">{p.category}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-white">
              Часто задаваемые вопросы
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Все, что нужно знать об участии, оценке и получении документов
            </p>
          </div>

          <div className="space-y-4">
            {FAQ_DATA.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80 text-left"
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

      {/* Newsletter & Direct Contact Form */}
      <section className="py-16 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold mb-4">
            <Mail className="w-3.5 h-3.5" /> Будьте в курсе новых конкурсов
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-3">
            Получайте анонсы грантов и новых сезонов первыми
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mb-6 max-w-md mx-auto">
            Подпишитесь на ежемесячную рассылку положения конкурсов, бесплатных поездок и спецпризов. Никакого спама.
          </p>

          {!newsletterSubscribed ? (
            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                required
                placeholder="Ваш e-mail..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="bg-slate-950 border-slate-800 text-white rounded-xl text-sm"
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
              <span>Вы успешно подписаны на анонсы конкурсов ARTCODE!</span>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-slate-800/80 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-400">
            <span>Официальный контакт: <a href="mailto:hello@my-artcode.com" className="text-amber-400 hover:underline">hello@my-artcode.com</a></span>
            <span>Телефон оргкомитета: <span className="text-slate-300">+7 (812) 600-33-37</span></span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-slate-950 border-t border-slate-900 text-xs text-slate-500">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 font-serif font-black flex items-center justify-center text-sm">
              A
            </div>
            <div>
              <div className="text-white font-serif font-bold text-sm">ARTCODE</div>
              <div>© 2020–2026 Творческое объединение «Триумф». Все права защищены.</div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <a href="https://vk.com/triumph_org" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
              ВКонтакте
            </a>
            <a href="https://triumph-org.ru/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
              ТО Триумф
            </a>
            <a href="http://artcompass.ru/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
              ARTCOMPASS
            </a>
            <a href="http://www.triumph-org.ru/ru/terms" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
              Политика конфиденциальности
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
