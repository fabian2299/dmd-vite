export interface GroupTable {
    id: number
    name: string
    type: string
}

export interface Group {
    id: number
    name: string
    type: string
    permissions: Permission[]
}

export interface Permission {
    id: number
    permissionType: PermissionType
    objectType: ObjectType
    objectId: number
}

export enum ObjectType {
    Hierarchy = 'HIERARCHY',
    Template = 'TEMPLATE',
}

export enum PermissionType {
    Read = 'READ',
    Write = 'WRITE',
}
