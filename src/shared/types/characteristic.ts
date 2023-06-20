export interface Characteristic {
  id: number
  type: Type
  tenantId?: number | null
  description: string
  shortDescription: string
  origin?: null | string
  code?: null | string
  editable?: boolean | null
  isRefCharacteristic?: boolean | null
  isDeleted: boolean
  isDeleteable: boolean
  isModifiable: boolean
  name: string
  options?: string[] | null
  refCharacteristic?: null
  classImplementations: ClassImplementation[]
  measureUnit?: MeasureUnit | null
}

export interface ClassImplementation {
  id: number
  tenandId: number | null
  description: string
  shortDescription: string
  active: boolean | null
  origen: null | string
  name: string
  isMainClass: boolean | null
  isDeleted: boolean | null
  code: null | string
  isDeleteable: boolean | null
  isModifiable: boolean | null
  characteristics: null
  template: Template[]
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
  LineString = "LineString",
  MultiLineString = "MultiLineString",
  MultiPolygon = "MultiPolygon",
  Point = "Point",
  Polygon = "Polygon",
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
  name: Name
}

export enum Name {
  Distancia = "Distancia",
  Si = "SI",
}

export enum Type {
  Boolean = "boolean",
  Date = "date",
  Double = "double",
  Integer = "integer",
  Iotsignal = "iotsignal",
  Iotsynoptic = "iotsynoptic",
  Multioption = "multioption",
  String = "string",
}
