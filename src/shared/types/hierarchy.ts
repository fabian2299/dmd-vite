export interface Hierarchy {
  id: number
  name: string
  isMain: boolean
}

export interface HierarchyItems {
  id: number
  name: string
  hierarchy: number
  parent: number | null
  asset: number | null
  type: Type
  externalCode: null
  assetDeleted: boolean
}

export enum Type {
  Asset = "Asset",
  Group = "Group",
  TypeGroup = "group",
}
