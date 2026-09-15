import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { COMPETITIONS_DATA } from '@/const';
import { CheckCircle2, Send, ShieldCheck, Sparkles, UploadCloud } from 'lucide-react';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCompetitionId?: string;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  defaultCompetitionId = 'misteriya-vokala',
}) => {
  const [selectedComp, setSelectedComp] = useState<string>(defaultCompetitionId);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [institution, setInstitution] = useState('');
  const [mediaLink, setMediaLink] = useState('');
  const [nomination, setNomination] = useState('');
  const [ageCategory, setAgeCategory] = useState('7-9');
  const [submitted, setSubmitted] = useState(false);

  const comp = COMPETITIONS_DATA.find((c) => c.id === selectedComp) || COMPETITIONS_DATA[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const resetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetAndClose()}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:!max-w-2xl bg-[#0f172a] border-slate-800 text-slate-100 max-h-[90vh] overflow-y-auto">
        {!submitted ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 text-xs rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Онлайн-заявка</span>
                <span className="text-xs text-slate-400">CA Triumph • ARTCODE</span>
              </div>
              <DialogTitle className="text-2xl font-serif text-white">Заявка на участие в конкурсе</DialogTitle>
              <DialogDescription className="text-slate-300 text-sm">Заполните данные участника или коллектива и прикрепите ссылку на конкурсный материал: Ютуб, Рутуб, ВК Видео или облачное хранилище.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label htmlFor="comp-select" className="text-xs text-slate-300">Выберите конкурс <span className="text-amber-400">*</span></Label>
                <Select value={selectedComp} onValueChange={setSelectedComp}>
                  <SelectTrigger id="comp-select" className="bg-[#020617] border-slate-700 text-white"><SelectValue placeholder="Выберите конкурс" /></SelectTrigger>
                  <SelectContent className="bg-[#0f172a] border-slate-700 text-white">{COMPETITIONS_DATA.map((item) => <SelectItem key={item.id} value={item.id}>{item.title} ({item.disciplineLabel})</SelectItem>)}</SelectContent>
                </Select>
                <div className="p-2.5 bg-[#020617] rounded-lg border border-slate-800 text-xs text-slate-300 flex items-center justify-between"><span>Оплата: <strong className="text-amber-400 font-medium">карты российских банков и МИР</strong></span><span className="text-slate-400">{comp.resultsDate}</span></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label htmlFor="fullname" className="text-xs text-slate-300">ФИО участника или название коллектива <span className="text-amber-400">*</span></Label><Input id="fullname" required placeholder="Например: Рыбченков Тимофей" value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-[#020617] border-slate-700 text-white text-sm" /></div>
                <div className="space-y-1.5"><Label htmlFor="city" className="text-xs text-slate-300">Город / страна <span className="text-amber-400">*</span></Label><Input id="city" required placeholder="Например: Санкт-Петербург, Россия" value={city} onChange={(e) => setCity(e.target.value)} className="bg-[#020617] border-slate-700 text-white text-sm" /></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label htmlFor="email" className="text-xs text-slate-300">Электронная почта для наградного пакета <span className="text-amber-400">*</span></Label><Input id="email" type="email" required placeholder="artist@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-[#020617] border-slate-700 text-white text-sm" /></div>
                <div className="space-y-1.5"><Label htmlFor="phone" className="text-xs text-slate-300">Телефон / контакт <span className="text-amber-400">*</span></Label><Input id="phone" required placeholder="+7 (999) 000-00-00" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-[#020617] border-slate-700 text-white text-sm" /></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label htmlFor="age-cat" className="text-xs text-slate-300">Возрастная категория</Label><Select value={ageCategory} onValueChange={setAgeCategory}><SelectTrigger id="age-cat" className="bg-[#020617] border-slate-700 text-white"><SelectValue placeholder="Категория" /></SelectTrigger><SelectContent className="bg-[#0f172a] border-slate-700 text-white"><SelectItem value="under-6">До 6 лет</SelectItem><SelectItem value="7-9">7 – 9 лет</SelectItem><SelectItem value="10-12">10 – 12 лет</SelectItem><SelectItem value="13-15">13 – 15 лет</SelectItem><SelectItem value="16-18">16 – 18 лет</SelectItem><SelectItem value="19-25">19 – 25 лет</SelectItem><SelectItem value="25-plus">Старше 25 лет</SelectItem><SelectItem value="mixed">Смешанная категория</SelectItem></SelectContent></Select></div>
                <div className="space-y-1.5"><Label htmlFor="nomination" className="text-xs text-slate-300">Номинация / произведение <span className="text-amber-400">*</span></Label><Input id="nomination" required placeholder="Например: Народный вокал / Романс" value={nomination} onChange={(e) => setNomination(e.target.value)} className="bg-[#020617] border-slate-700 text-white text-sm" /></div>
              </div>

              <div className="space-y-1.5"><Label htmlFor="institution" className="text-xs text-slate-300">Учебное заведение / ФИО руководителя или педагога</Label><Input id="institution" placeholder="Например: ДМШ №1, рук. Иванова М.П." value={institution} onChange={(e) => setInstitution(e.target.value)} className="bg-[#020617] border-slate-700 text-white text-sm" /></div>

              <div className="space-y-1.5"><Label htmlFor="media" className="text-xs text-slate-300 flex items-center justify-between"><span>Ссылка на видеозапись или материалы <span className="text-amber-400">*</span></span><span className="text-[11px] text-slate-400">Ютуб, Рутуб, ВК или Яндекс.Диск</span></Label><div className="relative"><UploadCloud className="absolute left-3 top-3 w-4 h-4 text-slate-400" /><Input id="media" required placeholder="https://..." value={mediaLink} onChange={(e) => setMediaLink(e.target.value)} className="pl-9 bg-[#020617] border-slate-700 text-white text-sm" /></div><p className="text-[11px] text-slate-400">Съемка живого выступления на статичную камеру, качество не менее 720р, запись не старше 2 лет.</p></div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-slate-800"><div className="flex items-center gap-2 text-xs text-slate-400"><ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" /><span>Политика безопасности и ФЗ-152</span></div><Button type="submit" className="button-motion w-full sm:w-auto bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-semibold px-6 shadow-lg shadow-amber-500/20"><Send className="w-4 h-4 mr-2" />Отправить заявку</Button></div>
            </form>
          </>
        ) : (
          <div className="py-10 text-center space-y-4"><div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30"><CheckCircle2 className="w-10 h-10" /></div><h3 className="text-2xl font-serif text-white">Заявка успешно принята!</h3><p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">Спасибо, <strong>{fullName}</strong>! Подтверждение отправлено на <span className="text-amber-300">{email}</span>.</p><div className="p-4 bg-[#020617] rounded-xl border border-slate-800 text-left max-w-md mx-auto text-xs space-y-2 text-slate-300"><div className="flex justify-between pb-1 border-b border-slate-800"><span className="text-slate-400">Конкурс:</span><span className="font-medium text-white">{comp.title}</span></div><div className="flex justify-between pb-1 border-b border-slate-800"><span className="text-slate-400">Номинация:</span><span className="font-medium text-white">{nomination}</span></div><div className="flex justify-between"><span className="text-slate-400">Итоги:</span><span className="font-medium text-amber-300">Через 14 дней после окончания приёма</span></div></div><p className="text-xs text-slate-400">По вопросам оплаты картами банков стран СНГ пишите на hello@my-artcode.com</p><Button onClick={resetAndClose} className="button-motion bg-slate-800 hover:bg-slate-700 text-white font-medium px-6 text-sm">Закрыть окно</Button></div>
        )}
      </DialogContent>
    </Dialog>
  );
};
