import { z } from 'zod'

import {
    NullableBoolean,
    NullableNumber,
    NullableString,
    NullableStringArray,
} from '@/types/types'

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

const GeometryType = z.enum([
    'LineString',
    'MultiLineString',
    'MultiPolygon',
    'Point',
    'Polygon',
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

export const ClassSchema = z.object({
    id: z.number(),
    tenandId: NullableNumber,
    description: z.string(),
    shortDescription: z.string(),
    active: NullableBoolean,
    origen: NullableString,
    name: z.string(),
    isMainClass: NullableBoolean,
    isDeleted: z.boolean(),
    code: NullableString,
    isDeleteable: z.boolean(),
    isModifiable: z.boolean(),
    characteristics: z.array(Characteristic),
    template: z.array(Template),
})

export type Class = z.infer<typeof ClassSchema>
