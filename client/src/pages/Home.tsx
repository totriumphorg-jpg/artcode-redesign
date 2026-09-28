import React, { useState, useMemo } from 'react';
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
  Mail,
  HelpCircle,
  Menu,
  X,
  Phone,
  Video,
  ExternalLink,
  Lock,
  Search,
  SlidersHorizontal,
  Flame,
  FileText,
} from 'lucide-react';
import { trpc } from '@/lib/trpc';

export default function Home() {
  const [activeDiscipline, setActiveDiscipline] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
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

  const filteredCompetitions = useMemo(() => {
    return competitions.filter((comp) => {
      const matchDiscipline = activeDiscipline === 'all' || comp.discipline === activeDiscipline;
      const matchSearch = searchQuery.trim() === '' ||
        comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (comp.disciplineLabel && comp.disciplineLabel.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchDiscipline && matchSearch;
    });
  }, [competitions, activeDiscipline, searchQuery]);

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

  const disciplineTabs = [
    { id: 'all', label: 'Все направления', icon: Sparkles },
    { id: 'vocal', label: 'Вокал', icon: Star },
    { id: 'choreography', label: 'Хореография', icon: Flame },
    { id: 'theater', label: 'Театр', icon: Globe2 },
    { id: 'instrumental', label: 'Инструментальное', icon: Award },
    { id: 'circus', label: 'Цирк', icon: Sparkles },
  ];

  return (
    <div className="light-artcode min-h-screen bg-transparent text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Banner / Organizer Header */}
      <div className="bg-white/85 text-slate-600 text-xs py-2 px-4 border-b border-slate-200/80 backdrop-blur-sm">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-700">Официальная платформа международных конкурсов Творческого объединения «Триумф»</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <a href="tel:+78002508055" className="hover:text-amber-700 transition-colors flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-amber-700" /> 8 (800) 250-80-55
            </a>
            <span className="hidden sm:inline text-slate-700">•</span>
            <a href="mailto:hello@my-artcode.com" className="hover:text-amber-700 transition-colors flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-amber-700" /> hello@my-artcode.com
            </a>
            <span className="hidden sm:inline text-slate-700">•</span>
            <Link href="/admin" className="text-slate-700 hover:text-slate-900 flex items-center gap-1 font-semibold">
              <Lock className="w-3 h-3 text-amber-700" /> Вход для организаторов
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-2xl transition-all">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl sm:text-3xl tracking-tight text-slate-900 group-hover:text-amber-700 transition-colors">
                  ARTCODE
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-amber-700/90 -mt-1">
                  International Arts
                </span>
              </div>
            </Link>

            <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-700">
              <a href="#competitions" className="hover:text-amber-700 transition-colors">Все конкурсы</a>
              <a href="#rules" className="hover:text-amber-700 transition-colors">Правила и видео</a>
              <a href="#jury" className="hover:text-amber-700 transition-colors">Экспертный совет</a>
              <a href="#reports" className="hover:text-amber-700 transition-colors">Итоги конкурсов</a>
              <a href="#faq" className="hover:text-amber-700 transition-colors">Вопросы и ответы</a>
              <a href="#partners" className="hover:text-amber-700 transition-colors">Партнеры</a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <img
              src={ASSETS.triumphLogo}
              alt="ТО Триумф"
              className="h-10 w-auto object-contain hidden md:block opacity-90 hover:opacity-100 transition-opacity"
            />
            <Button
              onClick={() => openApplication('misteriya-zvuka')}
              className="button-motion bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-amber-500/25 text-sm"
            >
              Подать заявку
            </Button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-700 hover:text-slate-900"
              aria-label="Меню"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-b border-slate-200/80 px-4 py-4 space-y-3 text-sm font-semibold text-slate-800">
            <a href="#competitions" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-amber-700">Все конкурсы</a>
            <a href="#rules" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-amber-700">Правила и видео</a>
            <a href="#jury" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-amber-700">Экспертный совет</a>
            <a href="#reports" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-amber-700">Итоги конкурсов</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-amber-700">Вопросы и ответы</a>
            <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-amber-700 font-bold">Панель организатора →</Link>
          </div>
        )}
      </header>

      {/* Hero Section — Theatrical & Inspiring */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-200/80">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-10 right-10 w-[450px] h-[300px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-center">
            <div className="xl:col-span-7 space-y-6 text-center xl:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                Международная конкурсная платформа
              </div>

              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Раскройте свой талант на мировом уровне с <span className="gold-gradient-text">ARTCODE</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-700 max-w-2xl mx-auto xl:mx-0 font-normal leading-relaxed">
                Регулярные заочные международные творческие конкурсы по вокалу, хореографии, театру, цирку и инструментальному творчеству. Персональная рецензия каждому участнику на официальном бланке.
              </p>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center xl:justify-start gap-4 pt-2">
                <Button
                  onClick={() => openApplication('misteriya-zvuka')}
                  className="button-motion w-full sm:w-auto bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 hover:from-amber-500 hover:to-orange-400 text-white font-extrabold px-8 py-3.5 rounded-xl shadow-xl shadow-amber-500/25 text-base"
                >
                  Подать заявку на конкурс
                </Button>
                <a
                  href="#competitions"
                  className="button-motion w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-slate-300 bg-white/80 hover:bg-slate-50 text-slate-900 font-semibold text-base backdrop-blur-sm transition-all"
                >
                  Выбрать направление <ChevronRight className="w-4 h-4 ml-1 text-amber-700" />
                </a>
              </div>

              {/* Advantages bar */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-6 border-t border-slate-200/80 text-left">
                <div className="min-w-0 p-4 rounded-2xl glass-panel border border-slate-200/80">
                  <div className="text-amber-700 font-extrabold text-2xl font-serif">Жюри</div>
                  <div className="text-xs text-slate-700 mt-1 break-words">Заслуженные артисты и профессора</div>
                </div>
                <div className="min-w-0 p-4 rounded-2xl glass-panel border border-slate-200/80">
                  <div className="text-blue-700 font-extrabold text-2xl font-serif">14 дней</div>
                  <div className="text-xs text-slate-700 mt-1 break-words">Срок подведения официальных итогов</div>
                </div>
                <div className="min-w-0 p-4 rounded-2xl glass-panel border border-slate-200/80">
                  <div className="text-emerald-600 font-extrabold text-2xl font-serif">100%</div>
                  <div className="text-xs text-slate-700 mt-1 break-words">Официальные дипломы и рецензии</div>
                </div>
                <div className="min-w-0 p-4 rounded-2xl glass-panel border border-slate-200/80">
                  <div className="text-amber-700 font-extrabold text-2xl font-serif">Гранты</div>
                  <div className="text-xs text-slate-700 mt-1 break-words">Поездки на очные фестивали</div>
                </div>
              </div>
            </div>

            {/* Visual Stage Banner */}
            <div className="xl:col-span-5 relative">
              <div className="relative mx-auto max-w-md xl:max-w-none rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-100 stage-glow-blue">
                <img
                  src={ASSETS.hero}
                  alt="Международные творческие конкурсы ARTCODE"
                  className="block w-full h-auto aspect-video object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-xs uppercase tracking-wider font-bold text-amber-300">
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

      {/* Competitions Catalog */}
      <section id="competitions" className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 border border-amber-200">
              Наши проекты
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Актуальные международные конкурсы
            </h2>
            <p className="text-slate-600 mt-2 text-base">
              Нажмите на любой конкурс, чтобы открыть его официальное положение, номинации, критерии оценки и экспертный совет.
            </p>

            {/* Live search input */}
            <div className="mt-6 max-w-md mx-auto relative">
              <Search className="w-4 h-4 text-slate-600 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по названию или номинации..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category tabs — HIGH CONTRAST & VISUALLY DISTINCT */}
            <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-full">
              {disciplineTabs.map((tab) => {
                const isSelected = activeDiscipline === tab.id;
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDiscipline(tab.id)}
                    style={{
                      backgroundColor: isSelected ? '#d97706' : '#ffffff',
                      color: isSelected ? '#ffffff' : '#334155',
                      borderColor: isSelected ? '#d97706' : '#cbd5e1',
                    }}
                    className={`max-w-full whitespace-nowrap px-4 py-2 rounded-xl border text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2 ${
                      isSelected
                        ? 'shadow-amber-500/25 font-extrabold ring-2 ring-amber-400/50'
                        : 'hover:bg-amber-50 hover:border-amber-300'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-blue-700'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredCompetitions.map((comp) => {
              const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '') + '/';
              const rawImage = (comp as any).cardImage;
              const imageSrc =
                comp.slug === 'misteriya-zvuka'
                  ? ASSETS.disciplines.folkVocal
                  : rawImage && typeof rawImage === 'string' && !rawImage.includes('manus-storage')
                    ? (rawImage.startsWith('http') ? rawImage : `${base}${rawImage.replace(/^\/+/, '')}`)
                    : getDisciplineImage(comp.discipline as any);
              const juryThree = (comp as any).juryNames
                ? String((comp as any).juryNames).split(',').slice(0, 3).map((j: string) => j.trim())
                : ((comp as any).juryList || []);

              return (
                <div
                  key={comp.id}
                  className="glass-panel glass-panel-hover rounded-3xl overflow-hidden flex flex-col group border border-slate-200/80"
                >
                  {/* Image container — fully clickable to contest page */}
                  <Link href={`/contest/${comp.slug}`} className="block relative aspect-square overflow-hidden bg-slate-100 p-2 border-b border-slate-200/80">
                    <img
                      src={imageSrc}
                      alt={comp.title}
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== ASSETS.disciplines.vocal) {
                          target.src = ASSETS.disciplines.vocal;
                        }
                      }}
                      className="block w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="max-w-[48%] truncate px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-white/85 border border-slate-200 text-amber-700 backdrop-blur-md shadow-lg">
                        {comp.disciplineLabel}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/90 text-white backdrop-blur-md shadow-lg border border-blue-200">
                        {comp.badge}
                      </span>
                    </div>
                  </Link>

                  {/* Card Content */}
                  <div className="p-6 sm:p-7 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-xs text-amber-700/90 font-medium mb-2.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{(comp as any).deadline || (comp as any).receptionPeriod || 'Ежемесячный прием заявок'}</span>
                    </div>

                    <Link href={`/contest/${comp.slug}`} className="hover:text-amber-700 transition-colors">
                      <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 leading-snug mb-3 group-hover:text-amber-700 transition-colors">
                        {comp.title}
                      </h3>
                    </Link>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-5 line-clamp-2">
                      {comp.description}
                    </p>

                    {/* Features checklist */}
                    <ul className="space-y-2 text-xs text-slate-700 mb-6">
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>Диплом международного образца и благодарность педагогу</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>Персональный отзыв экспертов на официальном бланке</span>
                      </li>
                    </ul>

                    {/* 3 Jury members visible */}
                    <div className="p-3.5 bg-slate-100/70 rounded-2xl border border-slate-200/80 mb-6 text-xs">
                      <div className="font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-amber-700" />
                        <span>Экспертный совет (3 члена жюри):</span>
                      </div>
                      <div className="space-y-1 text-slate-600">
                        {juryThree.map((name: string, idx: number) => (
                          <div key={idx} className="truncate">• {name}</div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom action row */}
                    <div className="mt-auto pt-4 border-t border-slate-200/80 flex items-center justify-between gap-3">
                      <Link href={`/contest/${comp.slug}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-xs rounded-xl"
                        >
                          Положение →
                        </Button>
                      </Link>

                      <Button
                        size="sm"
                        onClick={() => openApplication(comp.slug)}
                        className="button-motion bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white font-bold text-xs rounded-xl px-4 shadow-md"
                      >
                        Подать заявку
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCompetitions.length === 0 && (
            <div className="text-center py-12 glass-panel rounded-3xl max-w-lg mx-auto border border-slate-200/80">
              <Search className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              <div className="text-lg font-bold text-slate-900">Ничего не найдено</div>
              <p className="text-xs text-slate-600 mt-1">Попробуйте изменить поисковый запрос или выбрать другую категорию</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveDiscipline('all'); }}
                className="mt-4 px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Participation Rules & Video Requirements */}
      <section id="rules" className="py-16 md:py-20 bg-slate-100/70 border-y border-slate-200/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-700 border border-blue-200">
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
              <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-slate-200/80">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-200 text-blue-700 flex items-center justify-center">
                    <Video className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900">Съемка и качество видео</h3>
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                  {PARTICIPATION_RULES.videoRequirements.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-2"></span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-slate-200/80">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-200 text-amber-700 flex items-center justify-center">
                    <Globe2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900">Размещение и ссылки</h3>
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                  {PARTICIPATION_RULES.hostingPlaces.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-2"></span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-900 leading-relaxed">
                  <strong>Публикация результатов:</strong> на 15-й день после окончания приема заявок имена обладателей Гран-при и протоколы публикуются на официальном сайте <strong>my-artcode.ru</strong> и в сообществе <strong>vk.com/triumph_org</strong>.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Council Slider */}
      <section id="jury" className="py-16 md:py-24 border-b border-slate-200/80 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 border border-amber-200">
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
                  className="p-3 rounded-xl glass-panel border border-slate-200 hover:bg-slate-50 text-slate-800 transition-colors shadow-md"
                  aria-label="Предыдущий эксперт"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextJurySlide}
                  className="p-3 rounded-xl glass-panel border border-slate-200 hover:bg-slate-50 text-slate-800 transition-colors shadow-md"
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
                <div className="glass-panel rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center gap-6 md:gap-8">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 border-2 border-amber-500/40 shadow-xl stage-glow-amber">
                    <img
                      src={imageSrc}
                      alt={currentJury.name}
                      className="block w-full h-full object-contain p-2"
                    />
                  </div>

                  <div className="space-y-3 text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                      <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-700 border border-amber-200">
                        {currentJury.country}, {currentJury.city}
                      </span>
                      <span className="text-xs text-slate-600">
                        Эксперт {jurySlideIndex + 1} из {JURY_MEMBERS.length}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">{currentJury.name}</h3>
                    <p className="text-sm font-semibold text-amber-700">{currentJury.role}</p>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-2xl">
                      {currentJury.credentials}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* Reports & Contest Results */}
      <section id="reports" className="py-16 md:py-20 bg-slate-100/70 border-b border-slate-200/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                Официальные протоколы
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
                Итоги и отчеты конкурсов
              </h2>
              <p className="text-slate-600 mt-2 text-sm sm:text-base">
                Нажмите на отчет, чтобы открыть подробные результаты, списки лауреатов и информацию о наградных пакетах
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {reports.map((report) => (
                <Link
                  key={report.id}
                  href={`/report/${report.slug}`}
                  className="glass-panel glass-panel-hover rounded-2xl border border-slate-200/80 p-6 shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-600 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px]">
                        {report.category}
                      </span>
                      <span>{report.publishedDate}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 group-hover:text-amber-700 transition-colors">
                      {report.title}
                    </h3>

                    <p className="text-xs text-slate-700 leading-relaxed mb-4 line-clamp-3">
                      {report.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-amber-700">
                    <span>Открыть отчет</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 md:py-20 border-b border-slate-200/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-700 border border-blue-200">
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
                    className="glass-panel rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaq(isOpen ? null : idx)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/80 transition-colors"
                    >
                      <span className="font-bold text-slate-900 text-base flex items-center gap-2.5">
                        <HelpCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
                        {item.q}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 text-slate-600 transition-transform ${isOpen ? 'rotate-90 text-amber-700' : ''}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-200/80">
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
      <section id="partners" className="py-14 bg-slate-100/80 border-b border-slate-200/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-600">
              Международное сотрудничество
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1">Партнеры и ассоциации</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {PARTNERS_DATA.slice(0, 5).map((partner, idx) => (
              <a
                key={idx}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl border border-slate-200/80 glass-panel hover:border-amber-400/50 transition-all text-center flex flex-col items-center justify-center group"
              >
                <span className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition-colors">{partner.name}</span>
                <span className="text-[10px] text-slate-600 mt-0.5">{partner.country}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/85 text-slate-600 py-12 mt-auto border-t border-slate-200/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-200/80 text-sm">
            <div className="md:col-span-2 space-y-3">
              <span className="font-extrabold text-2xl text-slate-900 tracking-tight">ARTCODE</span>
              <p className="text-xs text-slate-600 max-w-sm leading-relaxed">
                Международная платформа творческих конкурсов Творческого объединения «Триумф». Регулярные конкурсы по всем жанрам искусства с рецензированием от ведущих мировых экспертов.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <img src={ASSETS.triumphLogo} alt="ТО Триумф" className="h-8 w-auto object-contain opacity-90" />
                <span className="text-xs text-slate-600">Организатор: ТО «Триумф»</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">Навигация</div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li><a href="#competitions" className="hover:text-amber-700 transition-colors">Конкурсы</a></li>
                <li><a href="#rules" className="hover:text-amber-700 transition-colors">Требования к видео</a></li>
                <li><a href="#jury" className="hover:text-amber-700 transition-colors">Экспертный совет</a></li>
                <li><a href="#reports" className="hover:text-amber-700 transition-colors">Итоги конкурсов</a></li>
                <li><a href="#faq" className="hover:text-amber-700 transition-colors">Вопросы и ответы</a></li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">Контакты и доступ</div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li><a href="tel:+78002508055" className="hover:text-slate-900">8 (800) 250-80-55</a></li>
                <li><a href="mailto:hello@my-artcode.com" className="hover:text-slate-900">hello@my-artcode.com</a></li>
                <li><span>Санкт-Петербург, Россия</span></li>
                <li className="pt-2">
                  <Link href="/admin" className="text-amber-700 hover:text-amber-700 font-semibold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" /> Панель управления (Admin)
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
            <div>© 2026 ARTCODE. Все права защищены. Творческое объединение «Триумф».</div>
            <div className="flex items-center gap-4">
              <span>Оплата через PayKeeper</span>
              <span>•</span>
              <a href="#rules" className="hover:text-slate-600">Политика конфиденциальности</a>
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
