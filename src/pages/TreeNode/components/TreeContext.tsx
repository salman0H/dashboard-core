import { createContext, useContext } from "react";
import { TreeNode } from "../types";

interface TreeContextValue {
  parentMap: Map<string, TreeNode>;
  isLastChildMap: Map<string, boolean>;
}

const TreeContext = createContext<TreeContextValue | null>(null);

export function TreeProvider({ children, treeData }: { children: React.ReactNode; treeData: TreeNode[] }) {
  const parentMap = new Map<string, TreeNode>();
  const isLastChildMap = new Map<string, boolean>();

  const buildMaps = (nodes: TreeNode[], parent?: TreeNode) => {
    nodes.forEach((node, index) => {
      if (parent) parentMap.set(node.id, parent);
      const isLast = index === nodes.length - 1;
      isLastChildMap.set(node.id, isLast);
      if (node.children) buildMaps(node.children, node);
    });
  };
  buildMaps(treeData);

  return (
    <TreeContext.Provider value={{ parentMap, isLastChildMap }}>
      {children}
    </TreeContext.Provider>
  );
}

export function useTree() {
  const ctx = useContext(TreeContext);
  if (!ctx) throw new Error("useTree must be used within TreeProvider");
  return ctx;
}