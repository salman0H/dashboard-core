// File: src/pages/TreeNode/components/ContextMenu.tsx
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FolderPlus, Copy, ListTree } from "lucide-react";

interface ContextMenuProps {
  x: number;
  y: number;
  nodeId: string;
  nodeName: string;
  hasChildren: boolean;
  onClose: () => void;
  onAddChild: (nodeId: string) => void;
  onShowChildren: (nodeId: string, nodeName: string) => void;
  onCopy: (nodeId: string) => void;
}

export function ContextMenu({
  x,
  y,
  nodeId,
  nodeName,
  hasChildren,
  onClose,
  onAddChild,
  onShowChildren,
  onCopy,
}: ContextMenuProps) {
  const { t } = useTranslation('tree');
  const menuRef = useRef<HTMLDivElement>(null);
  const [finalLeft, setFinalLeft] = useState(x);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (menuRef.current) {
      const menuWidth = menuRef.current.offsetWidth;
      let leftPos = x - menuWidth;
      if (leftPos < 0) leftPos = 0;
      if (leftPos + menuWidth > window.innerWidth) {
        leftPos = window.innerWidth - menuWidth;
      }
      setFinalLeft(leftPos);
    }
  }, [x]);

  const menuStyle = {
    position: "fixed" as const,
    top: y,
    left: finalLeft,
    zIndex: 1000,
  };

  return (
    <div
      ref={menuRef}
      style={menuStyle}
      className="min-w-[200px] bg-white rounded-xl shadow-2xl border border-gray-200 py-2"
    >
      <button
        onClick={() => {
          onAddChild(nodeId);
          onClose();
        }}
        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <FolderPlus className="w-4 h-4" />
        <span className="flex-1 text-right">{t('addSubfolder')}</span>
      </button>

      {hasChildren && (
        <button
          onClick={() => {
            onShowChildren(nodeId, nodeName);
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <ListTree className="w-4 h-4" />
          <span className="flex-1 text-right">{t('showChildren')}</span>
        </button>
      )}

      <div className="my-1 border-t border-gray-100" />

      <button
        onClick={() => {
          onCopy(nodeId);
          onClose();
        }}
        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <Copy className="w-4 h-4" />
        <span className="flex-1 text-right">{t('copyInfo')}</span>
      </button>
    </div>
  );
}