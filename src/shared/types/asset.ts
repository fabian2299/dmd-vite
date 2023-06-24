import { type Characteristic } from './characteristic'
import { type Template } from './template'

export interface Asset {
    id: number
    name: string
    description: string
    shortDescription: string
    isEnabled: boolean
    validityDate: null
    creationDate: string
    modifiedDate: string
    coordinateX: null
    coordinateY: null
    geometry: AssetGeometry | null
    geoDbId: null
    isDeleted: boolean
    isExternal: null
    files: null
    template: Template
    values: Value[]
    audits: Audit[]
    externalObjects: ExternalObject[]
    origin: Origin | null
    mainHierarchyParent: number | null
    bimFileUrl: null
}

interface Audit {
    id: number
    userModifier: string
    auditType: string
    field: string
    oldValue: null
    newValue: string
    modifiedDate: string
}

interface ExternalObject {
    id: number
    consumerApplication: Origin
    externalId: string
}

interface Origin {
    id: number
    name: string
    type: string
    metadata: string
}

interface AssetGeometry {
    type: string
    properties: null
    geometry: GeometryGeometry
}

interface GeometryGeometry {
    type: string
    coordinates: number[]
}

interface Value {
    id: number
    name: string
    stringValue: null | string
    integerValue: null
    doubleValue: number | null
    geometryValue: null
    dateValue: null | string
    booleanValue: null
    characteristic: Characteristic
    asset: null
    iotSignals: any[]
    iotSynoptics: any[]
}

// Types related to the the assets in the table
export interface AssetTableView {
    id: number
    name: string
    shortDescription: string
    templateId: number
    isDeleted: boolean
    bimFileUrl: null
}

export interface AssetTableViewFilters {
    entity: string
    filterOperation: string
    filterValue: unknown
    filterValueType: string
    property: string
}

export interface AssetPagination {
    page: number
    pageSize: number
}

export interface AssetWithTemplate {
    templateName: string | undefined
    id: number
    name: string
    shortDescription: string
    templateId: number
    isDeleted: boolean
    bimFileUrl: null
}

export type AssetDTO = Partial<Asset>
