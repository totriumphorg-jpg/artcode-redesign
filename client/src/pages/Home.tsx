import React, { useState } from 'react';
import { Link } from 'wouter';
import {
  COMPETITIONS_DATA,
  JURY_MEMBERS,
  PARTNERS_DATA,
  PARTICIPATION_RULES,
  FAQ_DATA,
  REPORTS_DATA,
} from '@/const';
import { ASSETS, getDisciplineImage, getJuryImage } from '@/assets';
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
  ChevronLeft,
  ShieldCheck,
  Star,
  ArrowRight,
  FileCheck2,
  Mail,
  HelpCircle,
  Menu,
  X,
  Phone,
  Video,
  ExternalLink,
  Lock,
  Layers,
  FileText,
} from 'lucide-react';
import { trpc } from '@/lib/trpc';

export default function Home() {
  const [activeDiscipline, setActiveDiscipline] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedContestSlug, setSelectedContestSlug] = useState<string>('misteriya-zvuka');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [jurySlideIndex, setJurySlideIndex] = useState<number>(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Load dynamic contests from DB if available
  const { data: dbContests } = trpc.contests.list.useQuery();
  const { data: dbReports } = trpc.reports.list.useQuery();

  const competitions = (dbContests && dbContests.length > 0) ? dbContests : COMPETITIONS_DATA;
  const reports = (dbReports && dbReports.length > 0) ? dbReports : REPORTS_DATA;

  const filteredCompetitions = activeDiscipline === 'all'
    ? competitions
    : competitions.filter((c) => c.discipline === activeDiscipline);

  const openApplication = (slug: string) => {
    setSelectedContestSlug(slug);
    setIsModalOpen(true);
  };

  const nextJurySlide = () => {
    setJurySlideIndex((prev) => (prev + 1 >= JURY_MEMBERS.length ? 0 : prev + 1));
  };

  const prevJurySlide = () => {
    setJurySlideIndex((prev) => (prev - 1 < 0 ? JURY_MEMBERS.length - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Banner / Organizer Header */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Официальная платформа международных конкурсов Творческого объединения «Триумф»</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <a href="tel:+78002508055" className="hover:text-white transition-colors flex items-center gap-1">
              <Phone className="w-3 h-3 text-amber-400" /> 8 (800) 250-80-55
            </a>
            <span className="hidden sm:inline text-slate-600">•</span>
            <a href="mailto:hello@my-artcode.com" className="hover:text-white transition-colors flex items-center gap-1">
              <Mail className="w-3 h-3 text-amber-400" /> hello@my-artcode.com
            </a>
            <span className="hidden sm:inline text-slate-600">•</span>
            <Link href="/admin" className="text-slate-300 hover:text-white flex items-center gap-1 font-semibold">
              <Lock className="w-3 h-3 text-blue-400" /> Вход для организаторов
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl sm:text-3xl tracking-tight text-blue-900 group-hover:text-blue-700 transition-colors">
                  ARTCODE
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-500 -mt-1">
                  International Arts
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">
              <a href="#competitions" className="hover:text-blue-600 transition-colors">Все конкурсы</a>
              <a href="#rules" className="hover:text-blue-600 transition-colors">Правила и видео</a>
              <a href="#jury" className="hover:text-blue-600 transition-colors">Экспертный совет</a>
              <a href="#reports" className="hover:text-blue-600 transition-colors">Итоги конкурсов</a>
              <a href="#faq" className="hover:text-blue-600 transition-colors">Вопросы и ответы</a>
              <a href="#partners" className="hover:text-blue-600 transition-colors">Партнеры</a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <img
              src={ASSETS.triumphLogo}
              alt="ТО Триумф"
              className="h-10 w-auto object-contain hidden md:block opacity-90"
            />
            <Button
              onClick={() => openApplication('misteriya-zvuka')}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all text-sm"
            >
              Подать заявку
            </Button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-blue-600"
              aria-label="Меню"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 text-sm font-semibold">
            <a href="#competitions" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 hover:text-blue-600">Все конкурсы</a>
            <a href="#rules" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 hover:text-blue-600">Правила и видео</a>
            <a href="#jury" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 hover:text-blue-600">Экспертный совет</a>
            <a href="#reports" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 hover:text-blue-600">Итоги конкурсов</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-700 hover:text-blue-600">Вопросы и ответы</a>
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-blue-600 font-bold">Панель организатора →</Link>
          </div>
        )}
      </header>

      {/* Hero Section — Light, Fresh & Inspiring (Customer revision 1 & 2) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 via-white to-slate-50 pt-12 pb-16 md:pt-16 md:pb-24 border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Международная конкурсная платформа
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Раскройте свой талант на мировом уровне с <span className="text-blue-600">ARTCODE</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Регулярные заочные международные творческие конкурсы по вокалу, хореографии, театру, цирку и инструментальному творчеству. Персональная рецензия каждому участнику на официальном бланке.
              </p>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Button
                  onClick={() => openApplication('misteriya-zvuka')}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all text-base"
                >
                  Подать заявку на конкурс
                </Button>
                <a
                  href="#competitions"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base transition-colors"
                >
                  Выбрать направление <ChevronRight className="w-4 h-4 ml-1 text-slate-400" />
                </a>
              </div>

              {/* Advantages bar — Customer revision 2 (removed 12 countries, replaced with qualified jury) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200 text-left">
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-sm">
                  <div className="text-blue-600 font-extrabold text-xl">Жюри</div>
                  <div className="text-xs text-slate-600 mt-0.5">Заслуженные артисты и профессора</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-sm">
                  <div className="text-blue-600 font-extrabold text-xl">14 дней</div>
                  <div className="text-xs text-slate-600 mt-0.5">Срок подведения официальных итогов</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-sm">
                  <div className="text-blue-600 font-extrabold text-xl">100%</div>
                  <div className="text-xs text-slate-600 mt-0.5">Официальные дипломы и рецензии</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-sm">
                  <div className="text-amber-500 font-extrabold text-xl">Гранты</div>
                  <div className="text-xs text-slate-600 mt-0.5">Поездки на очные фестивали</div>
                </div>
              </div>
            </div>

            {/* Visual Stage Banner */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-200">
                <img
                  src={ASSETS.hero}
                  alt="Международные творческие конкурсы ARTCODE"
                  className="w-full h-[360px] sm:h-[440px] object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-xs uppercase tracking-wider font-bold text-amber-400">
                    Творческое объединение «Триумф»
                  </span>
                  <div className="text-xl font-bold leading-tight mt-1">
                    Ежемесячные смотры талантов со всего мира
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competitions Catalog — Customer revisions 4, 5 (Each contest clicks to its own page & regulations) */}
      <section id="competitions" className="py-16 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
              Наши проекты
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Актуальные международные конкурсы
            </h2>
            <p className="text-slate-600 mt-2 text-base">
              Нажмите на любой конкурс, чтобы открыть его официальное положение, номинации, критерии оценки и экспертный совет.
            </p>

            {/* Category tabs */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {[
                { id: 'all', label: 'Все направления' },
                { id: 'vocal', label: 'Вокал' },
                { id: 'choreography', label: 'Хореография' },
                { id: 'theater', label: 'Театр' },
                { id: 'instrumental', label: 'Инструментальное' },
                { id: 'circus', label: 'Цирк' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDiscipline(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeDiscipline === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCompetitions.map((comp) => {
              const imageSrc = getDisciplineImage(comp.discipline as any);
              const juryThree = (comp as any).juryNames
                ? String((comp as any).juryNames).split(',').slice(0, 3).map((j: string) => j.trim())
                : ((comp as any).juryList || []);

              return (
              <div
                  key={comp.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col overflow-hidden group"
                >
                  {/* Image container — fully clickable to contest page */}
                  <Link href={`/contest/${comp.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={imageSrc}
                      alt={comp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-slate-900/80 backdrop-blur-md text-white">
                        {comp.disciplineLabel}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-blue-900 shadow-sm">
                        {comp.badge}
                      </span>
                    </div>
                  </Link>

                  {/* Card Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>{(comp as any).deadline || (comp as any).receptionPeriod || 'Ежемесячный прием заявок'}</span>
                    </div>

                    <Link href={`/contest/${comp.slug}`} className="hover:text-blue-600 transition-colors">
                      <h3 className="font-extrabold text-lg text-slate-900 leading-snug mb-2 group-hover:text-blue-600">
                        {comp.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                      {comp.description}
                    </p>

                    {/* Features checklist */}
                    <ul className="space-y-1.5 text-xs text-slate-700 mb-5">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>Диплом международного образца и благодарность педагогу</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>Персональный отзыв экспертов на официальном бланке</span>
                      </li>
                    </ul>

                    {/* 3 Jury members visible (Customer revision 5) */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 mb-5 text-xs">
                      <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                        <span>Экспертный совет (3 члена жюри):</span>
                      </div>
                      <div className="space-y-0.5 text-slate-600">
                        {juryThree.map((name: string, idx: number) => (
                          <div key={idx} className="truncate">• {name}</div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom action row */}
                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <Link href={`/contest/${comp.slug}`}>
                        <Button variant="outline" size="sm" className="border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl">
                          Положение конкурса →
                        </Button>
                      </Link>

                      <Button
                        size="sm"
                        onClick={() => openApplication(comp.slug)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl px-4 shadow-sm"
                      >
                        Подать заявку
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Participation Rules & Video Requirements */}
      <section id="rules" className="py-16 bg-white border-y border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                Регламент
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
                Требования к видеозаписям и материалам
              </h2>
              <p className="text-slate-600 mt-2 text-sm sm:text-base">
                Соблюдение простых правил гарантирует объективную экспертную оценку каждого конкурсного номера
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Video className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900">Съемка и качество видео</h3>
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                  {PARTICIPATION_RULES.videoRequirements.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0 mt-2"></span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Globe2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900">Размещение и ссылки</h3>
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                  {PARTICIPATION_RULES.hostingPlaces.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-2"></span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>

                {/* Customer revision 8: announcement on my-artcode.ru */}
                <div className="mt-6 p-4 bg-blue-50/80 rounded-xl border border-blue-100 text-xs text-blue-900 leading-relaxed">
                  <strong>Публикация результатов:</strong> на 15-й день после окончания приема заявок имена обладателей Гран-при и протоколы публикуются на официальном сайте <strong>my-artcode.ru</strong> и в сообществе <strong>vk.com/triumph_org</strong>.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compact expert council slider */}
      <section id="jury" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                  Жюри мирового уровня
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
                  Экспертный совет платформы
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  Заслуженные артисты, профессора консерваторий и ведущие мастера сцены
                </p>
              </div>

              {/* Slider arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prevJurySlide}
                  className="p-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors shadow-sm"
                  aria-label="Предыдущий эксперт"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextJurySlide}
                  className="p-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors shadow-sm"
                  aria-label="Следующий эксперт"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Compact Jury Card */}
            {(() => {
              const currentJury = JURY_MEMBERS[jurySlideIndex];
              const imageSrc = getJuryImage(currentJury.id);

              return (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center gap-6 md:gap-8">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 border-2 border-slate-200 shadow-sm">
                    <img
                      src={imageSrc}
                      alt={currentJury.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  <div className="space-y-3 text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                      <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {currentJury.country}, {currentJury.city}
                      </span>
                      <span className="text-xs text-slate-400">
                        Эксперт {jurySlideIndex + 1} из {JURY_MEMBERS.length}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900">{currentJury.name}</h3>
                    <p className="text-sm font-semibold text-blue-600">{currentJury.role}</p>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                      {currentJury.credentials}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* Reports & Contest Results — Customer revisions 7 & 8 (Clickable reports, no "news") */}
      <section id="reports" className="py-16 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                Официальные протоколы
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
                Итоги и отчеты конкурсов
              </h2>
              <p className="text-slate-600 mt-2 text-sm sm:text-base">
                Нажмите на отчет, чтобы открыть подробные результаты, списки лауреатов и информацию о наградных пакетах
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reports.map((report) => (
                <Link
                  key={report.id}
                  href={`/report/${report.slug}`}
                  className="bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 hover:border-blue-400 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 text-[11px]">
                        {report.category}
                      </span>
                      <span>{report.publishedDate}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 group-hover:text-blue-600 transition-colors">
                      {report.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                      {report.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-blue-600">
                    <span>Открыть отчет</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ — updated participant document details */}
      <section id="faq" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                Помощь
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
                Часто задаваемые вопросы
              </h2>
              <p className="text-slate-600 mt-2 text-sm">
                Ответы о порядке участия, рецензировании, наградах и оплате
              </p>
            </div>

            <div className="space-y-3">
              {FAQ_DATA.map((item, idx) => {
                const isOpen = expandedFaq === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaq(isOpen ? null : idx)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-bold text-slate-900 text-base flex items-center gap-2.5">
                        <HelpCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        {item.q}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-90 text-blue-600' : ''}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="py-14 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Международное сотрудничество
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1">Партнеры и ассоциации</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {PARTNERS_DATA.slice(0, 5).map((partner, idx) => (
              <a
                key={idx}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-300 transition-all text-center flex flex-col items-center justify-center"
              >
                <span className="text-xs font-bold text-slate-900">{partner.name}</span>
                <span className="text-[10px] text-slate-500 mt-0.5">{partner.country}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer with Triumph Branding & Admin Link */}
      <footer className="bg-slate-950 text-slate-300 py-12 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800 text-sm">
            <div className="md:col-span-2 space-y-3">
              <span className="font-extrabold text-2xl text-white tracking-tight">ARTCODE</span>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Международная платформа творческих конкурсов Творческого объединения «Триумф». Регулярные конкурсы по всем жанрам искусства с рецензированием от ведущих мировых экспертов.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <img src={ASSETS.triumphLogo} alt="ТО Триумф" className="h-8 w-auto object-contain brightness-0 invert opacity-80" />
                <span className="text-xs text-slate-400">Организатор: ТО «Триумф»</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-white text-xs uppercase tracking-wider">Навигация</div>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li><a href="#competitions" className="hover:text-white transition-colors">Конкурсы</a></li>
                <li><a href="#rules" className="hover:text-white transition-colors">Требования к видео</a></li>
                <li><a href="#jury" className="hover:text-white transition-colors">Экспертный совет</a></li>
                <li><a href="#reports" className="hover:text-white transition-colors">Итоги конкурсов</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">Вопросы и ответы</a></li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-white text-xs uppercase tracking-wider">Контакты и доступ</div>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li><a href="tel:+78002508055" className="hover:text-white">8 (800) 250-80-55</a></li>
                <li><a href="mailto:hello@my-artcode.com" className="hover:text-white">hello@my-artcode.com</a></li>
                <li><span>Санкт-Петербург, Россия</span></li>
                <li className="pt-2">
                  <Link href="/admin" className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" /> Панель управления (Admin)
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>© 2026 ARTCODE. Все права защищены. Творческое объединение «Триумф».</div>
            <div className="flex items-center gap-4">
              <span>Оплата через PayKeeper</span>
              <span>•</span>
              <a href="#rules" className="hover:text-slate-400">Политика конфиденциальности</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Application Modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultContestId={selectedContestSlug}
      />
    </div>
  );
}
