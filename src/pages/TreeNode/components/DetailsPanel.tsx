// File: src/pages/TreeNode/components/DetailsPanel.tsx
import { useTranslation } from 'react-i18next';
import { NodeDetails } from "../types";
import { Loader2, Info } from "lucide-react";

interface DetailsPanelProps {
  details: NodeDetails | null;
  loading: boolean;
  error: string | null;
}

export function DetailsPanel({ details, loading, error }: DetailsPanelProps) {
  const { t } = useTranslation('tree');

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-gray-200">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center">
          <div className="text-red-600 text-sm font-medium mb-2">{t('error')}</div>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-gray-200">
        <div className="text-center text-gray-500 text-sm">
          <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>{t('selectNodeHint')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-right h-full overflow-y-auto bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-800">{t('nodeDetails')}</h2>
        <p className="text-xs text-gray-500 mt-0.5">{t('viewInformation')}</p>
      </div>
      <div className="p-6">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-800 text-sm">
              {details.name}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('type')}</label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-800 text-sm">
                {details.type}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('owner')}</label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-800 text-sm">
                {details.owner}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('createdDate')}</label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-800 text-sm">
                {details.createdDate}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('size')}</label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-800 text-sm">
                {details.size}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('permissions')}</label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-800 text-sm">
              {details.permissions}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('description')}</label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-800 text-sm min-h-[80px] whitespace-pre-wrap">
              {details.description}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('nodeId')}</label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-600 text-xs font-mono">
              {details.id}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}