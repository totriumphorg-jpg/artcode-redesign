import React, { useState } from 'react';
import {
  COMPETITIONS_DATA,
  JURY_MEMBERS,
  PARTNERS_DATA,
  RECENT_WINNERS,
  PARTICIPATION_RULES,
  FAQ_DATA,
  NEWS_ITEMS,
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
  Flame,
  Check,
  Menu,
  X,
  HeartHandshake,
  Video,
  Image as ImageIcon,
  Quote,
  Music2,
  Palette,
  Theater,
  Camera,
  Newspaper,
  ArrowUpRight,
} from 'lucide-react';

const disciplineIcons = {
  vocal: Music2,
  choreography: Sparkles,
  theater: Theater,
  instrumental: Music2,
  circus: Star,
  art: Palette,
};

export default function Home() {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCompId, setActiveCompId] = useState<string>('misteriya-vokala');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterName, setNewsletterName] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeJuryIndex, setActiveJuryIndex] = useState(0);

  const filteredCompetitions =
    selectedDiscipline === 'all'
      ? COMPETITIONS_DATA
      : COMPETITIONS_DATA.filter((c) => c.discipline === selectedDiscipline);

  const activeJuryMember = JURY_MEMBERS[activeJuryIndex];
  const activeJuryPhoto = getJuryImage(activeJuryMember.id);
  const showPreviousExpert = () =>
    setActiveJuryIndex((current) => (current - 1 + JURY_MEMBERS.length) % JURY_MEMBERS.length);
  const showNextExpert = () =>
    setActiveJuryIndex((current) => (current + 1) % JURY_MEMBERS.length);

  const handleOpenModal = (compId: string) => {
    setActiveCompId(compId);
    setModalOpen(true);
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) setNewsletterSubscribed(true);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950 overflow-x-hidden">
      <div className="bg-[#0b1329] border-b border-amber-500/20 py-2.5 px-4 text-center text-xs sm:text-sm text-amber-100 flex items-center justify-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Открыт прием заявок на ежемесячные международные проекты • <strong>Итоги через 14 дней</strong></span>
        <button onClick={() => handleOpenModal('misteriya-vokala')} className="ml-2 underline font-semibold text-amber-300 hover:text-white transition-colors">
          Подать заявку &rarr;
        </button>
      </div>

      <header className="sticky top-0 z-40 bg-[#020617]/90 backdrop-blur-xl border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-serif text-slate-950 font-bold text-xl shadow-lg shadow-amber-500/20">A</div>
            <div>
              <span className="text-xl sm:text-2xl font-serif font-black tracking-wider text-white">ART<span className="text-amber-400">CODE</span></span>
              <span className="block text-[10px] tracking-widest uppercase text-slate-400 -mt-1 font-medium">CA Triumph • CID UNESCO</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#competitions" className="hover:text-amber-400 transition-colors">Конкурсы</a>
            <a href="#steps" className="hover:text-amber-400 transition-colors">Как участвовать</a>
            <a href="#rules" className="hover:text-amber-400 transition-colors">Требования</a>
            <a href="#jury" className="hover:text-amber-400 transition-colors">Экспертный совет</a>
            <a href="#winners" className="hover:text-amber-400 transition-colors">Итоги</a>
            <a href="#news" className="hover:text-amber-400 transition-colors">Новости</a>
            <a href="#partners" className="hover:text-amber-400 transition-colors">Партнеры</a>
          </nav>

          <div className="hidden sm:flex items-center gap-3">
            <Button onClick={() => handleOpenModal('misteriya-vokala')} className="button-motion bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-semibold px-5 py-2 rounded-xl shadow-md shadow-amber-500/20 text-sm">
              Подать заявку
            </Button>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-slate-300 hover:text-white" aria-label="Открыть меню">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-800 bg-[#0f172a] px-4 py-5 space-y-4 motion-rise">
            <nav className="flex flex-col gap-3 text-sm font-medium text-slate-200">
              <a href="#competitions" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-amber-400">Конкурсы</a>
              <a href="#steps" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-amber-400">Как участвовать</a>
              <a href="#rules" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-amber-400">Требования</a>
              <a href="#jury" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-amber-400">Экспертный совет</a>
              <a href="#winners" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-amber-400">Итоги</a>
              <a href="#news" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-amber-400">Новости</a>
              <a href="#partners" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-amber-400">Партнеры</a>
            </nav>
            <Button onClick={() => { setMobileMenuOpen(false); handleOpenModal('misteriya-vokala'); }} className="button-motion w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-2.5 rounded-xl">Подать заявку онлайн</Button>
          </div>
        )}
      </header>

      <section className="relative min-h-[760px] sm:min-h-[760px] flex flex-col justify-center overflow-hidden bg-[#020617] pt-10 pb-12">
        <picture>
          <source media="(max-width: 639px)" srcSet={ASSETS.heroMobile} />
          <img src={ASSETS.hero} alt="Танцовщица на театральной сцене" className="absolute inset-0 w-full h-full object-cover object-[center_35%] sm:object-center opacity-70 sm:opacity-60 pointer-events-none" />
        </picture>
        {/* Gentle readable backdrop on mobile so both the dancing figure and text read crisp */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/85 via-[#020617]/55 to-[#020617]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/70 via-transparent to-[#020617]/50 hidden sm:block" />
        <div className="absolute top-[14%] right-[12%] h-56 w-56 rounded-full bg-amber-400/15 blur-[100px] motion-ambient" />
        <div className="absolute bottom-[15%] left-[12%] h-64 w-64 rounded-full bg-fuchsia-500/10 blur-[110px] motion-ambient" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center max-w-4xl pt-8">
          <div className="motion-rise inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0f172a]/85 border border-amber-500/40 text-amber-200 text-xs sm:text-sm font-medium mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Всемирный проект Творческого Объединения «Триумф»</span>
          </div>

          <h1 className="motion-rise-delay-1 text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-tight text-white leading-[1.08] mb-6 drop-shadow-2xl">
            Творческие конкурсы <br className="hidden sm:inline" />
            <span className="gold-gradient-text">мирового уровня</span>
          </h1>

          <p className="motion-rise-delay-2 text-base sm:text-xl text-slate-100 max-w-3xl mx-auto leading-relaxed mb-9 font-normal drop-shadow-lg">
            Онлайн-платформа для проведения международных творческих конкурсов. Получите профессиональную обратную связь от мировых экспертов, международный диплом и именную рецензию на официальном бланке.
          </p>

          <div className="motion-rise-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button onClick={() => handleOpenModal('misteriya-vokala')} size="lg" className="button-motion w-full sm:w-auto bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold px-8 py-6 rounded-2xl text-base shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2">
              <span>Подать заявку на конкурс</span><ArrowRight className="w-5 h-5" />
            </Button>
            <a href="#competitions" className="button-motion w-full sm:w-auto px-7 py-3.5 rounded-2xl border border-white/25 bg-[#0f172a]/70 hover:bg-[#1e293b]/90 text-white transition-all text-sm font-semibold flex items-center justify-center gap-2 backdrop-blur-md">
              <span>Выбрать направление</span><ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="motion-rise-delay-3 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-5 sm:p-7 rounded-3xl bg-[#071126]/75 border border-white/10 backdrop-blur-lg shadow-2xl">
            <div className="text-center p-2"><div className="text-2xl sm:text-4xl font-serif font-bold text-amber-400 mb-1">12+</div><div className="text-xs sm:text-sm text-slate-300">Стран в экспертном совете</div></div>
            <div className="text-center p-2"><div className="text-2xl sm:text-4xl font-serif font-bold text-amber-400 mb-1">14 дней</div><div className="text-xs sm:text-sm text-slate-300">Срок подведения итогов</div></div>
            <div className="text-center p-2"><div className="text-2xl sm:text-4xl font-serif font-bold text-amber-400 mb-1">100%</div><div className="text-xs sm:text-sm text-slate-300">Официальные дипломы</div></div>
            <div className="text-center p-2"><div className="text-2xl sm:text-4xl font-serif font-bold text-amber-400 mb-1">Гранты</div><div className="text-xs sm:text-sm text-slate-300">Поездки на очные фестивали</div></div>
          </div>
        </div>
      </section>

      <section className="py-5 border-y border-slate-800 bg-[#070d1e]">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-10">
          <img src={ASSETS.triumphLogo} alt="Творческое объединение Триумф" className="h-11 w-auto bg-white rounded-lg px-2.5 py-1.5 shadow-lg" />
          <div className="h-8 w-px bg-slate-700 hidden lg:block" />
          <p className="text-center lg:text-left text-xs uppercase tracking-[0.14em] text-slate-400 font-semibold">Организатор проектов ARTCODE — Творческое объединение «Триумф»</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-7 text-xs text-slate-300">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-amber-400" /> CID UNESCO</span>
            <span className="flex items-center gap-1.5"><Globe2 className="w-4 h-4 text-amber-400" /> Международные эксперты</span>
            <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-amber-400" /> Официальные дипломы</span>
          </div>
        </div>
      </section>

      <section id="competitions" className="py-20 bg-[#020617]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-3"><Flame className="w-3.5 h-3.5" /> Проекты платформы</div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">Выберите проект для участия</h2>
              <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">Одновременно на платформе открыт прием заявок на несколько конкурсов. Каждый месяц проекты обновляются, а итоги подводятся через 14 дней.</p>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-[#0f172a] border border-slate-800 rounded-2xl overflow-x-auto max-w-full">
              {[
                { id: 'all', label: 'Все проекты' }, { id: 'vocal', label: 'Вокал' }, { id: 'choreography', label: 'Хореография' }, { id: 'theater', label: 'Театр' }, { id: 'instrumental', label: 'Инструменты' }, { id: 'circus', label: 'Цирк' }
              ].map((tab) => (
                <button key={tab.id} onClick={() => setSelectedDiscipline(tab.id)} className={`button-motion px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap ${selectedDiscipline === tab.id ? 'bg-amber-400 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>{tab.label}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompetitions.map((comp) => {
              const Icon = disciplineIcons[comp.discipline];
              return (
                <div key={comp.id} className="group soft-lift relative flex flex-col justify-between rounded-3xl bg-[#0f172a] border border-slate-800 overflow-hidden">
                  {/* Top tags row placed cleanly outside the photo so badges never cover faces */}
                  <div className="p-4 pb-3 flex items-center justify-between gap-2 border-b border-slate-800/80 bg-[#0b1329]">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">{comp.disciplineLabel}</span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] bg-slate-800 text-slate-200 border border-slate-700">{comp.badge}</span>
                  </div>

                  {/* Fixed 16:9 presentation keeps the complete photographic composition visible at every breakpoint. */}
                  <div className="aspect-video w-full relative overflow-hidden bg-[#070e20] flex items-center justify-center">
                    <img
                      src={comp.id === 'misteriya-vokala' ? ASSETS.disciplines.folkVocal : getDisciplineImage(comp.discipline)}
                      alt={`Направление конкурса: ${comp.disciplineLabel}`}
                      className={`w-full h-full object-center transition-transform duration-500 ${comp.id === 'misteriya-vokala' ? 'object-cover group-hover:scale-[1.02]' : 'object-contain'}`}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0f172a] to-transparent pointer-events-none" />
                  </div>

                  <div className="px-6 pt-3 flex items-center gap-2 text-slate-300 text-xs font-medium border-b border-slate-800/60 pb-3">
                    <Icon className="w-4 h-4 text-amber-400" /> <span>{comp.deadline}</span>
                  </div>

                  <div className="p-6 sm:p-7 pt-3 flex flex-col flex-1">
                    <h3 className="text-xl font-serif font-bold text-white group-hover:text-amber-300 transition-colors mb-3 leading-snug">{comp.title}</h3>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-5">{comp.description}</p>
                    <div className="space-y-2 mb-6 flex-1">
                      {comp.features.map((feat, idx) => <div key={idx} className="flex items-start gap-2 text-xs text-slate-300"><Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /><span>{feat}</span></div>)}
                    </div>
                    <div className="p-3.5 rounded-2xl bg-[#020617] border border-slate-800 mb-5 text-xs">
                      <div className="text-slate-400 text-[11px] mb-1">Призовой фонд:</div><div className="text-amber-400 font-semibold">{comp.grandPrix}</div>
                      <div className="text-slate-400 text-[11px] mt-2">Эксперты конкурса:</div><div className="text-slate-300">{comp.juryPreview}</div>
                    </div>
                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                      <div><span className="block text-[11px] text-slate-400">Срок оценки</span><span className="text-xs font-semibold text-slate-200">{comp.resultsDate}</span></div>
                      <Button onClick={() => handleOpenModal(comp.id)} className="button-motion bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md">Подать заявку</Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#080e22] border-y border-slate-800">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12"><h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">В пакет участника конкурса обязательно включены:</h2><p className="text-slate-300 text-sm mt-2">Официальные документы с печатями и подписями для подтверждения квалификации и профессионального портфолио</p></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              [FileCheck2, 'Диплом международного образца', 'Официальный диплом с указанием степени лауреатства или звания дипломанта на бланке ТО «Триумф».'],
              [HeartHandshake, 'Благодарственное письмо педагогу', 'Именная благодарность преподавателям и руководителям коллективов для успешного прохождения аттестации.'],
              [Star, 'Именная рецензия экспертов', 'В большинстве проектов артисты получают рецензию с рекомендациями специалистов экспертного совета на официальном бланке.'],
              [Award, 'Призовой фонд и гранты', 'Бесплатные поездки и гранты на очные конкурсы, ценные призы, сертификаты и подарки от партнеров.'],
            ].map(([Icon, title, text], idx) => {
              const FeatureIcon = Icon as typeof Award;
              return <div key={idx} className="soft-lift p-6 rounded-2xl bg-[#0f172a] border border-slate-800 text-left"><div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-4 border border-amber-400/20"><FeatureIcon className="w-6 h-6" /></div><h3 className="text-lg font-serif font-bold text-white mb-2">{title as string}</h3><p className="text-xs text-slate-300 leading-relaxed">{text as string}</p></div>;
            })}
          </div>
        </div>
      </section>

      <section id="steps" className="py-20 bg-[#020617]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14"><div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-3">Инструкция</div><h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">Как принять участие в конкурсе</h2><p className="text-slate-400 text-sm sm:text-base mt-2">Простая последовательность подачи заявки и получения итогов</p></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              ['Шаг 1', 'Выберите проект', 'Выберите проект из списка: многожанровый конкурс или узкопрофильные проекты в рамках дисциплины.'],
              ['Шаг 2', 'Оформите материал', 'Запишите живое выступление на статичную камеру в качестве не менее 720р и разместите ссылку на удобной платформе.'],
              ['Шаг 3', 'Отправьте заявку и оплатите', 'Заполните онлайн-форму, прикрепите ссылку на материал и оплатите организационный взнос банковской картой.'],
              ['Шаг 4', 'Дождитесь объявления итогов', 'Через 14 дней оглашаются результаты. В течение 7 дней наградной пакет отправляется на электронную почту.'],
            ].map(([step, title, text], index) => <div key={step} className="soft-lift p-6 rounded-3xl bg-[#0f172a] border border-slate-800 text-left"><div className="text-3xl font-serif font-black text-amber-400 mb-3">{step}</div><h3 className="text-lg font-serif font-bold text-white mb-2">{title}</h3><p className="text-xs text-slate-300 leading-relaxed">{text}</p></div>)}
          </div>
          <div className="mt-10 text-center"><Button onClick={() => handleOpenModal('misteriya-vokala')} className="button-motion bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-8 py-3 rounded-xl text-sm shadow-lg shadow-amber-500/20">Заполнить онлайн-заявку прямо сейчас</Button></div>
        </div>
      </section>

      <section id="rules" className="py-16 bg-[#080e22] border-y border-slate-800">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10"><div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-3">Положение и регламент</div><h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">Правила оформления конкурсного материала</h2><p className="text-slate-400 text-xs sm:text-sm mt-1">Официальные требования к видеозаписям и работам для объективной экспертной оценки</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {PARTICIPATION_RULES.map((block, idx) => <div key={idx} className="soft-lift p-6 rounded-2xl bg-[#0f172a] border border-slate-800 text-left"><h3 className="text-base font-serif font-bold text-white mb-3 flex items-center gap-2"><Video className="w-4 h-4 text-amber-400 shrink-0" />{block.title}</h3><ul className="space-y-2 text-xs text-slate-300 leading-relaxed">{block.rules.map((rule, rIdx) => <li key={rIdx} className="flex items-start gap-2"><span className="text-amber-400 font-bold">•</span><span>{rule}</span></li>)}</ul></div>)}
          </div>
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-100 text-xs max-w-4xl mx-auto mt-6 text-center"><strong>Важная информация по оплате:</strong> Оплата участия в конкурсе возможна банковской картой, выпущенной российским банком, или картами зарубежных банков с платежной системой МИР. По вопросам оплаты картами банков стран СНГ пишите на <a href="mailto:hello@my-artcode.com" className="underline font-bold text-amber-300">hello@my-artcode.com</a>.</div>
        </div>
      </section>

      <section id="jury" className="py-20 bg-[#020617] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-9 gap-4"><div><div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-3">Жюри мирового значения</div><h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">Экспертный совет платформы ARTCODE</h2><p className="text-slate-400 text-sm mt-2 max-w-xl">Международные практики и профессиональная обратная связь — без громоздкой галереи на странице.</p></div><div className="text-xs text-amber-300 font-medium">Именная рецензия с рекомендациями каждому участнику</div></div>

          <div className="max-w-4xl mx-auto rounded-3xl bg-[#0f172a] border border-slate-800 p-4 sm:p-6 shadow-2xl shadow-black/20">
            <div className="flex items-center justify-between gap-3 mb-5">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Эксперт {activeJuryIndex + 1} из {JURY_MEMBERS.length}</span>
              <div className="flex items-center gap-2">
                <button onClick={showPreviousExpert} className="button-motion h-10 w-10 rounded-xl border border-slate-700 bg-[#071126] hover:border-amber-400/70 text-white flex items-center justify-center" aria-label="Предыдущий эксперт"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={showNextExpert} className="button-motion h-10 w-10 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/10" aria-label="Следующий эксперт"><ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-7 text-left motion-rise" key={activeJuryMember.id}>
              <div className="shrink-0 mx-auto sm:mx-0 h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-[#071126] border border-amber-400/30 overflow-hidden flex items-center justify-center shadow-lg shadow-black/30">
                {activeJuryPhoto ? <img src={activeJuryPhoto} alt={`Портрет эксперта ${activeJuryMember.name}`} className="h-full w-full object-contain object-center" /> : <span className="font-serif text-3xl text-amber-300">{activeJuryMember.avatarText}</span>}
              </div>
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2"><h3 className="text-xl sm:text-2xl font-serif font-bold text-white">{activeJuryMember.name}</h3><span className="text-[11px] mx-auto sm:mx-0 w-fit px-2.5 py-1 rounded-full bg-[#071126] border border-slate-700 text-amber-200">{activeJuryMember.country}, {activeJuryMember.city}</span></div>
                <p className="text-sm text-amber-400 font-medium mb-3">{activeJuryMember.role}</p>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-300 max-w-2xl">{activeJuryMember.credentials}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-1.5" aria-label="Выбор эксперта">
              {JURY_MEMBERS.map((member, index) => <button key={member.id} onClick={() => setActiveJuryIndex(index)} className={`h-1.5 rounded-full transition-all ${index === activeJuryIndex ? 'w-7 bg-amber-400' : 'w-1.5 bg-slate-600 hover:bg-slate-400'}`} aria-label={`Показать эксперта ${member.name}`} />)}
            </div>
          </div>
        </div>
      </section>

      <section id="winners" className="py-20 bg-[#080e22] border-y border-slate-800">
        <div className="container mx-auto px-4 sm:px-6"><div className="text-center max-w-2xl mx-auto mb-14"><div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-3">Итоги конкурсов</div><h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">Победители и обладатели Гран-при</h2><p className="text-slate-400 text-sm mt-2">Официальные итоги прошедших конкурсов платформы ARTCODE</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{RECENT_WINNERS.map((win) => <div key={win.id} className="soft-lift p-6 rounded-3xl bg-[#0f172a] border border-slate-800 flex flex-col justify-between text-left"><div><div className="flex items-center justify-between text-xs text-slate-400 mb-2"><span className="text-amber-400 font-medium">{win.award}</span><span>{win.date}</span></div><h3 className="text-lg font-serif font-bold text-white mb-1">{win.winner}</h3><div className="text-xs text-slate-400 mb-3">Руководитель: <span className="text-slate-200">{win.director}</span></div><p className="text-xs text-slate-300 mb-3 bg-[#020617] p-3 rounded-xl border border-slate-800"><strong>Проект:</strong> {win.competition}</p></div><div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 pt-2 border-t border-slate-800"><Sparkles className="w-3.5 h-3.5" /><span>{win.specialPrize}</span></div></div>)}</div>
        </div>
      </section>

      <section id="news" className="py-20 bg-[#020617] border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10"><div><div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-3"><Newspaper className="w-3.5 h-3.5" /> Новости ARTCODE</div><h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">Новости, результаты и возможности</h2><p className="text-slate-400 text-sm mt-2 max-w-2xl">Короткая лента материалов из новостного раздела исходного сайта: важные результаты, призовой фонд и новости проектов.</p></div><a href="https://my-artcode.com/" target="_blank" rel="noopener noreferrer" className="button-motion w-fit inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 text-xs font-semibold">Архив новостей <ArrowUpRight className="w-4 h-4" /></a></div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {NEWS_ITEMS.map((item) => <article key={item.id} className="soft-lift rounded-2xl bg-[#0f172a] border border-slate-800 p-5 text-left flex flex-col"><div className="flex items-center justify-between gap-3 mb-4"><span className="text-[10px] uppercase tracking-[0.12em] text-amber-400 font-bold">{item.category}</span>{item.period && <span className="text-[10px] text-slate-500 whitespace-nowrap">{item.period}</span>}</div><h3 className="text-lg font-serif font-bold text-white leading-snug mb-3">{item.title}</h3><p className="text-xs text-slate-300 leading-relaxed">{item.summary}</p></article>)}
          </div>
        </div>
      </section>

      <section id="partners" className="py-20 bg-[#020617]">
        <div className="container mx-auto px-4 sm:px-6"><div className="text-center max-w-xl mx-auto mb-12"><div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-3">Партнеры конкурса</div><h2 className="text-3xl font-serif font-bold text-white">Культурные ассоциации и организации</h2><p className="text-slate-400 text-xs sm:text-sm mt-2">Названия партнеров вынесены отдельной контрастной строкой: их легко прочесть даже на светлых или минималистичных логотипах.</p></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">{PARTNERS_DATA.map((p) => <a key={p.logoKey} href={p.url} target="_blank" rel="noopener noreferrer" aria-label={`Открыть сайт партнера: ${p.name}`} className="group soft-lift min-h-52 rounded-2xl bg-[#101a31] border border-slate-700/80 flex flex-col overflow-hidden text-center shadow-lg shadow-black/20"><div className="px-3 pt-3 text-[11px] sm:text-xs font-bold tracking-wide uppercase text-white min-h-10 flex items-center justify-center leading-tight">{p.name}</div><div className="mx-3 h-24 min-h-24 rounded-xl bg-white flex items-center justify-center p-3 border border-slate-200 shadow-inner"><img src={ASSETS.partners[p.logoKey]} alt={`Официальный логотип партнера: ${p.name}`} className="max-w-full max-h-full object-contain image-zoom" /></div><div className="p-3 pt-2"><div className="text-[10px] text-slate-300 leading-snug">{p.country} • {p.category}</div><div className="mt-1 text-[10px] font-semibold text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity">Открыть сайт &rarr;</div></div></a>)}</div>
        </div>
      </section>

      <section id="faq" className="py-20 bg-[#080e22] border-t border-slate-800"><div className="container mx-auto px-4 sm:px-6 max-w-3xl"><div className="text-center mb-10"><h2 className="text-3xl font-serif font-bold text-white">Часто задаваемые вопросы</h2><p className="text-slate-400 text-sm mt-2">Нажмите на вопрос, чтобы открыть ответ</p></div><div className="space-y-3">{FAQ_DATA.map((item, idx) => <details key={idx} className="group rounded-2xl bg-[#0f172a] border border-slate-800 text-left open:border-amber-400/30 transition-colors"><summary className="list-none w-full flex items-center gap-3 p-5 text-left cursor-pointer"><HelpCircle className="w-4 h-4 text-amber-400 shrink-0" /><h3 className="flex-1 text-base font-serif font-semibold text-white">{item.q}</h3><ChevronRight className="w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 group-open:rotate-90" /></summary><div className="px-5 pb-5 pl-12 text-xs sm:text-sm text-slate-300 leading-relaxed">{item.a}</div></details>)}</div></div></section>

      <section className="py-16 bg-[#020617] border-t border-slate-800"><div className="container mx-auto px-4 sm:px-6 max-w-2xl text-center"><div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold mb-4"><Mail className="w-3.5 h-3.5" /> Подписка на рассылку</div><h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-3">Будьте в курсе новых конкурсов и грантов</h2><p className="text-slate-300 text-xs sm:text-sm mb-6 max-w-md mx-auto">Подпишитесь и будьте в курсе новых конкурсов, вручений специальных призов и розыгрышей денежных грантов.</p>
        {!newsletterSubscribed ? <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"><Input type="text" placeholder="Имя" value={newsletterName} onChange={(e) => setNewsletterName(e.target.value)} className="bg-[#0f172a] border-slate-700 text-white rounded-xl text-sm" /><Input type="email" required placeholder="Электронная почта *" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} className="bg-[#0f172a] border-slate-700 text-white rounded-xl text-sm" /><Button type="submit" className="button-motion bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-2 rounded-xl text-sm shrink-0">Подписаться</Button></form> : <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm max-w-md mx-auto flex items-center justify-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400" /><span>Вы успешно подписаны на новости ARTCODE!</span></div>}
        <p className="text-[11px] text-slate-400 mt-3">Согласие на обработку персональных данных в соответствии с <a href="http://www.triumph-org.ru/ru/terms" target="_blank" rel="noopener noreferrer" className="underline text-slate-300">политикой безопасности</a></p><div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-400"><span>Электронная почта оргкомитета: <a href="mailto:hello@my-artcode.com" className="text-amber-400 hover:underline">hello@my-artcode.com</a></span></div>
      </div></section>

      <footer className="py-10 bg-[#020617] border-t border-slate-900 text-xs text-slate-400"><div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6"><div className="flex items-center gap-4"><img src={ASSETS.triumphLogo} alt="Творческое объединение Триумф" className="h-12 w-auto bg-white rounded-lg px-2 py-1.5" /><div className="h-9 w-px bg-slate-800 hidden sm:block" /><div><div className="text-white font-serif font-bold text-sm">ARTCODE</div><div>Всемирный проект Творческого Объединения «Триумф» (CA TRIUMPH).</div></div></div><div className="flex flex-wrap items-center justify-center gap-4 text-slate-400"><a href="https://vk.com/triumph_org" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">ВКонтакте</a><a href="https://ok.ru/triumphorg/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">Одноклассники</a><a href="https://triumph-org.ru/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">ТО «Триумф»</a><a href="http://artcompass.ru/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">АРТКОМПАС</a><a href="http://www.triumph-org.ru/ru/terms" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">Политика безопасности</a></div></div></footer>

      <ApplicationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} defaultCompetitionId={activeCompId} />
    </div>
  );
}
