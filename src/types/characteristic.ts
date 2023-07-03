import { z } from 'zod'
import {
    NullableBoolean,
    NullableNumber,
    NullableString,
    NullableStringArray,
} from '@/types/types'

const GeometryType = z.enum([
    'LineString',
    'MultiLineString',
    'MultiPolygon',
    'Point',
    'Polygon',
])

export const Type = z.enum([
    'boolean',
    'string',
    'double',
    'integer',
    'date',
    'multioption',
    'iotsignal',
    'iotsynoptic',
])

const Template = z.object({
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
    isDeleted: NullableBoolean,
    isDeleteable: NullableBoolean,
    isModifiable: NullableBoolean,
    portalLayerId: NullableNumber,
    classImplementations: z.null(),
    mainClassImplementation: z.null(),
})

const ClassImplementationSchema = z.object({
    id: z.number(),
    tenandId: NullableNumber,
    description: NullableString,
    shortDescription: NullableString,
    active: NullableBoolean,
    origen: NullableString,
    name: NullableString,
    isMainClass: NullableBoolean,
    isDeleted: NullableBoolean,
    code: NullableString,
    isDeleteable: NullableBoolean,
    isModifiable: NullableBoolean,
    characteristics: z.null(),
    template: z.array(Template),
})

export const CharacteristicSchema = z.object({
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
    classImplementations: z.array(ClassImplementationSchema),
})

export type ClassImplementation = z.infer<typeof ClassImplementationSchema>
export type Characteristic = z.infer<typeof CharacteristicSchema>
