import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Globe2, Video } from 'lucide-react';

interface ParticipationInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'video' | 'hosting';
  videoRequirements: string[];
  hostingPlaces: string[];
}

export const ParticipationInfoModal: React.FC<ParticipationInfoModalProps> = ({
  isOpen,
  onClose,
  type,
  videoRequirements,
  hostingPlaces,
}) => {
  const isVideo = type === 'video';
  const title = isVideo ? 'Съёмка и качество видео' : 'Размещение и ссылки';
  const description = isVideo
    ? 'Требования к видеозаписи конкурсного номера для объективной экспертной оценки.'
    : 'Как правильно разместить видеозапись и передать ссылку оргкомитету.';
  const items = isVideo ? videoRequirements : hostingPlaces;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="light-artcode-modal grid-cols-1 min-w-0 w-[calc(100vw-1rem)] sm:w-[calc(100vw-2rem)] max-w-xl bg-white border-slate-200 text-blue-950 max-h-[min(88vh,720px)] overflow-x-hidden overflow-y-auto overscroll-contain p-0 rounded-3xl shadow-2xl">
        <div className="px-5 py-6 sm:px-7 sm:py-7">
          <DialogHeader className="text-left pr-6">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${isVideo ? 'bg-blue-600/15 border border-blue-200 text-blue-800' : 'bg-amber-500/15 border border-amber-200 text-amber-700'}`}>
              {isVideo ? <Video className="w-5 h-5" /> : <Globe2 className="w-5 h-5" />}
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-extrabold text-blue-950 font-serif">
              {title}
            </DialogTitle>
            <DialogDescription className="text-slate-600 text-sm leading-relaxed">
              {description}
            </DialogDescription>
          </DialogHeader>

          <ul className="mt-5 space-y-3 text-sm text-slate-700 leading-relaxed">
            {items.map((item, index) => (
              <li key={index} className="flex items-start gap-2.5">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2 ${isVideo ? 'bg-blue-500' : 'bg-amber-500'}`} />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {!isVideo && (
            <div className="mt-5 p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 text-xs sm:text-sm text-blue-950 leading-relaxed">
              <strong>Публикация результатов:</strong> на 15-й день после окончания приёма заявок имена обладателей Гран-при и протоколы публикуются на официальном сайте <strong>my-artcode.ru</strong> и в сообществе <strong>vk.com/triumph_org</strong>.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
