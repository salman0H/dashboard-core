// File: src/pages/TreeNode/components/TreeNodeRenderer.tsx
import { NodeRendererProps } from "react-arborist";
import { useTranslation } from "react-i18next";
import { TreeNode } from "../types";
import { getIconComponent } from "../utils/iconMapper";
import { useTree } from "./TreeContext";
import { useAppContext } from "@/context/AppContext";

interface ExtendedNodeRendererProps extends NodeRendererProps<TreeNode> {
  onContextMenu?: (nodeId: string, event: React.MouseEvent) => void;
}

// Helper to get icon color based on node type and hierarchy position (unchanged)
function getIconColor(node: TreeNode, isFolder: boolean, hasParent: boolean): string {
  const nameColorMap: Record<string, string> = {
    "اسناد مالی": "text-emerald-500 dark:text-emerald-400",
    "مستندات متنی": "text-amber-500 dark:text-amber-400",
    "ویدیوهای آموزشی": "text-rose-500 dark:text-rose-400",
    "پایگاه داده": "text-purple-500 dark:text-purple-400",
    "پشتیبان‌گیری": "text-orange-500 dark:text-orange-400",
    "سورس کد اصلی": "text-indigo-500 dark:text-indigo-400",
    "تنظیمات زیرساخت": "text-slate-500 dark:text-slate-400",
    "بایگانی قدیمی": "text-gray-500 dark:text-gray-400",
  };
  if (nameColorMap[node.name]) return nameColorMap[node.name];
  if (!isFolder) return "text-gray-500 dark:text-gray-400";
  if (!hasParent) return "text-blue-500 dark:text-blue-400";
  return "text-yellow-600 dark:text-yellow-500";
}

// Original RTL ASCII prefix (exactly as in user's code)
function getRtlAsciiPrefix(nodeId: string, parentMap: Map<string, TreeNode>, isLastChildMap: Map<string, boolean>): string {
  const parts: string[] = [];
  let currentId: string | undefined = nodeId;
  while (currentId) {
    const parent = parentMap.get(currentId);
    if (parent) {
      const isParentLast = isLastChildMap.get(parent.id) ?? false;
      parts.unshift(isParentLast ? "" : `│${' '.repeat(8)}`);
    }
    currentId = parent?.id;
  }
  const isLast = isLastChildMap.get(nodeId) ?? false;
  const connector = isLast ? "┘──" : "┤──";
  parts.push(connector);
  return parts.join("");
}

// LTR ASCII prefix using standard tree characters
function getLtrAsciiPrefix(nodeId: string, parentMap: Map<string, TreeNode>, isLastChildMap: Map<string, boolean>): string {
  const parts: string[] = [];
  let currentId: string | undefined = nodeId;
  while (currentId) {
    const parent = parentMap.get(currentId);
    if (parent) {
      const isParentLast = isLastChildMap.get(parent.id) ?? false;
      parts.unshift(isParentLast ? "" : `│${' '.repeat(9)}`);
    }
    currentId = parent?.id;
  }
  const isLast = isLastChildMap.get(nodeId) ?? false;
  const connector = isLast ? "└── " : "├── ";
  parts.push(connector);
  return parts.join("");
}

export function TreeNodeRenderer({
  node,
  style,
  dragHandle,
  onContextMenu,
}: ExtendedNodeRendererProps) {
  const { t } = useTranslation('tree');
  const { dir } = useAppContext();
  const isRtl = dir === 'rtl';
  const Icon = getIconComponent(node.data.icon || 'file');
  const isFolder = node.isInternal;
  const { parentMap, isLastChildMap } = useTree();
  const hasParent = parentMap.has(node.data.id);
  const iconColor = getIconColor(node.data, isFolder, hasParent);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onContextMenu) onContextMenu(node.data.id, e);
  };

  // RTL mode – use original user code structure (flex-row-reverse, RTL prefix)
  if (isRtl) {
    const asciiPrefix = getRtlAsciiPrefix(node.data.id, parentMap, isLastChildMap);
    return (
      <div
        style={style}
        ref={dragHandle}
        onContextMenu={handleContextMenu}
        className={`group flex flex-row-reverse items-center gap-1 transition-all duration-150 cursor-pointer pr-2 ${
          node.isSelected
            ? "bg-blue-50"
            : "hover:bg-gray-100"
        }`}
        onClick={() => isFolder && node.toggle()}
      >
        <span dir="rtl" className="font-sans text-xs text-gray-600 dark:text-gray-500 whitespace-pre">
          {asciiPrefix}
        </span>
        <div className="flex-shrink-0">
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <span className="flex-1 text-right text-sm font-medium truncate text-black">
          {node.data.name}
        </span>
      </div>
    );
  }

  // LTR mode – standard left-to-right tree with standard lines
  const asciiPrefix = getLtrAsciiPrefix(node.data.id, parentMap, isLastChildMap);
  return (
    <div
      style={{ ...style, paddingLeft: 0 }}
      ref={dragHandle}
      onContextMenu={handleContextMenu}
      className={`group flex items-center gap-1 transition-all duration-150 cursor-pointer ${
        node.isSelected
          ? "bg-blue-50"
          : "hover:bg-gray-100"
      }`}
      onClick={() => isFolder && node.toggle()}
    >
      <span className="font-mono text-xs text-gray-500 whitespace-pre">
        {asciiPrefix}
      </span>
      <div className="flex-shrink-0">
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      <span className="flex-1 text-left text-sm font-medium truncate text-black">
        {node.data.name}
      </span>
    </div>
  );
}