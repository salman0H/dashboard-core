import { useTranslation } from 'react-i18next';

interface SelectChildTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: 'start' | 'process' | 'input' | 'decision') => void;
}

export const SelectChildTypeModal = ({ isOpen, onClose, onSelectType }: SelectChildTypeModalProps) => {
  const { t } = useTranslation('flow');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-4 text-center">{t('selectChildType')}</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onSelectType('start')}
            className="text-right p-3 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all"
          >
            <div className="font-semibold">{t('startEnd')}</div>
            <div className="text-xs text-gray-500">{t('startEndDesc')}</div>
          </button>
          <button
            onClick={() => onSelectType('process')}
            className="text-right p-3 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all"
          >
            <div className="font-semibold">{t('process')}</div>
            <div className="text-xs text-gray-500">{t('processDesc')}</div>
          </button>
          <button
            onClick={() => onSelectType('input')}
            className="text-right p-3 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all"
          >
            <div className="font-semibold">{t('inputOutput')}</div>
            <div className="text-xs text-gray-500">{t('inputOutputDesc')}</div>
          </button>
          <button
            onClick={() => onSelectType('decision')}
            className="text-right p-3 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all"
          >
            <div className="font-semibold">{t('decision')}</div>
            <div className="text-xs text-gray-500">{t('decisionDesc')}</div>
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-5 w-full py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-medium transition-colors"
        >
          {t('cancel')}
        </button>
      </div>
    </div>
  );
};