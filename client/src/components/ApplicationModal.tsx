import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { trpc } from '@/lib/trpc';
import { COMPETITIONS_DATA } from '@/const';
import { CheckCircle2, CreditCard, ExternalLink, ShieldCheck, Sparkles, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultContestId?: string;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  defaultContestId = 'misteriya-zvuka',
}) => {
  const [selectedContestSlug, setSelectedContestSlug] = useState<string>(defaultContestId);
  const [participantName, setParticipantName] = useState('');
  const [collectiveName, setCollectiveName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [institution, setInstitution] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [nomination, setNomination] = useState('');
  const [performanceTitle, setPerformanceTitle] = useState('');
  const [ageCategory, setAgeCategory] = useState('7-9 лет');
  const [comment, setComment] = useState('');

  const [submissionResult, setSubmissionResult] = useState<{
    applicationId: number;
    orderId: string;
    paymentAmount: number;
  } | null>(null);

  const { data: dbContests } = trpc.contests.list.useQuery();
  const contestList = (dbContests && dbContests.length > 0) ? dbContests : COMPETITIONS_DATA;
  const currentContest = contestList.find((c) => c.slug === selectedContestSlug) || contestList[0];

  useEffect(() => {
    if (isOpen) {
      setSelectedContestSlug(defaultContestId);
    }
  }, [defaultContestId, isOpen]);

  const submitMutation = trpc.applications.submit.useMutation({
    onSuccess: (data) => {
      setSubmissionResult(data);
      toast.success('Заявка успешно зарегистрирована!');
    },
    onError: (err) => {
      toast.error(`Ошибка при отправке заявки: ${err.message}`);
    },
  });

  const invoiceMutation = trpc.payment.createInvoice.useMutation({
    onSuccess: (data) => {
      if (data.isConfigured && data.paymentUrl) {
        window.location.assign(data.paymentUrl);
        return;
      }
      toast.error(data.instructions || 'Онлайн-оплата временно недоступна.');
    },
    onError: (err) => toast.error(`Не удалось создать счет: ${err.message}`),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentContest) return;

    submitMutation.mutate({
      contestId: (currentContest as any).id || 1,
      contestSlug: currentContest.slug,
      contestTitle: currentContest.title,
      discipline: (currentContest as any).disciplineLabel || 'Творчество',
      participantName,
      collectiveName: collectiveName || undefined,
      ageCategory,
      nomination,
      performanceTitle,
      videoUrl,
      teacherName: teacherName || undefined,
      institution: institution || undefined,
      city,
      email,
      phone,
      comment: comment || undefined,
      paymentAmount: (currentContest as any).feeAmount || 790,
    });
  };

  const resetAndClose = () => {
    setSubmissionResult(null);
    setParticipantName('');
    setCollectiveName('');
    setEmail('');
    setPhone('');
    setCity('');
    setInstitution('');
    setTeacherName('');
    setVideoUrl('');
    setNomination('');
    setPerformanceTitle('');
    setComment('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetAndClose()}>
      <DialogContent className="grid-cols-1 min-w-0 w-[calc(100vw-1.5rem)] max-w-2xl bg-white border-slate-200 text-slate-900 max-h-[90vh] overflow-x-hidden overflow-y-auto overscroll-contain p-5 sm:p-7 rounded-2xl shadow-xl">
        {!submissionResult ? (
          <>
            <DialogHeader className="min-w-0 pr-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Онлайн-заявка
                </span>
                <span className="text-xs text-slate-500">ARTCODE • ТО «Триумф»</span>
              </div>
              <DialogTitle className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                Подача заявки на участие
              </DialogTitle>
              <DialogDescription className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Заполните данные участника или коллектива и укажите ссылку на видеозапись выступления (Яндекс.Диск, Rutube, VK Видео, YouTube или Облако Mail.ru).
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="w-full min-w-0 space-y-4 mt-3">
              {/* Contest selector */}
              <div className="space-y-1.5">
                <Label htmlFor="contest-select" className="text-xs font-bold text-slate-700">
                  Выберите конкурс <span className="text-rose-500">*</span>
                </Label>
                <Select value={selectedContestSlug} onValueChange={setSelectedContestSlug}>
                  <SelectTrigger id="contest-select" className="w-full bg-slate-50 border-slate-300 text-slate-900 text-sm">
                    <SelectValue placeholder="Выберите конкурс" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 text-slate-900">
                    {contestList.map((item) => (
                      <SelectItem key={item.slug} value={item.slug}>
                        {item.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-xs text-blue-900 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                  <span>Организационный взнос: <strong>{(currentContest as any).feeAmount || 790} руб.</strong></span>
                  <span className="text-blue-700 font-medium">Оплата онлайн через PayKeeper / МИР</span>
                </div>
              </div>

              {/* Participant & Collective */}
              <div className="grid w-full min-w-0 grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="participant" className="text-xs font-bold text-slate-700">
                    ФИО участника <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="participant"
                    required
                    placeholder="Например: Иванов Иван"
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                    className="border-slate-300 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="collective" className="text-xs font-bold text-slate-700">
                    Название ансамбля / коллектива (если есть)
                  </Label>
                  <Input
                    id="collective"
                    placeholder="Например: Образцовый ансамбль «Заря»"
                    value={collectiveName}
                    onChange={(e) => setCollectiveName(e.target.value)}
                    className="border-slate-300 text-sm"
                  />
                </div>
              </div>

              {/* Nomination & Performance */}
              <div className="grid w-full min-w-0 grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="nomination" className="text-xs font-bold text-slate-700">
                    Номинация <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="nomination"
                    required
                    placeholder="Например: Эстрадный вокал, соло"
                    value={nomination}
                    onChange={(e) => setNomination(e.target.value)}
                    className="border-slate-300 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="performance" className="text-xs font-bold text-slate-700">
                    Название конкурсного номера <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="performance"
                    required
                    placeholder="Например: Романс «Утро туманное»"
                    value={performanceTitle}
                    onChange={(e) => setPerformanceTitle(e.target.value)}
                    className="border-slate-300 text-sm"
                  />
                </div>
              </div>

              {/* Age category & City */}
              <div className="grid w-full min-w-0 grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="age" className="text-xs font-bold text-slate-700">
                    Возрастная категория <span className="text-rose-500">*</span>
                  </Label>
                  <Select value={ageCategory} onValueChange={setAgeCategory}>
                    <SelectTrigger id="age" className="w-full bg-slate-50 border-slate-300 text-slate-900 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200 text-slate-900">
                      <SelectItem value="до 6 лет">Дошкольная (до 6 лет)</SelectItem>
                      <SelectItem value="7-9 лет">Младшая (7–9 лет)</SelectItem>
                      <SelectItem value="10-12 лет">Средняя (10–12 лет)</SelectItem>
                      <SelectItem value="13-15 лет">Старшая (13–15 лет)</SelectItem>
                      <SelectItem value="16-18 лет">Юношеская (16–18 лет)</SelectItem>
                      <SelectItem value="19-25 лет">Молодежная (19–25 лет)</SelectItem>
                      <SelectItem value="26+ лет">Взрослая (от 26 лет)</SelectItem>
                      <SelectItem value="Смешанная">Смешанная группа</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="city" className="text-xs font-bold text-slate-700">
                    Город / населенный пункт <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    required
                    placeholder="Например: Санкт-Петербург"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="border-slate-300 text-sm"
                  />
                </div>
              </div>

              {/* Media link */}
              <div className="space-y-1">
                <Label htmlFor="video" className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Ссылка на видеозапись выступления <span className="text-rose-500">*</span></span>
                  <span className="text-[11px] text-slate-500">Яндекс.Диск, Rutube, VK, Облако Mail</span>
                </Label>
                <Input
                  id="video"
                  type="url"
                  required
                  placeholder="https://disk.yandex.ru/... или https://rutube.ru/..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="border-slate-300 text-sm"
                />
              </div>

              {/* Teacher and Institution */}
              <div className="grid w-full min-w-0 grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="teacher" className="text-xs font-bold text-slate-700">
                    ФИО педагога / руководителя
                  </Label>
                  <Input
                    id="teacher"
                    placeholder="Для благодарственного письма"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    className="border-slate-300 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="institution" className="text-xs font-bold text-slate-700">
                    Направляющее учреждение (школа, ДШИ)
                  </Label>
                  <Input
                    id="institution"
                    placeholder="Например: ДШИ № 1 им. Глинки"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="border-slate-300 text-sm"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid w-full min-w-0 grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs font-bold text-slate-700">
                    Электронная почта для наградного пакета <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="artist@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-slate-300 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone" className="text-xs font-bold text-slate-700">
                    Контактный номер телефона <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    required
                    placeholder="+7 (999) 000-00-00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border-slate-300 text-sm"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md text-base"
                >
                  {submitMutation.isPending ? 'Регистрация заявки...' : 'Зарегистрировать заявку и перейти к оплате'}
                </Button>
                <div className="text-center text-[11px] text-slate-500 mt-2 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Данные защищены. Наградные документы отправляются на указанный e-mail.
                </div>
              </div>
            </form>
          </>
        ) : (
          /* Post-submission PayKeeper screen */
          <div className="py-6 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-slate-900">Заявка успешно принята!</h3>
              <p className="text-sm text-slate-600 mt-1">
                Номер заявки: <strong className="text-blue-900 font-mono">#{submissionResult.applicationId}</strong> (Счет {submissionResult.orderId})
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 text-sm text-slate-700">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Конкурс:</span>
                <span className="font-bold text-slate-900 text-right">{currentContest.title}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500">Сумма оргвзноса:</span>
                <span className="font-bold text-emerald-700 text-base">{submissionResult.paymentAmount} руб.</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Платежный шлюз:</span>
                <span className="font-semibold text-slate-900">PayKeeper (карты РФ и МИР)</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => {
                  invoiceMutation.mutate({
                    orderId: submissionResult.orderId,
                    amount: submissionResult.paymentAmount,
                    clientId: participantName,
                    clientEmail: email,
                    clientPhone: phone || undefined,
                    serviceName: `Оргвзнос: ${currentContest.title}`,
                  });
                }}
                disabled={invoiceMutation.isPending}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-3.5 rounded-xl shadow-md text-base flex items-center justify-center gap-2"
              >
                {invoiceMutation.isPending ? (
                  'Создание защищенного счета...'
                ) : (
                  <><CreditCard className="w-5 h-5" /> Оплатить взнос {submissionResult.paymentAmount} руб.</>
                )}
              </Button>

              <Button variant="outline" onClick={resetAndClose} className="w-full border-slate-300">
                Вернуться к сайту
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
