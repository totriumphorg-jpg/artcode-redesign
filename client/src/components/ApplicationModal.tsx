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
      <DialogContent className="light-artcode-modal grid-cols-1 min-w-0 w-[calc(100vw-1.5rem)] max-w-2xl bg-white border-slate-200 text-slate-900 max-h-[90vh] overflow-x-hidden overflow-y-auto overscroll-contain p-5 sm:p-7 rounded-3xl shadow-2xl">
        {!submissionResult ? (
          <>
            <DialogHeader className="min-w-0 pr-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 text-xs rounded-full bg-amber-500/15 text-amber-700 border border-amber-200 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-700" /> Онлайн-заявка
                </span>
                <span className="text-xs text-slate-600">ARTCODE • ТО «Триумф»</span>
              </div>
              <DialogTitle className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight font-serif">
                Подача заявки на участие
              </DialogTitle>
              <DialogDescription className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                Заполните данные участника или коллектива и укажите ссылку на видеозапись выступления (Яндекс.Диск, Rutube, VK Видео, YouTube или Облако Mail.ru).
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="w-full min-w-0 space-y-4 mt-3">
              {/* Contest selector */}
              <div className="space-y-1.5">
                <Label htmlFor="contest-select" className="text-xs font-bold text-slate-700">
                  Выберите конкурс <span className="text-amber-700">*</span>
                </Label>
                <Select value={selectedContestSlug} onValueChange={setSelectedContestSlug}>
                  <SelectTrigger id="contest-select" className="w-full bg-white border-slate-200 text-slate-900 text-sm">
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

                <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
                  <span>Организационный взнос: <strong className="text-slate-900 font-bold">{(currentContest as any).feeAmount || 790} руб.</strong></span>
                  <span className="text-amber-700 font-medium">Оплата онлайн через PayKeeper / МИР</span>
                </div>
              </div>

              {/* Participant & Collective */}
              <div className="grid w-full min-w-0 grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="participant" className="text-xs font-bold text-slate-700">
                    ФИО солиста или название дуэта <span className="text-amber-700">*</span>
                  </Label>
                  <Input
                    id="participant"
                    required
                    placeholder="Например: Иванова Анна"
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                    className="bg-white border-slate-200 text-slate-900 placeholder-slate-500 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="collective" className="text-xs font-bold text-slate-700">
                    Название ансамбля / коллектива
                  </Label>
                  <Input
                    id="collective"
                    placeholder="Если участвует группа / хор"
                    value={collectiveName}
                    onChange={(e) => setCollectiveName(e.target.value)}
                    className="bg-white border-slate-200 text-slate-900 placeholder-slate-500 text-sm"
                  />
                </div>
              </div>

              {/* Nomination & Performance title */}
              <div className="grid w-full min-w-0 grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="nomination" className="text-xs font-bold text-slate-700">
                    Номинация <span className="text-amber-700">*</span>
                  </Label>
                  <Input
                    id="nomination"
                    required
                    placeholder="Например: Академический вокал, соло"
                    value={nomination}
                    onChange={(e) => setNomination(e.target.value)}
                    className="bg-white border-slate-200 text-slate-900 placeholder-slate-500 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="performance" className="text-xs font-bold text-slate-700">
                    Название конкурсного номера <span className="text-amber-700">*</span>
                  </Label>
                  <Input
                    id="performance"
                    required
                    placeholder="Например: Романс «Соловей»"
                    value={performanceTitle}
                    onChange={(e) => setPerformanceTitle(e.target.value)}
                    className="bg-white border-slate-200 text-slate-900 placeholder-slate-500 text-sm"
                  />
                </div>
              </div>

              {/* Age category & City */}
              <div className="grid w-full min-w-0 grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="ageCategory" className="text-xs font-bold text-slate-700">
                    Возрастная категория <span className="text-amber-700">*</span>
                  </Label>
                  <Select value={ageCategory} onValueChange={setAgeCategory}>
                    <SelectTrigger id="ageCategory" className="w-full bg-white border-slate-200 text-slate-900 text-sm">
                      <SelectValue placeholder="Выберите возраст" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200 text-slate-900">
                      <SelectItem value="до 6 лет">До 6 лет (дошкольная)</SelectItem>
                      <SelectItem value="7-9 лет">7-9 лет (младшая I)</SelectItem>
                      <SelectItem value="10-12 лет">10-12 лет (младшая II)</SelectItem>
                      <SelectItem value="13-15 лет">13-15 лет (средняя)</SelectItem>
                      <SelectItem value="16-18 лет">16-18 лет (старшая)</SelectItem>
                      <SelectItem value="19-25 лет">19-25 лет (молодежная)</SelectItem>
                      <SelectItem value="старше 25 лет">Старше 25 лет (взрослая)</SelectItem>
                      <SelectItem value="смешанная">Смешанная группа</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="city" className="text-xs font-bold text-slate-700">
                    Город / Населенный пункт <span className="text-amber-700">*</span>
                  </Label>
                  <Input
                    id="city"
                    required
                    placeholder="Например: Санкт-Петербург"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="bg-white border-slate-200 text-slate-900 placeholder-slate-500 text-sm"
                  />
                </div>
              </div>

              {/* Video URL */}
              <div className="space-y-1">
                <Label htmlFor="videoUrl" className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Ссылка на видеозапись выступления <span className="text-amber-700">*</span></span>
                  <span className="text-[11px] text-slate-600 font-normal">Яндекс.Диск, Rutube, VK, Mail.ru</span>
                </Label>
                <div className="relative">
                  <Input
                    id="videoUrl"
                    type="url"
                    required
                    placeholder="https://disk.yandex.ru/... или https://rutube.ru/..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="bg-white border-slate-200 text-slate-900 placeholder-slate-500 text-sm pl-9"
                  />
                  <UploadCloud className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Teacher & Institution */}
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
                    className="bg-white border-slate-200 text-slate-900 placeholder-slate-500 text-sm"
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
                    className="bg-white border-slate-200 text-slate-900 placeholder-slate-500 text-sm"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid w-full min-w-0 grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs font-bold text-slate-700">
                    Электронная почта для наградного пакета <span className="text-amber-700">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="artist@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white border-slate-200 text-slate-900 placeholder-slate-500 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone" className="text-xs font-bold text-slate-700">
                    Контактный номер телефона <span className="text-amber-700">*</span>
                  </Label>
                  <Input
                    id="phone"
                    required
                    placeholder="+7 (999) 000-00-00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-white border-slate-200 text-slate-900 placeholder-slate-500 text-sm"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="button-motion w-full bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-slate-950 font-bold py-3.5 rounded-xl shadow-lg shadow-amber-500/25 text-base"
                >
                  {submitMutation.isPending ? 'Регистрация заявки...' : 'Зарегистрировать заявку и перейти к оплате'}
                </Button>
                <div className="text-center text-[11px] text-slate-600 mt-2.5 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Данные защищены. Наградные документы отправляются на указанный e-mail.
                </div>
              </div>
            </form>
          </>
        ) : (
          /* Post-submission PayKeeper screen */
          <div className="py-6 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-900 font-serif">Заявка успешно зарегистрирована!</h3>
              <p className="text-sm text-slate-700 mt-1">
                Номер заявки в реестре: <span className="font-mono font-bold text-amber-700">{submissionResult.orderId}</span>
              </p>
            </div>

            <div className="p-5 glass-panel rounded-2xl border border-slate-200 text-left text-xs text-slate-700 space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span>Конкурс:</span>
                <span className="font-bold text-slate-900">{currentContest?.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Участник:</span>
                <span className="font-bold text-slate-900">{participantName || collectiveName}</span>
              </div>
              <div className="flex justify-between">
                <span>Сумма взноса:</span>
                <span className="font-bold text-amber-700 text-sm">{submissionResult.paymentAmount} руб.</span>
              </div>
            </div>

            <div className="space-y-3 pt-2 max-w-md mx-auto">
              <Button
                onClick={() => {
                  invoiceMutation.mutate({
                    orderId: submissionResult.orderId,
                    amount: submissionResult.paymentAmount,
                    serviceName: `Организационный взнос: ${currentContest?.title}`,
                    clientEmail: email,
                    clientPhone: phone,
                    clientId: participantName || collectiveName || 'Участник',
                  });
                }}
                disabled={invoiceMutation.isPending}
                className="button-motion w-full bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-slate-950 font-bold py-3.5 rounded-xl shadow-lg shadow-amber-500/25 text-base flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                {invoiceMutation.isPending ? 'Перенаправление в банк...' : 'Оплатить взнос онлайн (PayKeeper)'}
              </Button>

              <Button
                variant="outline"
                onClick={resetAndClose}
                className="w-full border-slate-300 hover:bg-slate-50 text-slate-700"
              >
                Вернуться к конкурсам
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
