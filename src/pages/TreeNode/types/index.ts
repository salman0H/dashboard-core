export interface TreeNode {
  id: string;
  name: string;
  icon?: string;
  children?: TreeNode[];
}

export interface NodeDetails {
  id: string;
  name: string;
  description: string;
  type: string;
  createdDate: string;
  owner: string;
  size: string;
  permissions: string;
}