import {
    NullableBoolean,
    NullableNumber,
    NullableString,
    NullableStringArray,
} from '@/types/types'
import { z } from 'zod'

const Type = z.enum([
    'boolean',
    'string',
    'double',
    'integer',
    'date',
    'multioption',
    'iotsignal',
    'iotsynoptic',
])

const Characteristic = z.object({
    id: z.number(),
    type: Type,
    tenantId: NullableNumber,
    description: z.string(),
    shortDescription: z.string(),
    origin: NullableString,
    code: NullableString,
    editable: NullableBoolean,
    isRefCharacteristic: NullableBoolean,
    isDeleted: z.boolean(),
    isDeleteable: z.boolean(),
    isModifiable: z.boolean(),
    name: z.string(),
    options: NullableStringArray,
    refCharacteristic: z.null(),
    classImplementations: z.null(),
})

const ClassImplementation = z.object({
    id: z.number(),
    tenandId: NullableNumber,
    description: z.string(),
    shortDescription: z.string(),
    active: NullableBoolean,
    origen: NullableString,
    name: z.string(),
    isMainClass: NullableBoolean,
    isDeleted: NullableBoolean,
    code: NullableString,
    isDeleteable: NullableBoolean,
    isModifiable: NullableBoolean,
    characteristics: z.array(Characteristic),
    template: z.null(),
})

export const GeometryType = z.enum([
    'LineString',
    'MultiLineString',
    'MultiPolygon',
    'Point',
    'Polygon',
])

export const TemplateSchema = z.object({
    id: z.number(),
    tenandId: NullableNumber,
    description: z.string(),
    shortDescription: z.string(),
    geometryType: z.union([GeometryType, z.null()]),
    active: NullableBoolean,
    origen: NullableString,
    externalCode: NullableString,
    name: z.string(),
    layerName: NullableString,
    code: NullableString,
    isDeleted: z.boolean(),
    isDeleteable: z.boolean(),
    isModifiable: z.boolean(),
    portalLayerId: NullableNumber,
    classImplementations: z.array(ClassImplementation),
    mainClassImplementation: z.null(),
})

export type Template = z.infer<typeof TemplateSchema>
