export interface Class {
    id: number
    tenandId: number | null
    description: string
    shortDescription: string
    active: boolean | null
    origen: null | string
    name: string
    isMainClass: boolean | null
    isDeleted: boolean
    code: null | string
    isDeleteable: boolean
    isModifiable: boolean
    characteristics: Characteristic[] | CharacteristicID[]
    template: Template[]
}

type CharacteristicID = Pick<Characteristic, 'id'>
export interface Characteristic {
    id: number
    type: Type
    tenantId: number | null
    description: string
    shortDescription: string
    origin: null | string
    code: null | string
    editable: boolean | null
    isRefCharacteristic: boolean | null
    isDeleted: boolean
    isDeleteable: boolean
    isModifiable: boolean
    name: string
    options: string[] | null
    refCharacteristic: null
    classImplementations: null
    measureUnit: MeasureUnit | null
}

export interface MeasureUnit {
    id: number
    unit: string
    magnitude: Magnitude
    translationFactor: number
    defaultMeasureUnit: MeasureUnit | null
    measureSystem: Magnitude
}

export interface Magnitude {
    id: number
    name: string
}

export enum Type {
    Boolean = 'boolean',
    Date = 'date',
    Double = 'double',
    Integer = 'integer',
    Iotsignal = 'iotsignal',
    Iotsynoptic = 'iotsynoptic',
    Multioption = 'multioption',
    String = 'string',
}

export interface Template {
    id: number
    tenandId: number | null
    description: string
    shortDescription: string
    geometryType: GeometryType | null
    active: boolean | null
    origen: null | string
    externalCode: null | string
    name: string
    layerName: null | string
    code: null | string
    isDeleted: boolean | null
    isDeleteable: boolean | null
    isModifiable: boolean | null
    portalLayerId: number | null
    classImplementations: null
    mainClassImplementation: null
}

export enum GeometryType {
    LineString = 'LineString',
    MultiLineString = 'MultiLineString',
    MultiPolygon = 'MultiPolygon',
    Point = 'Point',
    Polygon = 'Polygon',
}
