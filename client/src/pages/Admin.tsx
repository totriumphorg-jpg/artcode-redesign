import React, { useState } from 'react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { startLogin } from '@/const';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Calendar,
  CheckCircle2,
  Copy,
  Download,
  Edit3,
  FileSpreadsheet,
  FileText,
  Filter,
  Layers,
  Lock,
  LogOut,
  Plus,
  RefreshCw,
  Settings,
  ShieldCheck,
  Trash2,
  Users,
  CreditCard,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';

export default function Admin() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'contests' | 'regulations' | 'reports' | 'applications' | 'paykeeper'>('applications');

  // Contests state
  const { data: contestsList, refetch: refetchContests } = trpc.contests.listAllForAdmin.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const [selectedContestId, setSelectedContestId] = useState<number | null>(null);
  const [duplicateTitle, setDuplicateTitle] = useState('');
  const [duplicateSlug, setDuplicateSlug] = useState('');
  const [showDuplicateModal, setShowDuplicateModal] = useState<number | null>(null);
  const [editingContestModal, setEditingContestModal] = useState<{
    id: number;
    title: string;
    receptionPeriod: string;
    resultsPeriod: string;
    feeAmount: number;
    juryNames: string;
    description: string;
  } | null>(null);

  // Regulations state
  const [regContestSlug, setRegContestSlug] = useState<string>('misteriya-zvuka');
  const { data: currentContestRegs, refetch: refetchContestRegs } = trpc.contests.bySlug.useQuery(
    { slug: regContestSlug },
    { enabled: Boolean(regContestSlug) }
  );
  const [editingRegSection, setEditingRegSection] = useState<{ sectionKey: string; title: string; content: string } | null>(null);

  // Reports state
  const { data: reportsList, refetch: refetchReports } = trpc.reports.list.useQuery();
  const [newReport, setNewReport] = useState({
    title: '',
    slug: '',
    category: 'Официальный отчет',
    publishedDate: '',
    periodLabel: '',
    summary: '',
    fullReport: '',
  });
  const [protocolFile, setProtocolFile] = useState<File | null>(null);

  // Applications state
  const [selectedAppContestSlug, setSelectedAppContestSlug] = useState<string>('all');
  const { data: applicationsList, refetch: refetchApplications } = trpc.applications.list.useQuery(
    { contestSlug: selectedAppContestSlug },
    { enabled: isAuthenticated }
  );

  // Mutations
  const duplicateMutation = trpc.contests.duplicate.useMutation({
    onSuccess: () => {
      toast.success('Конкурс успешно скопирован! Вы можете изменить его наполнение.');
      setShowDuplicateModal(null);
      setDuplicateTitle('');
      setDuplicateSlug('');
      refetchContests();
    },
    onError: (err) => toast.error(`Ошибка при копировании: ${err.message}`),
  });

  const updateContestMutation = trpc.contests.update.useMutation({
    onSuccess: () => {
      toast.success('Параметры конкурса успешно обновлены');
      setEditingContestModal(null);
      refetchContests();
    },
    onError: (err) => toast.error(`Ошибка при сохранении: ${err.message}`),
  });

  const saveRegMutation = trpc.contests.saveRegulation.useMutation({
    onSuccess: () => {
      toast.success('Раздел положения сохранен');
      setEditingRegSection(null);
      refetchContestRegs();
    },
    onError: (err) => toast.error(`Ошибка: ${err.message}`),
  });

  const createReportMutation = trpc.reports.create.useMutation({
    onSuccess: () => {
      toast.success('Отчет успешно опубликован');
      setNewReport({
        title: '',
        slug: '',
        category: 'Официальный отчет',
        publishedDate: '',
        periodLabel: '',
        summary: '',
        fullReport: '',
      });
      setProtocolFile(null);
      refetchReports();
    },
    onError: (err) => toast.error(`Ошибка: ${err.message}`),
  });

  const uploadProtocolMutation = trpc.reports.uploadProtocol.useMutation({
    onError: (err) => toast.error(`Не удалось загрузить протокол: ${err.message}`),
  });

  const exportCsvMutation = trpc.applications.exportCsv.useMutation({
    onSuccess: (data) => {
      const blob = new Blob(['\uFEFF' + data.csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.filename;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('CSV-файл успешно выгружен!');
    },
    onError: (err) => toast.error(`Ошибка выгрузки CSV: ${err.message}`),
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mb-3"></div>
          <p className="text-slate-600 font-medium">Проверка доступа к панели управления...</p>
        </div>
      </div>
    );
  }

  // Если пользователь не авторизован через платформу
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Панель управления ARTCODE</h2>
          <p className="text-slate-600 mb-6 text-sm">
            Доступ предназначен для администраторов: создание сезонных конкурсов, редактирование положений, отчетов и раздельная выгрузка заявок в CSV.
          </p>
          <Button
            onClick={() => startLogin()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl shadow"
          >
            Войти как администратор
          </Button>
          <div className="mt-4">
            <Link href="/" className="text-xs text-slate-500 hover:text-blue-600">
              ← На главную страницу сайта
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Top bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-extrabold text-xl text-blue-900 tracking-tight">
              ARTCODE
            </Link>
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 font-semibold">
              Управление платформой
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="hidden sm:flex items-center gap-2 text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{user?.name || user?.email || 'Администратор'}</span>
            </div>
            <Link href="/" target="_blank" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> Открыть сайт
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => logout()}
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" /> Выйти
            </Button>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2">
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
                activeTab === 'applications'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              Заявки и CSV
            </button>
            <button
              onClick={() => setActiveTab('contests')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
                activeTab === 'contests'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              Конкурсы и копирование
            </button>
            <button
              onClick={() => setActiveTab('regulations')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
                activeTab === 'regulations'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              Положения конкурсов
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
                activeTab === 'reports'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Итоги и отчеты
            </button>
            <button
              onClick={() => setActiveTab('paykeeper')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
                activeTab === 'paykeeper'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              PayKeeper
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Applications & CSV */}
      {activeTab === 'applications' && (
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Поступившие заявки участников</h1>
              <p className="text-sm text-slate-600 mt-1">
                Выберите конкретный конкурс (art, dance, vocal и др.) и скачайте заявки отдельным CSV-файлом
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => exportCsvMutation.mutate({ contestSlug: selectedAppContestSlug })}
                disabled={exportCsvMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" />
                {exportCsvMutation.isPending ? 'Формирование CSV...' : 'Скачать в CSV'}
              </Button>
            </div>
          </div>

          {/* Filter by contest (скрин 12 заказчика) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Filter className="w-5 h-5 text-slate-500" />
              <span className="text-sm font-semibold text-slate-700">Выбор конкурса для сгрузки:</span>
              <select
                value={selectedAppContestSlug}
                onChange={(e) => setSelectedAppContestSlug(e.target.value)}
                className="border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium bg-slate-50 focus:bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Все конкурсы (общий список)</option>
                {contestsList?.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.disciplineLabel} — {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs text-slate-500">
              Всего заявок в выборке: <strong>{applicationsList?.length || 0}</strong>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-slate-900 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Конкурс</th>
                    <th className="px-4 py-3">Участник / Коллектив</th>
                    <th className="px-4 py-3">Номинация / Номер</th>
                    <th className="px-4 py-3">Город</th>
                    <th className="px-4 py-3">Контакты</th>
                    <th className="px-4 py-3">Видеозапись</th>
                    <th className="px-4 py-3">Статус оплаты</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applicationsList && applicationsList.length > 0 ? (
                    applicationsList.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-slate-500">#{app.id}</td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-slate-900 block">{app.contestTitle}</span>
                          <span className="text-xs text-slate-500">{app.discipline}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">{app.participantName}</div>
                          {app.collectiveName && <div className="text-xs text-slate-500">{app.collectiveName}</div>}
                          <div className="text-xs text-slate-400">Возраст: {app.ageCategory}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900">{app.nomination}</div>
                          <div className="text-xs text-slate-500">{app.performanceTitle}</div>
                        </td>
                        <td className="px-4 py-3 text-xs">{app.city}</td>
                        <td className="px-4 py-3 text-xs">
                          <div>{app.email}</div>
                          <div className="text-slate-500">{app.phone}</div>
                        </td>
                        <td className="px-4 py-3">
                          <a
                            href={app.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1 font-medium"
                          >
                            Смотреть ↗
                          </a>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                              app.paymentStatus === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {app.paymentStatus === 'paid' ? 'Оплачено' : 'Ожидает оплаты'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                        По данному конкурсу пока нет заявок. Новые заявки с сайта сразу отображаются здесь.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      )}

      {/* Tab 2: Contests & Duplication (скрин 13 заказчика) */}
      {activeTab === 'contests' && (
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Управление конкурсами</h1>
              <p className="text-sm text-slate-600 mt-1">
                Создавайте конкурсы или копируйте любой проект для сезонных программ (например: «В гостях у Снегурочки»)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contestsList?.map((contest) => (
              <div
                key={contest.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:border-blue-400 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-blue-100 text-blue-800">
                      {contest.disciplineLabel}
                    </span>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      {contest.feeAmount} руб.
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 mb-2 leading-snug">{contest.title}</h3>
                  <p className="text-xs text-slate-500 mb-4 line-clamp-2">{contest.description}</p>

                  <div className="text-xs text-slate-600 space-y-1 mb-4 p-3 bg-slate-50 rounded-xl">
                    <div><strong>Прием:</strong> {contest.receptionPeriod}</div>
                    <div><strong>Жюри:</strong> {contest.juryNames}</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link href={`/contest/${contest.slug}`}>
                    <Button variant="outline" size="sm" className="text-xs">
                      Положение ↗
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setEditingContestModal({
                        id: contest.id,
                        title: contest.title,
                        receptionPeriod: contest.receptionPeriod,
                        resultsPeriod: contest.resultsPeriod,
                        feeAmount: contest.feeAmount,
                        juryNames: contest.juryNames,
                        description: contest.description,
                      })
                    }
                    className="text-xs border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Изменить
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => {
                      setShowDuplicateModal(contest.id);
                      setDuplicateTitle(`${contest.title} (Новый сезон)`);
                      setDuplicateSlug(`${contest.slug}-season-${Date.now().toString().slice(-4)}`);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" /> Копировать проект
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Duplication modal */}
          {showDuplicateModal !== null && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Создать копию конкурса</h3>
                <p className="text-xs text-slate-600 mb-4">
                  Все положения и настройки будут скопированы в новый конкурс. Вы сможете изменить название, праздничное наполнение и даты.
                </p>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Название нового конкурса:</label>
                    <Input
                      value={duplicateTitle}
                      onChange={(e) => setDuplicateTitle(e.target.value)}
                      placeholder="Например: Новогодний конкурс «В гостях у Снегурочки»"
                      className="border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">URL-идентификатор (slug):</label>
                    <Input
                      value={duplicateSlug}
                      onChange={(e) => setDuplicateSlug(e.target.value)}
                      placeholder="v-gostyah-u-snegurochki"
                      className="border-slate-300 font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowDuplicateModal(null)}>
                    Отмена
                  </Button>
                  <Button
                    onClick={() => {
                      if (!duplicateTitle || !duplicateSlug) {
                        toast.error('Заполните название и URL конкурса');
                        return;
                      }
                      duplicateMutation.mutate({
                        sourceId: showDuplicateModal,
                        newTitle: duplicateTitle,
                        newSlug: duplicateSlug,
                      });
                    }}
                    disabled={duplicateMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  >
                    {duplicateMutation.isPending ? 'Создание...' : 'Создать проект'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Edit contest modal */}
          {editingContestModal !== null && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Редактировать конкурс</h3>
                <p className="text-xs text-slate-600 mb-4">
                  Измените название, сроки проведения, размер организационного взноса, состав экспертного совета или описание.
                </p>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Название конкурса:</label>
                    <Input
                      value={editingContestModal.title}
                      onChange={(e) => setEditingContestModal({ ...editingContestModal, title: e.target.value })}
                      className="border-slate-300 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Период приема заявок:</label>
                      <Input
                        value={editingContestModal.receptionPeriod}
                        onChange={(e) => setEditingContestModal({ ...editingContestModal, receptionPeriod: e.target.value })}
                        className="border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Срок подведения итогов:</label>
                      <Input
                        value={editingContestModal.resultsPeriod}
                        onChange={(e) => setEditingContestModal({ ...editingContestModal, resultsPeriod: e.target.value })}
                        className="border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Организационный взнос (руб.):</label>
                    <Input
                      type="number"
                      value={editingContestModal.feeAmount}
                      onChange={(e) => setEditingContestModal({ ...editingContestModal, feeAmount: Number(e.target.value) || 0 })}
                      className="border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Три члена жюри конкурса:</label>
                    <Input
                      value={editingContestModal.juryNames}
                      onChange={(e) => setEditingContestModal({ ...editingContestModal, juryNames: e.target.value })}
                      className="border-slate-300 text-sm"
                    />
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      Укажите трех экспертов через запятую, например: Сильвио Занон (Италия), Альберт Жалилов (Россия), Элен Бержи (Франция)
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Краткое описание:</label>
                    <Textarea
                      rows={3}
                      value={editingContestModal.description}
                      onChange={(e) => setEditingContestModal({ ...editingContestModal, description: e.target.value })}
                      className="border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <Button variant="outline" onClick={() => setEditingContestModal(null)}>
                    Отмена
                  </Button>
                  <Button
                    onClick={() => {
                      if (!editingContestModal.title || !editingContestModal.juryNames) {
                        toast.error('Заполните обязательные поля');
                        return;
                      }
                      updateContestMutation.mutate({
                        id: editingContestModal.id,
                        title: editingContestModal.title,
                        receptionPeriod: editingContestModal.receptionPeriod,
                        resultsPeriod: editingContestModal.resultsPeriod,
                        feeAmount: editingContestModal.feeAmount,
                        juryNames: editingContestModal.juryNames,
                        description: editingContestModal.description,
                      });
                    }}
                    disabled={updateContestMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  >
                    {updateContestMutation.isPending ? 'Сохранение...' : 'Сохранить изменения'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* Tab 3: Regulations Editor (скрин 10-11 заказчика) */}
      {activeTab === 'regulations' && (
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Редактирование положений конкурсов</h1>
              <p className="text-sm text-slate-600 mt-1">
                Выберите конкурс для редактирования пунктов положения (Цели, Номинации, Критерии, Финансовые условия)
              </p>
            </div>

            <select
              value={regContestSlug}
              onChange={(e) => setRegContestSlug(e.target.value)}
              className="border border-slate-300 rounded-xl px-4 py-2 text-sm font-semibold bg-white text-slate-900"
            >
              {contestsList?.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sections list */}
            <div className="lg:col-span-1 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2">Разделы положения</h3>
              {currentContestRegs?.regulations?.map((reg) => (
                <div
                  key={reg.id}
                  onClick={() => setEditingRegSection({ sectionKey: reg.sectionKey, title: reg.title, content: reg.content })}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    editingRegSection?.sectionKey === reg.sectionKey
                      ? 'bg-blue-50 border-blue-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-sm text-slate-900">{reg.title}</div>
                  <div className="text-xs text-slate-500 line-clamp-1 mt-1">{reg.content}</div>
                </div>
              ))}
            </div>

            {/* Section content editor */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              {editingRegSection ? (
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-4">Редактирование раздела: {editingRegSection.title}</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Заголовок раздела:</label>
                      <Input
                        value={editingRegSection.title}
                        onChange={(e) => setEditingRegSection({ ...editingRegSection, title: e.target.value })}
                        className="border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Текст раздела:</label>
                      <Textarea
                        rows={12}
                        value={editingRegSection.content}
                        onChange={(e) => setEditingRegSection({ ...editingRegSection, content: e.target.value })}
                        className="border-slate-300 font-sans text-sm"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                      <Button variant="outline" onClick={() => setEditingRegSection(null)}>
                        Отмена
                      </Button>
                      <Button
                        onClick={() => {
                          if (!currentContestRegs?.id) return;
                          saveRegMutation.mutate({
                            contestId: currentContestRegs.id,
                            sectionKey: editingRegSection.sectionKey,
                            title: editingRegSection.title,
                            content: editingRegSection.content,
                          });
                        }}
                        disabled={saveRegMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                      >
                        {saveRegMutation.isPending ? 'Сохранение...' : 'Сохранить изменения'}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center text-slate-500">
                  Выберите раздел положения слева для редактирования текста.
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* Tab 4: Reports (скрин 8 заказчика) */}
      {activeTab === 'reports' && (
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Итоги и отчеты конкурсов</h1>
            <p className="text-sm text-slate-600 mt-1">
              Добавляйте отчеты с прошедших конкурсов, прописывайте даты и полные тексты итогов (каждый отчет кликабелен)
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-base text-slate-900 mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" /> Добавить отчет о результатах
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Заголовок отчета:</label>
                  <Input
                    value={newReport.title}
                    onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                    placeholder="Отчет об итогах конкурсов ARTCODE (период...)"
                    className="border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">URL-идентификатор (slug):</label>
                  <Input
                    value={newReport.slug}
                    onChange={(e) => setNewReport({ ...newReport, slug: e.target.value })}
                    placeholder="itogi-artcode-01-02"
                    className="border-slate-300 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Дата публикации:</label>
                  <Input
                    value={newReport.publishedDate}
                    onChange={(e) => setNewReport({ ...newReport, publishedDate: e.target.value })}
                    placeholder="Например: 15 февраля"
                    className="border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Краткое резюме:</label>
                  <Textarea
                    rows={3}
                    value={newReport.summary}
                    onChange={(e) => setNewReport({ ...newReport, summary: e.target.value })}
                    placeholder="Краткое описание для карточки в ленте..."
                    className="border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Полный текст отчета:</label>
                  <Textarea
                    rows={6}
                    value={newReport.fullReport}
                    onChange={(e) => setNewReport({ ...newReport, fullReport: e.target.value })}
                    placeholder="Подробный отчет, протокол, списки..."
                    className="border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Протокол / приложение к отчету (PDF, DOC, DOCX):</label>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(e) => setProtocolFile(e.target.files?.[0] || null)}
                    className="border-slate-300 text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-blue-700"
                  />
                  <p className="mt-1 text-[11px] text-slate-500">
                    {protocolFile ? `Выбран файл: ${protocolFile.name}` : 'Необязательно. Файл будет доступен для скачивания на странице отчета.'}
                  </p>
                </div>

                <Button
                  onClick={async () => {
                    if (!newReport.title || !newReport.slug || !newReport.publishedDate || !newReport.summary || !newReport.fullReport) {
                      toast.error('Заполните обязательные поля отчета');
                      return;
                    }

                    let protocolUrl: string | undefined;
                    if (protocolFile) {
                      if (protocolFile.size > 10 * 1024 * 1024) {
                        toast.error('Размер файла не должен превышать 10 МБ');
                        return;
                      }
                      const base64Data = await new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => {
                          const result = String(reader.result || '');
                          resolve(result.split(',')[1] || '');
                        };
                        reader.onerror = () => reject(new Error('Не удалось прочитать файл'));
                        reader.readAsDataURL(protocolFile);
                      });
                      const uploaded = await uploadProtocolMutation.mutateAsync({
                        fileName: protocolFile.name,
                        contentType: protocolFile.type || 'application/octet-stream',
                        base64Data,
                      });
                      protocolUrl = uploaded.url;
                    }

                    createReportMutation.mutate({ ...newReport, protocolUrl });
                  }}
                  disabled={createReportMutation.isPending || uploadProtocolMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                >
                  {createReportMutation.isPending || uploadProtocolMutation.isPending ? 'Публикация...' : 'Опубликовать отчет'}
                </Button>
              </div>
            </div>

            {/* List */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-bold text-base text-slate-900">Опубликованные отчеты</h3>
              {reportsList?.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      {r.category}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Дата: {r.publishedDate}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base mb-1">{r.title}</h4>
                  <p className="text-xs text-slate-600 mb-3">{r.summary}</p>
                  <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                    <span className="text-slate-400 font-mono">/report/{r.slug}</span>
                    <Link href={`/report/${r.slug}`} target="_blank" className="text-blue-600 font-semibold hover:underline">
                      Открыть страницу отчета ↗
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* Tab 5: PayKeeper settings */}
      {activeTab === 'paykeeper' && (
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Интеграция с платежной системой PayKeeper</h1>
                <p className="text-sm text-slate-600">
                  Серверный модуль шлюза PayKeeper подготовлен и соединен с базой заявок
                </p>
              </div>
            </div>

            <div className="space-y-6 text-sm text-slate-700">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h4 className="font-bold text-blue-900 mb-1">Текущий статус интеграции:</h4>
                <p className="text-xs text-blue-950">
                  При подаче заявки формируется уникальный номер заказа, сохраняется транзакция и рассчитывается взнос. После внесения защищенных параметров система создает счет через официальный API PayKeeper и переводит участника на его платежную страницу.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-5 space-y-4">
                <h3 className="font-bold text-slate-900 text-base">Данные для подключения от Алексея:</h3>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Серверный URL PayKeeper (PAYKEEPER_SERVER_URL):</label>
                  <Input placeholder="https://<имя-магазина>.server.paykeeper.ru" disabled className="bg-slate-50 border-slate-300" />
                  <span className="text-xs text-slate-500 mt-1 block">Предоставляется личным менеджером PayKeeper</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">API-токен PayKeeper (PAYKEEPER_API_TOKEN):</label>
                  <Input type="password" placeholder="••••••••••••••••••••••••" disabled className="bg-slate-50 border-slate-300" />
                  <span className="text-xs text-slate-500 mt-1 block">Используется сервером для создания счета через API; не хранится в браузере и не отображается администраторам</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Секретное слово POST-уведомлений (PAYKEEPER_NOTIFICATION_SECRET):</label>
                  <Input type="password" placeholder="••••••••••••••••••••••••" disabled className="bg-slate-50 border-slate-300" />
                  <span className="text-xs text-slate-500 mt-1 block">Проверяет MD5-подпись уведомления PayKeeper перед сменой статуса заявки на «Оплачено»</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">URL POST-уведомлений, который нужно указать в личном кабинете PayKeeper:</label>
                  <div className="p-2.5 bg-slate-100 rounded-lg font-mono text-xs text-slate-800 break-all select-all">
                    https://artcodered-bzbfykup.manus.space/api/paykeeper/notification
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block">Дополнительно в защищенных переменных сервера задается PAYKEEPER_RESULT_CALLBACK_URL для возврата пользователя после оплаты.</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        ARTCODE Platform Administration © 2026. Творческое объединение «Триумф».
      </footer>
    </div>
  );
}
