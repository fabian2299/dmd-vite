export interface UserTable {
  id: number
  email: null | string
  username: string
  name: null | string
  surname: null | string
  isEnabled: boolean
}

export interface User {
  id: number
  email: string
  username: string
  name: string
  surname: string
  isEnabled: boolean
  keycloakUid: string
  creationDate: Date
  groups: Group[]
  userGroup: Group
}

export interface Group {
  id: number
  name: string
  type: string
  permissions?: Permission[]
}

export interface Permission {
  id: number
  permissionType: PermissionType
  objectType: ObjectType
  objectId: number
}

export enum ObjectType {
  Hierarchy = "HIERARCHY",
  Template = "TEMPLATE",
}

export enum PermissionType {
  Read = "READ",
  Write = "WRITE",
}
